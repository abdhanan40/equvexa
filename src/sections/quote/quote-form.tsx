"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { flushSync } from "react-dom";

import {
  ErrorSummary,
  RadioCardGroup,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/forms/fields";
import { InquiryReadyPanel } from "@/components/forms/inquiry-ready-panel";
import { Button } from "@/components/ui/button";
import { productCategories } from "@/data/product-categories";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  MESSAGE_MAX_LENGTH,
  inquiryTypeOptions,
  prepareQuoteInquiry,
  validateQuoteInquiry,
  type PreparedInquiry,
} from "@/lib/inquiry";
import type { ProductCategorySlug } from "@/types/catalog";
import type { FieldErrors, InquiryType, QuoteInquiry } from "@/types/inquiry";

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
  const [errors, setErrors] = useState<FieldErrors<QuoteInquiry>>({});
  const [attempted, setAttempted] = useState(false);
  const [prepared, setPrepared] = useState<PreparedInquiry | null>(null);
  const readyHeadingRef = useRef<HTMLHeadingElement>(null);
  const hydrated = useHydrated();

  const setField =(field: keyof QuoteInquiry, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    setPrepared(null);
    if (attempted) setErrors(validateQuoteInquiry(next));
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateQuoteInquiry(values);
    setErrors(nextErrors);
    setAttempted(true);

    const firstInvalid = fieldOrder.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setPrepared(null);
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    flushSync(() => setPrepared(prepareQuoteInquiry(values)));
    readyHeadingRef.current?.focus();
  };

  const errorList = fieldOrder.flatMap((field) => {
    const message = errors[field];
    return message ? [{ id: fieldId(field), message }] : [];
  });

  return (
    <div>
      <form noValidate onSubmit={handleSubmit} className="grid gap-8">
        {attempted ? <ErrorSummary errors={errorList} /> : null}

        <div className="grid gap-7 sm:grid-cols-2">
          <TextField
            {...bind("fullName")}
            label="Full name"
            autoComplete="name"
            required
          />
          <TextField
            {...bind("company")}
            label="Business / company name"
            autoComplete="organization"
            required
          />
          <TextField
            {...bind("email")}
            label="Business email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
          />
          <TextField
            {...bind("country")}
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
          label="Message / requirements"
          hint={`Styles, sizes, branding, packaging, delivery country or timing. Up to ${MESSAGE_MAX_LENGTH.toLocaleString("en")} characters.`}
          maxLength={MESSAGE_MAX_LENGTH}
          required
        />

        <div className="flex flex-col gap-5 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            This form prepares your message. You review and send it yourself
            by email or WhatsApp.
          </p>
          <Button
            type="submit"
            size="lg"
            className="shrink-0"
            disabled={!hydrated}
          >
            Prepare inquiry
          </Button>
        </div>
      </form>

      {prepared ? (
        <InquiryReadyPanel inquiry={prepared} headingRef={readyHeadingRef} />
      ) : null}
    </div>
  );
}

function isCategorySlug(value: string | null): value is ProductCategorySlug {
  return productCategories.some((category) => category.slug === value);
}

function isInquiryType(value: string | null): value is InquiryType {
  return inquiryTypeOptions.some((option) => option.value === value);
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
