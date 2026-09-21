"use server";

import type {
  ContactInquiry,
  InquirySubmissionResult,
  QuoteInquiry,
} from "@/types/inquiry";

import { submitContact, submitQuote } from "./submit";

/*
 * The only inquiry entry points the browser can reach. Everything they need
 * is in the submitted form data; the recipient address, the API key and the
 * checks all stay on the server.
 */

export async function submitQuoteInquiry(
  formData: FormData,
): Promise<InquirySubmissionResult<QuoteInquiry>> {
  return submitQuote(formData);
}

export async function submitContactInquiry(
  formData: FormData,
): Promise<InquirySubmissionResult<ContactInquiry>> {
  return submitContact(formData);
}
