"use client";

import { useSearchParams } from "next/navigation";
import { useState, type ChangeEvent } from "react";

import {
  ErrorSummary,
  RadioCardGroup,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/forms/fields";
import { InquiryFallbackPanel } from "@/components/forms/inquiry-fallback-panel";
import { InquirySentPanel } from "@/components/forms/inquiry-sent-panel";
import { SpamTrap } from "@/components/forms/spam-trap";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { productCategories } from "@/data/product-categories";
import { useHydrated } from "@/hooks/use-hydrated";
import { useInquirySubmission } from "@/hooks/use-inquiry-submission";
import {
  FIELD_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  inquiryTypeOptions,
  isCategorySlug,
  isInquiryType,
  prepareQuoteInquiry,
  validateQuoteInquiry,
} from "@/lib/inquiry";
import { submitQuoteInquiry } from "@/server/inquiry/actions";
import type { QuoteInquiry } from "@/types/inquiry";

const emptyQuoteInquiry: QuoteInquiry = {
  fullName: "",
  company: "",
  email: "",
  country: "",
  category: "",
  quantity: "",
  inquiryType: "",
  message: "",
};

const fieldOrder: readonly (keyof QuoteInquiry)[] = [
  "fullName",
  "company",
  "email",
  "country",
  "category",
  "quantity",
  "inquiryType",
  "message",
];

const fieldId = (field: keyof QuoteInquiry) => `quote-${field}`;

const categoryOptions = productCategories.map((category) => ({
  value: category.slug,
  label: category.name,
}));

export function QuoteForm({ defaults }: { defaults: QuoteInquiry }) {
  const [values, setValues] = useState(defaults);
  // Kept when the form clears, so the confirmation can name it.
  const [sentTo, setSentTo] = useState("");
  const hydrated = useHydrated();

  const submission = useInquirySubmission<QuoteInquiry>({
    validate: validateQuoteInquiry,
    send: submitQuoteInquiry,
    fieldOrder,
    fieldId,
    // The category and inquiry type a link preselected stay chosen.
    onSent: () => {
      setSentTo(values.email.trim());
      setValues({
        ...emptyQuoteInquiry,
        category: defaults.category,
        inquiryType: defaults.inquiryType,
      });
    },
  });
  const { state, errors, attempted, sending } = submission;

  const setField = (field: keyof QuoteInquiry, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    submission.handleChange(next);
  };

  const bind = (field: keyof QuoteInquiry) => ({
    id: fieldId(field),
    name: field,
    value: values[field],
    error: errors[field],
    onChange: (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => setField(field, event.target.value),
  });

  const limit = (field: keyof typeof FIELD_MAX_LENGTH) => ({
    maxLength: FIELD_MAX_LENGTH[field],
  });

  const errorList = fieldOrder.flatMap((field) => {
    const message = errors[field];
    return message ? [{ id: fieldId(field), message }] : [];
  });

  return (
    <div>
      <form
        noValidate
        onSubmit={(event) => submission.submit(event, values)}
        className="relative grid gap-8"
      >
        {attempted ? <ErrorSummary errors={errorList} /> : null}

        <div className="grid gap-7 sm:grid-cols-2">
          <TextField
            {...bind("fullName")}
            {...limit("fullName")}
            label="Full name"
            autoComplete="name"
            required
          />
          <TextField
            {...bind("company")}
            {...limit("company")}
            label="Business / company name"
            autoComplete="organization"
            required
          />
          <TextField
            {...bind("email")}
            {...limit("email")}
            label="Business email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
          />
          <TextField
            {...bind("country")}
            {...limit("country")}
            label="Country"
            autoComplete="country-name"
            required
          />
          <SelectField
            {...bind("category")}
            label="Product category"
            placeholder="Select a category"
            options={categoryOptions}
            required
          />
          <TextField
            {...bind("quantity")}
            {...limit("quantity")}
            label="Estimated quantity"
            hint="For example: 300 pairs or 50 units per style."
          />
        </div>

        <RadioCardGroup
          id={fieldId("inquiryType")}
          name="inquiryType"
          label="Inquiry type"
          options={inquiryTypeOptions}
          value={values.inquiryType}
          error={errors.inquiryType}
          onChange={(value) => setField("inquiryType", value)}
          required
        />

        <TextAreaField
          {...bind("message")}
          {...limit("message")}
          label="Message / requirements"
          hint={`Styles, sizes, branding, packaging, delivery country or timing. Up to ${MESSAGE_MAX_LENGTH.toLocaleString("en")} characters.`}
          required
        />

        <SpamTrap />

        <div className="flex flex-col gap-5 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Your inquiry is sent to the {siteConfig.brand} inbox. Your details
            are used only to answer it.
          </p>
          <Button
            type="submit"
            size="lg"
            className="shrink-0"
            disabled={!hydrated || sending}
          >
            {sending ? "Sending..." : "Send inquiry"}
          </Button>
        </div>
        <p aria-live="polite" className="sr-only">
          {sending ? "Sending your inquiry." : ""}
        </p>
      </form>

      {state.status === "sent" ? (
        <InquirySentPanel
          title="Your inquiry has been sent"
          description={`It is on its way to the ${siteConfig.brand} inbox. Keep the reference below if you write to us again about this inquiry.`}
          reference={state.reference}
          replyTo={sentTo}
        />
      ) : null}

      {state.status === "failed" || state.status === "rate-limited" ? (
        <InquiryFallbackPanel
          inquiry={prepareQuoteInquiry(values)}
          title={
            state.status === "rate-limited"
              ? "Too many inquiries from this device"
              : "Your inquiry could not be sent"
          }
          intro={
            state.status === "rate-limited"
              ? "Several inquiries have already been sent from this device. Please wait a few minutes before trying again, or send this one yourself by email or WhatsApp."
              : `The website could not deliver your inquiry to ${siteConfig.brand}. Everything you typed is still in the form above. Try again, or send the same inquiry yourself by email or WhatsApp.`
          }
          onRetry={submission.retry}
        />
      ) : null}
    </div>
  );
}

/** Static render of the empty form, used while search parameters resolve. */
export function QuoteFormFallback() {
  return <QuoteForm defaults={emptyQuoteInquiry} />;
}

/** Preselects category and inquiry type from links such as ?category=stirrups. */
export function QuoteFormFromSearchParams() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const inquiry = searchParams.get("inquiry");
  const defaults: QuoteInquiry = {
    ...emptyQuoteInquiry,
    category: isCategorySlug(category) ? category : "",
    inquiryType: isInquiryType(inquiry) ? inquiry : "",
  };

  return (
    <QuoteForm
      key={`${defaults.category}:${defaults.inquiryType}`}
      defaults={defaults}
    />
  );
}
