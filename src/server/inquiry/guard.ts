/*
 * Rules and shapes shared by the two places inquiry state can live:
 *
 *   - the in-memory store (src/server/inquiry/store.ts), used by `next dev`
 *     and `next start`, where one server process sees every request;
 *   - the InquiryGuard Durable Object (cloudflare/inquiry-guard.ts), used on
 *     Cloudflare Workers, where requests are spread over many isolates.
 *
 * This file is bundled into both Next.js and the Worker, so it must stay free
 * of imports: no Node.js, Next.js or Workers APIs.
 */

/** Per-visitor attempt limits: at most `max` attempts in any `durationMs`. */
export const RATE_LIMIT_WINDOWS = [
  { durationMs: 10 * 60 * 1000, max: 5 },
  { durationMs: 24 * 60 * 60 * 1000, max: 20 },
] as const;

export const LONGEST_WINDOW_MS =
  RATE_LIMIT_WINDOWS[RATE_LIMIT_WINDOWS.length - 1].durationMs;

/** Whether one more attempt at `now` would exceed a window. */
export function windowIsFull(attemptTimes: readonly number[], now: number) {
  return RATE_LIMIT_WINDOWS.some(
    (window) =>
      attemptTimes.filter((time) => now - time < window.durationMs).length >=
      window.max,
  );
}

/** How long a submission is remembered, so a retry reuses its reference. */
export const SUBMISSION_TTL_MS = 30 * 60 * 1000;

/**
 * How long one attempt may hold a submission while it is being sent. Longer
 * than the email request timeout, so an attempt that died mid-send releases
 * the submission again.
 */
export const SUBMISSION_LEASE_MS = 20 * 1000;

/** The reference and receipt time an inquiry email is built with. */
export type SubmissionRecord = { reference: string; receivedAt: number };

export type SubmissionStatus =
  /** Never seen, or forgotten after SUBMISSION_TTL_MS. */
  | { state: "new" }
  /** Seen before but not delivered, and no attempt is sending it now. */
  | { state: "open"; record: SubmissionRecord }
  /** Another attempt is sending it right now. */
  | { state: "sending"; record: SubmissionRecord }
  | { state: "sent"; record: SubmissionRecord };

export type SubmissionClaim =
  | { claimed: true; record: SubmissionRecord }
  | { claimed: false; status: SubmissionStatus };

/**
 * The calls the Durable Object answers. Each instance holds a single key,
 * either one visitor or one submission, and handles one call at a time.
 */
export interface InquiryGuardMethods {
  /** Records an attempt unless the visitor has reached a limit. */
  takeAttempt(): Promise<boolean>;
  submissionStatus(): Promise<SubmissionStatus>;
  /**
   * Takes the submission for sending. The first claim stores `candidate`;
   * later claims reuse the stored record, so a retry sends the same email.
   */
  claimSubmission(candidate: SubmissionRecord): Promise<SubmissionClaim>;
  /** Releases the claim and records whether the email went out. */
  finishSubmission(sent: boolean): Promise<void>;
}

/** Durable Object names: one instance per visitor, one per submission. */
export const guardName = {
  visitor: (visitorKey: string) => `visitor:${visitorKey}`,
  submission: (submissionKey: string) => `submission:${submissionKey}`,
};
