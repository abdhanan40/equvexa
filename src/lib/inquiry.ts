import { siteConfig } from "@/config/site";
import {
  getProductCategory,
  productCategories,
} from "@/data/product-categories";
import { mailtoUrl, whatsappUrl } from "@/lib/contact";
import type { ProductCategorySlug } from "@/types/catalog";
import type {
  ContactInquiry,
  FieldErrors,
  InquiryType,
  QuoteInquiry,
} from "@/types/inquiry";

/*
 * Inquiry rules shared by the forms (in the browser) and by the server, which
 * applies them again as the authority before anything is sent.
 *
 * Submissions are delivered by email from the server
 * (src/server/inquiry). The prepared message below is the fallback the
 * visitor can send themselves by email or WhatsApp if delivery fails.
 */

export const inquiryTypeOptions: readonly {
  value: InquiryType;
  label: string;
}[] = [
  { value: "wholesale", label: "Wholesale" },
  { value: "oem", label: "OEM" },
  { value: "private-label", label: "Private Label" },
  { value: "general", label: "General B2B Inquiry" },
];

export const MESSAGE_MAX_LENGTH = 1000;

/** Maximum length of each field, enforced by the forms and the server. */
export const FIELD_MAX_LENGTH = {
  name: 120,
  fullName: 120,
  company: 160,
  email: 254,
  country: 80,
  quantity: 80,
  message: MESSAGE_MAX_LENGTH,
} as const;

/** Names of the hidden fields that travel with a submission. */
export const INQUIRY_META_FIELDS = {
  /** Spam trap: stays empty for people, bots tend to fill it. */
  trap: "eqx_ref_code",
  /** Milliseconds between the form appearing and being submitted. */
  elapsed: "eqx_elapsed",
  /** Random id of one submission, so a retry is not sent twice. */
  submission: "eqx_submission",
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Control characters. One-line fields also refuse line and paragraph
   separators; the message keeps line breaks and tabs. */
const SINGLE_LINE_FORBIDDEN = /[\u0000-\u001F\u007F\u2028\u2029]/;
const MULTILINE_FORBIDDEN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

export function isCategorySlug(value: unknown): value is ProductCategorySlug {
  return productCategories.some((category) => category.slug === value);
}

export function isInquiryType(value: unknown): value is InquiryType {
  return inquiryTypeOptions.some((option) => option.value === value);
}

function tooLong(value: string, max: number) {
  return value.trim().length > max
    ? `Use ${max.toLocaleString("en")} characters or fewer.`
    : undefined;
}

/** Checks a one-line text field: required, length and characters. */
function checkLine(
  value: string,
  max: number,
  emptyMessage?: string,
): string | undefined {
  if (!value.trim()) return emptyMessage;
  if (SINGLE_LINE_FORBIDDEN.test(value)) {
    return "Remove line breaks and special characters.";
  }
  return tooLong(value, max);
}

function checkMessage(value: string, emptyMessage: string) {
  if (!value.trim()) return emptyMessage;
  if (MULTILINE_FORBIDDEN.test(value)) {
    return "Remove unsupported special characters from your message.";
  }
  return tooLong(value, FIELD_MAX_LENGTH.message);
}

function checkEmail(email: string) {
  if (!email.trim()) return "Enter your email address.";
  if (
    SINGLE_LINE_FORBIDDEN.test(email) ||
    !EMAIL_PATTERN.test(email.trim())
  ) {
    return "Enter an email address in the format name@company.com.";
  }
  return tooLong(email, FIELD_MAX_LENGTH.email);
}

function collect<T>(entries: [keyof T, string | undefined][]): FieldErrors<T> {
  const errors: FieldErrors<T> = {};
  for (const [field, message] of entries) {
    if (message) errors[field] = message;
  }
  return errors;
}

export function validateQuoteInquiry(values: QuoteInquiry) {
  return collect<QuoteInquiry>([
    ["fullName", checkLine(values.fullName, FIELD_MAX_LENGTH.fullName, "Enter your full name.")],
    ["company", checkLine(values.company, FIELD_MAX_LENGTH.company, "Enter your business or company name.")],
    ["email", checkEmail(values.email)],
    ["country", checkLine(values.country, FIELD_MAX_LENGTH.country, "Enter your country.")],
    ["category", isCategorySlug(values.category) ? undefined : "Select a product category."],
    ["quantity", values.quantity.trim() ? checkLine(values.quantity, FIELD_MAX_LENGTH.quantity) : undefined],
    ["inquiryType", isInquiryType(values.inquiryType) ? undefined : "Select an inquiry type."],
    ["message", checkMessage(values.message, "Describe your requirements.")],
  ]);
}

export function validateContactInquiry(values: ContactInquiry) {
  return collect<ContactInquiry>([
    ["name", checkLine(values.name, FIELD_MAX_LENGTH.name, "Enter your name.")],
    ["email", checkEmail(values.email)],
    ["company", values.company.trim() ? checkLine(values.company, FIELD_MAX_LENGTH.company) : undefined],
    ["message", checkMessage(values.message, "Enter your message.")],
  ]);
}

export type PreparedInquiry = {
  subject: string;
  body: string;
  emailUrl: string;
  whatsappUrl: string;
};

function prepare(subject: string, lines: (string | false)[]): PreparedInquiry {
  const body = lines.filter((line) => line !== false).join("\n");
  return {
    subject,
    body,
    emailUrl: mailtoUrl({ subject, body: body.replaceAll("\n", "\r\n") }),
    whatsappUrl: whatsappUrl(`${subject}\n\n${body}`),
  };
}

export function prepareQuoteInquiry(values: QuoteInquiry): PreparedInquiry {
  const category = getProductCategory(values.category)?.name ?? "";
  const inquiryType =
    inquiryTypeOptions.find((option) => option.value === values.inquiryType)
      ?.label ?? "";

  return prepare(
    `Quote request: ${category} (${inquiryType})`,
    [
      `Hello ${siteConfig.brand},`,
      "",
      "I would like to request a quote.",
      "",
      `Inquiry type: ${inquiryType}`,
      `Product category: ${category}`,
      values.quantity.trim() !== "" &&
        `Estimated quantity: ${values.quantity.trim()}`,
      `Company: ${values.company.trim()}`,
      `Country: ${values.country.trim()}`,
      "",
      "Requirements:",
      values.message.trim(),
      "",
      `${values.fullName.trim()}`,
      `${values.email.trim()}`,
    ],
  );
}

export function prepareContactInquiry(values: ContactInquiry): PreparedInquiry {
  return prepare(`Inquiry from ${values.name.trim()}`, [
    `Hello ${siteConfig.brand},`,
    "",
    values.message.trim(),
    "",
    values.name.trim(),
    values.company.trim() !== "" && values.company.trim(),
    values.email.trim(),
  ]);
}
