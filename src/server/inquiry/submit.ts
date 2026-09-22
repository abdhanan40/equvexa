import "server-only";

import { randomInt, randomUUID } from "node:crypto";
import { headers } from "next/headers";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import {
  isCategorySlug,
  isInquiryType,
  validateContactInquiry,
  validateQuoteInquiry,
} from "@/lib/inquiry";
import { sendEmail } from "@/server/email/resend";
import { logInquiry, type InquiryOutcome } from "@/server/log";
import type {
  ContactInquiry,
  FieldErrors,
  InquiryForm,
  InquirySubmissionResult,
  QuoteInquiry,
} from "@/types/inquiry";

import { contactEmail, quoteEmail, type InquiryEmail } from "./email-template";
import { SUBMISSION_LEASE_MS, type SubmissionStatus } from "./guard";
import {
  parseContactInquiry,
  parseQuoteInquiry,
  parseSubmissionMeta,
} from "./parse";
import { identifyVisitor } from "./rate-limit";
import { checkBehaviour, checkTrap } from "./spam";
import { getInquiryGuard, type InquiryStore } from "./store";

/*
 * The inquiry pipeline behind both forms:
 *
 *   spam trap → validation → duplicate check → rate limit → behaviour checks
 *   → email to EQUVEXA through Resend → result for the form
 *
 * The recipient is fixed on the server. Only a small status goes back to the
 * browser. Nothing about a submission is kept beyond a short-lived note of
 * its reference and whether it was sent, which stops a retry from being sent
 * twice (store.ts: a Durable Object on Cloudflare, memory elsewhere).
 */

type EmailContext = { reference: string; receivedAt: Date; sourcePath: string };

type Submission<T> = {
  form: InquiryForm;
  route: string;
  values: T;
  errors: FieldErrors<T>;
  replyTo: string;
  /** Free text checked for links. */
  text: string;
  email: (context: EmailContext) => InquiryEmail;
  logFields: { category?: string; inquiryType?: string };
};

/* --- References ----------------------------------------------------------- */

// Crockford base32: no I, L, O or U, so references read back unambiguously.
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** A short reference such as EQX-260919-7F3K2 (date in UTC, 32^5 suffixes a day). */
function createReference(date: Date) {
  const day = date.toISOString().slice(2, 10).replaceAll("-", "");
  let suffix = "";
  for (let i = 0; i < 5; i++) suffix += ALPHABET[randomInt(ALPHABET.length)];
  return `EQX-${day}-${suffix}`;
}

/* --- Duplicate protection ------------------------------------------------ */

const WAIT_STEP_MS = 400;

/**
 * Another attempt is sending this same submission (a repeated request). Waits
 * for it to finish, up to the time it may hold the submission, and reports
 * how it ended.
 */
async function waitForOtherAttempt(store: InquiryStore, key: string) {
  const deadline = Date.now() + SUBMISSION_LEASE_MS;
  let status: SubmissionStatus;
  do {
    await new Promise((resolve) => setTimeout(resolve, WAIT_STEP_MS));
    status = await store.submissionStatus(key);
  } while (status.state === "sending" && Date.now() < deadline);
  return status;
}

/* --- Source page --------------------------------------------------------- */

/**
 * The page the inquiry was sent from, taken from the request's Referer.
 * Only this site's own form page is accepted, with its known query
 * parameters; anything else falls back to the form's route.
 */
function sourcePath(requestHeaders: Pick<Headers, "get">, route: string) {
  const referer = requestHeaders.get("referer");
  const hosts = [requestHeaders.get("host"), requestHeaders.get("x-forwarded-host")];
  if (!referer) return route;
  let url: URL;
  try {
    url = new URL(referer);
  } catch {
    return route;
  }
  if (!hosts.includes(url.host) || url.pathname !== route) return route;

  const params = new URLSearchParams();
  const category = url.searchParams.get("category");
  const inquiry = url.searchParams.get("inquiry");
  if (isCategorySlug(category)) params.set("category", category);
  if (isInquiryType(inquiry)) params.set("inquiry", inquiry);
  const query = params.toString();
  return query ? `${route}?${query}` : route;
}

/* --- Delivery configuration ---------------------------------------------- */

const ONE_LINE = /^[^\u0000-\u001F\u007F]+$/;

function deliveryAddresses() {
  const from = process.env.INQUIRY_FROM_EMAIL?.trim();
  const to = process.env.INQUIRY_TO_EMAIL?.trim() || siteConfig.contact.email;
  if (!from || !ONE_LINE.test(from) || !ONE_LINE.test(to)) return null;
  return { from, to };
}

/* --- Pipeline ------------------------------------------------------------- */

