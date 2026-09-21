import type { ProductCategorySlug } from "@/types/catalog";

export type InquiryType = "wholesale" | "oem" | "private-label" | "general";

/** Fields of the Request a Quote form. Empty strings mean "not chosen". */
export type QuoteInquiry = {
  fullName: string;
  company: string;
  email: string;
  country: string;
  category: ProductCategorySlug | "";
  quantity: string;
  inquiryType: InquiryType | "";
  message: string;
};

/** Fields of the contact page form. */
export type ContactInquiry = {
  name: string;
  email: string;
  company: string;
  message: string;
};

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/** Which website form an inquiry came from. */
export type InquiryForm = "quote" | "contact";

/**
 * What the server tells a form after a submission. Deliberately small: it
 * never carries provider details or the reason a submission was refused.
 */
export type InquirySubmissionResult<T> =
  | { status: "sent"; reference: string }
  | { status: "invalid"; errors: FieldErrors<T> }
  | { status: "failed" }
  | { status: "rate-limited" };
