import { siteConfig } from "@/config/site";
import { getProductCategory } from "@/data/product-categories";
import { mailtoUrl, whatsappUrl } from "@/lib/contact";
import type {
  ContactInquiry,
  FieldErrors,
  InquiryType,
  QuoteInquiry,
} from "@/types/inquiry";

/*
 * Inquiry helpers shared by the quote and contact forms.
 *
 * There is no submission backend yet. A valid form is turned into a message
 * that the visitor sends themselves by email or WhatsApp. When a backend is
 * added, reuse the validators and replace the delivery step.
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateEmail(email: string) {
  if (!email.trim()) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(email.trim())) {
    return "Enter an email address in the format name@company.com.";
  }
  return undefined;
}

export function validateQuoteInquiry(values: QuoteInquiry) {
  const errors: FieldErrors<QuoteInquiry> = {};
  if (!values.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!values.company.trim()) {
    errors.company = "Enter your business or company name.";
  }
  const email = validateEmail(values.email);
  if (email) errors.email = email;
  if (!values.country.trim()) errors.country = "Enter your country.";
  if (!values.category) errors.category = "Select a product category.";
  if (!values.inquiryType) errors.inquiryType = "Select an inquiry type.";
  if (!values.message.trim()) {
    errors.message = "Describe your requirements.";
  }
  return errors;
}

export function validateContactInquiry(values: ContactInquiry) {
  const errors: FieldErrors<ContactInquiry> = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  const email = validateEmail(values.email);
  if (email) errors.email = email;
  if (!values.message.trim()) errors.message = "Enter your message.";
  return errors;
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
