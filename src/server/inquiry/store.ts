import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare/cloudflare-context";

import { logGuardFailure, warnOnce } from "../log";
import {
  LONGEST_WINDOW_MS,
  SUBMISSION_LEASE_MS,
  SUBMISSION_TTL_MS,
  guardName,
  windowIsFull,
  type InquiryGuardMethods,
  type SubmissionClaim,
  type SubmissionRecord,
  type SubmissionStatus,
} from "./guard";

/*
 * Where rate-limit attempts and submission records are kept.
 *
 * On Cloudflare Workers, requests are spread over many short-lived isolates,
 * so this state lives in the InquiryGuard Durable Object
 * (cloudflare/inquiry-guard.ts): one strongly consistent instance per visitor
 * and per submission. Everywhere else (`next dev`, `next start`) one server
 * process sees every request, and its memory is enough.
 */

export interface InquiryStore {
  readonly kind: "durable-object" | "memory";
  /** Records an attempt unless the visitor has reached a limit. */
  takeAttempt(visitorKey: string): Promise<boolean>;
  submissionStatus(submissionKey: string): Promise<SubmissionStatus>;
  claimSubmission(
    submissionKey: string,
    candidate: SubmissionRecord,
  ): Promise<SubmissionClaim>;
  finishSubmission(submissionKey: string, sent: boolean): Promise<void>;
}

/* --- Durable Object ------------------------------------------------------ */

/** The parts of the Durable Object binding used here. */
type GuardNamespace = {
  idFromName(name: string): unknown;
  get(id: unknown): InquiryGuardMethods;
};

function durableObjectStore(namespace: GuardNamespace): InquiryStore {
  const guard = (name: string) => namespace.get(namespace.idFromName(name));

  // A failing call must not stop a genuine inquiry: the submission carries on
  // without that safeguard, and the failure is logged.
  async function attempt<T>(operation: string, call: () => Promise<T>, fallback: T) {
    try {
      return await call();
    } catch (error) {
      logGuardFailure(operation, error);
      return fallback;
    }
  }

  return {
    kind: "durable-object",
    takeAttempt: (visitorKey) =>
      attempt("takeAttempt", () => guard(guardName.visitor(visitorKey)).takeAttempt(), true),
    submissionStatus: (key) =>
      attempt(
        "submissionStatus",
        () => guard(guardName.submission(key)).submissionStatus(),
        { state: "new" } as SubmissionStatus,
      ),
    claimSubmission: (key, candidate) =>
      attempt(
        "claimSubmission",
        () => guard(guardName.submission(key)).claimSubmission(candidate),
        { claimed: true, record: candidate } as SubmissionClaim,
      ),
    finishSubmission: (key, sent) =>
      attempt(
        "finishSubmission",
        () => guard(guardName.submission(key)).finishSubmission(sent),
        undefined,
      ),
  };
}

/* --- Memory (local fallback) --------------------------------------------- */

/** Upper bounds, so memory cannot grow without limit. */
const MAX_VISITORS = 5000;
const MAX_SUBMISSIONS = 1000;

const attempts = new Map<string, number[]>();

type MemorySubmission = { record: SubmissionRecord; sent: boolean; leaseUntil: number };
const submissions = new Map<string, MemorySubmission>();

function pruneAttempts(now: number) {
  for (const [key, times] of attempts) {
    const recent = times.filter((time) => now - time < LONGEST_WINDOW_MS);
    if (recent.length === 0) attempts.delete(key);
    else attempts.set(key, recent);
  }
  // Forget the visitors seen longest ago if the map is still too large.
  while (attempts.size > MAX_VISITORS) {
    const oldest = attempts.keys().next().value;
    if (oldest === undefined) break;
    attempts.delete(oldest);
  }
}

function pruneSubmissions(now: number) {
  for (const [key, entry] of submissions) {
    if (entry.record.receivedAt + SUBMISSION_TTL_MS <= now) submissions.delete(key);
  }
  while (submissions.size > MAX_SUBMISSIONS) {
    const oldest = submissions.keys().next().value;
    if (oldest === undefined) break;
    submissions.delete(oldest);
  }
}

function statusOf(entry: MemorySubmission | undefined, now: number): SubmissionStatus {
  if (!entry) return { state: "new" };
  if (entry.sent) return { state: "sent", record: entry.record };
  if (entry.leaseUntil > now) return { state: "sending", record: entry.record };
  return { state: "open", record: entry.record };
}

const memoryStore: InquiryStore = {
  kind: "memory",
  async takeAttempt(visitorKey) {
    const now = Date.now();
    if (attempts.size > MAX_VISITORS / 2) pruneAttempts(now);
    const times = (attempts.get(visitorKey) ?? []).filter(
      (time) => now - time < LONGEST_WINDOW_MS,
    );
    const limited = windowIsFull(times, now);
    if (!limited) times.push(now);
    // Re-insert so the map stays ordered from least to most recently seen.
    attempts.delete(visitorKey);
    attempts.set(visitorKey, times);
    return !limited;
  },
  async submissionStatus(key) {
    const now = Date.now();
    pruneSubmissions(now);
    return statusOf(submissions.get(key), now);
  },
  async claimSubmission(key, candidate) {
    const now = Date.now();
    pruneSubmissions(now);
    const status = statusOf(submissions.get(key), now);
    if (status.state === "sent" || status.state === "sending") {
      return { claimed: false, status };
    }
    const record = status.state === "open" ? status.record : candidate;
    submissions.set(key, { record, sent: false, leaseUntil: now + SUBMISSION_LEASE_MS });
    return { claimed: true, record };
  },
  async finishSubmission(key, sent) {
    const entry = submissions.get(key);
    if (entry) {
      entry.sent = sent;
      entry.leaseUntil = 0;
    }
  },
};

/* --- Selection ----------------------------------------------------------- */

export type InquiryGuard = {
  store: InquiryStore;
  /** Running on Cloudflare Workers, where CF-Connecting-IP can be trusted. */
  onCloudflare: boolean;
};

export function getInquiryGuard(): InquiryGuard {
  let env: Record<string, unknown> | undefined;
  try {
    env = getCloudflareContext().env as unknown as Record<string, unknown>;
  } catch {
    // Not running on Cloudflare Workers: `next dev` or `next start`.
    return { store: memoryStore, onCloudflare: false };
  }
  const namespace = env.INQUIRY_GUARD as GuardNamespace | undefined;
  if (namespace) return { store: durableObjectStore(namespace), onCloudflare: true };
  // Deployed without the binding: limits then only apply per isolate.
  warnOnce("inquiry-guard-binding-missing");
  return { store: memoryStore, onCloudflare: true };
}