async function submit<T>(
  formData: FormData,
  read: (formData: FormData) => Submission<T>,
): Promise<InquirySubmissionResult<T>> {
  const started = Date.now();
  const requestHeaders = await headers();
  const guard = getInquiryGuard();
  const { store } = guard;
  const visitor = identifyVisitor(requestHeaders, guard);
  const meta = parseSubmissionMeta(formData);
  const submission = read(formData);

  const log = (outcome: InquiryOutcome, extra: Partial<Parameters<typeof logInquiry>[0]> = {}) =>
    logInquiry({
      form: submission.form,
      outcome,
      visitor: visitor.logId,
      durationMs: Date.now() - started,
      ...submission.logFields,
      ...extra,
    });

  // Spam trap: people never fill it. Answer as if sent and send nothing.
  if (checkTrap(meta).kind === "drop") {
    await store.takeAttempt(visitor.key);
    log("dropped", { reason: "trap" });
    return { status: "sent", reference: createReference(new Date()) };
  }

  const invalidFields = Object.keys(submission.errors);
  if (invalidFields.length > 0) {
    log("invalid", { reason: invalidFields.join(",") });
    return { status: "invalid", errors: submission.errors };
  }

  // A submission already sent (a double click, or a retry after a lost
  // response) returns the same result instead of sending again. A request
  // without a submission id is hand-made; it is not tracked.
  const key = meta.submissionId ? `${submission.form}:${meta.submissionId}` : null;

  const answerRepeat = async (
    status: SubmissionStatus,
  ): Promise<InquirySubmissionResult<T>> => {
    const settled =
      status.state === "sending" && key ? await waitForOtherAttempt(store, key) : status;
    if (settled.state === "sent") {
      log("duplicate", { reference: settled.record.reference });
      return { status: "sent", reference: settled.record.reference };
    }
    log("failed", { reason: "repeat-not-delivered" });
    return { status: "failed" };
  };

  if (key) {
    const earlier = await store.submissionStatus(key);
    if (earlier.state === "sent" || earlier.state === "sending") {
      return answerRepeat(earlier);
    }
  }

  if (!(await store.takeAttempt(visitor.key))) {
    log("rate-limited");
    return { status: "rate-limited" };
  }

  // Too fast or too many links: not sent, and answered like a failure so the
  // visitor can still send it themselves.
  const verdict = checkBehaviour(meta, submission.text);
  if (verdict.kind === "suspicious") {
    log("suspicious", { reason: verdict.reason });
    return { status: "failed" };
  }

  const addresses = deliveryAddresses();
  if (!addresses) {
    log("failed", { reason: "not-configured" });
    return { status: "failed" };
  }

  // Retries of the same submission reuse its reference and time, so the
  // email is identical and Resend's idempotency key can recognise it.
  const now = Date.now();
  let record = { reference: createReference(new Date(now)), receivedAt: now };
  if (key) {
    const claim = await store.claimSubmission(key, record);
    if (!claim.claimed) return answerRepeat(claim.status);
    record = claim.record;
  }

  const email = submission.email({
    reference: record.reference,
    receivedAt: new Date(record.receivedAt),
    sourcePath: sourcePath(requestHeaders, submission.route),
  });
  const result = await sendEmail({
    ...addresses,
    replyTo: submission.replyTo,
    ...email,
    idempotencyKey: `equvexa-inquiry/${key ?? `${submission.form}:${randomUUID()}`}`,
  });
  if (key) await store.finishSubmission(key, result.ok);

  if (result.ok) {
    log("sent", {
      reference: record.reference,
      providerStatus: result.status,
      providerId: result.id,
    });
    return { status: "sent", reference: record.reference };
  }
  log("failed", {
    reason: result.error,
    reference: record.reference,
    providerStatus: result.status,
    providerError: result.code,
  });
  return { status: "failed" };
}

/* --- Forms ---------------------------------------------------------------- */

export function submitQuote(formData: FormData) {
  return submit<QuoteInquiry>(formData, (data) => {
    const values = parseQuoteInquiry(data);
    return {
      form: "quote",
      route: routes.requestQuote,
      values,
      errors: validateQuoteInquiry(values),
      replyTo: values.email,
      text: [values.fullName, values.company, values.country, values.quantity, values.message].join("\n"),
      email: (context) => quoteEmail(values, context),
      logFields: {
        category: isCategorySlug(values.category) ? values.category : undefined,
        inquiryType: isInquiryType(values.inquiryType) ? values.inquiryType : undefined,
      },
    };
  });
}

export function submitContact(formData: FormData) {
  return submit<ContactInquiry>(formData, (data) => {
    const values = parseContactInquiry(data);
    return {
      form: "contact",
      route: routes.contact,
      values,
      errors: validateContactInquiry(values),
      replyTo: values.email,
      text: [values.name, values.company, values.message].join("\n"),
      email: (context) => contactEmail(values, context),
      logFields: {},
    };
  });
}
