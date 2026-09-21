import "server-only";

import { INQUIRY_META_FIELDS } from "@/lib/inquiry";
import type { ContactInquiry, QuoteInquiry } from "@/types/inquiry";

/*
 * Turns submitted form data into plain, normalised strings. Nothing here
 * decides whether the values are acceptable: that is the validators' job.
 * Unknown fields are ignored, and a file sent in place of text reads as empty.
 */

function readText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.normalize("NFC") : "";
}

/** One-line fields: surrounding space removed, anything inside kept for the validators. */
function line(formData: FormData, name: string) {
  return readText(formData, name).trim();
}

/** The message: line endings unified, surrounding space removed. */
function multiline(formData: FormData, name: string) {
  return readText(formData, name).replace(/\r\n?/g, "\n").trim();
}

export function parseQuoteInquiry(formData: FormData): QuoteInquiry {
  return {
    fullName: line(formData, "fullName"),
    company: line(formData, "company"),
    email: line(formData, "email"),
    country: line(formData, "country"),
    // Checked against the allowed values by the validator.
    category: line(formData, "category") as QuoteInquiry["category"],
    quantity: line(formData, "quantity"),
    inquiryType: line(formData, "inquiryType") as QuoteInquiry["inquiryType"],
    message: multiline(formData, "message"),
  };
}

export function parseContactInquiry(formData: FormData): ContactInquiry {
  return {
    name: line(formData, "name"),
    email: line(formData, "email"),
    company: line(formData, "company"),
    message: multiline(formData, "message"),
  };
}

const SUBMISSION_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export type SubmissionMeta = {
  /** The spam trap field was filled in. */
  trapFilled: boolean;
  /** Time the form was open before submitting, or null if not supplied. */
  elapsedMs: number | null;
  /** Well-formed submission id, or null. */
  submissionId: string | null;
};

export function parseSubmissionMeta(formData: FormData): SubmissionMeta {
  const elapsed = Number(readText(formData, INQUIRY_META_FIELDS.elapsed));
  const submissionId = readText(formData, INQUIRY_META_FIELDS.submission).toLowerCase();
  return {
    trapFilled: readText(formData, INQUIRY_META_FIELDS.trap).trim() !== "",
    elapsedMs: Number.isFinite(elapsed) && elapsed >= 0 ? elapsed : null,
    submissionId: SUBMISSION_ID.test(submissionId) ? submissionId : null,
  };
}
