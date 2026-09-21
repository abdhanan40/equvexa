import "server-only";

import type { InquiryForm } from "@/types/inquiry";

/**
 * Outcomes recorded for an inquiry submission. "dropped" and "suspicious"
 * are spam decisions; the visitor is never told which check applied.
 */
export type InquiryOutcome =
  | "sent"
  | "duplicate"
  | "invalid"
  | "rate-limited"
  | "dropped"
  | "suspicious"
  | "failed";

/**
 * One inquiry event. The fields are fixed on purpose: this is everything the
 * server may log about a submission. Never add names, email addresses,
 * company names, messages, IP addresses, headers or environment values.
 */
export type InquiryLogEvent = {
  form: InquiryForm;
  outcome: InquiryOutcome;
  /** Why a submission was held back or failed, as a short code. */
  reason?: string;
  reference?: string;
  category?: string;
  inquiryType?: string;
  /** Email provider HTTP status and message id or error code. */
  providerStatus?: number;
  providerId?: string;
  providerError?: string;
  durationMs: number;
  /** First characters of a salted hash of the visitor address. */
  visitor?: string;
};

export function logInquiry(event: InquiryLogEvent) {
  const line = JSON.stringify({ event: "inquiry", ...event });
  if (event.outcome === "failed") console.error(line);
  else if (event.outcome === "sent" || event.outcome === "duplicate") console.info(line);
  else console.warn(line);
}
