"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { flushSync } from "react-dom";

import {
  ErrorSummary,
  TextAreaField,
  TextField,
} from "@/components/forms/fields";
import { InquiryReadyPanel } from "@/components/forms/inquiry-ready-panel";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  MESSAGE_MAX_LENGTH,
  prepareContactInquiry,
  validateContactInquiry,
  type PreparedInquiry,
} from "@/lib/inquiry";
import type { ContactInquiry, FieldErrors } from "@/types/inquiry";

const fieldOrder: readonly (keyof ContactInquiry)[] = [
  "name",
  "email",
  "company",
  "message",
];

const fieldId = (field: keyof ContactInquiry) => `contact-${field}`;

export function ContactForm() {
  const [values, setValues] = useState<ContactInquiry>({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors<ContactInquiry>>({});
  const [attempted, setAttempted] = useState(false);
  const [prepared, setPrepared] = useState<PreparedInquiry | null>(null);
  const readyHeadingRef = useRef<HTMLHeadingElement>(null);
  const hydrated = useHydrated();

  const bind =(field: keyof ContactInquiry) => ({
    id: fieldId(field),
    name: field,
    value: values[field],
    error: errors[field],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      setPrepared(null);
      if (attempted) setErrors(validateContactInquiry(next));
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateContactInquiry(values);
    setErrors(nextErrors);
    setAttempted(true);

    const firstInvalid = fieldOrder.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setPrepared(null);
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    flushSync(() => setPrepared(prepareContactInquiry(values)));
    readyHeadingRef.current?.focus();
  };

  const errorList = fieldOrder.flatMap((field) => {
    const message = errors[field];
    return message ? [{ id: fieldId(field), message }] : [];
  });

  return (
    <div>
      <form noValidate onSubmit={handleSubmit} className="grid gap-7">
        {attempted ? <ErrorSummary errors={errorList} /> : null}
        <div className="grid gap-7 sm:grid-cols-2">
          <TextField {...bind("name")} label="Name" autoComplete="name" required />
          <TextField
            {...bind("email")}
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
          />
        </div>
        <TextField
          {...bind("company")}
          label="Company"
          autoComplete="organization"
        />
        <TextAreaField
          {...bind("message")}
          label="Message"
          maxLength={MESSAGE_MAX_LENGTH}
          hint={`Up to ${MESSAGE_MAX_LENGTH.toLocaleString("en")} characters.`}
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
            Prepare message
          </Button>
        </div>
      </form>

      {prepared ? (
        <InquiryReadyPanel inquiry={prepared} headingRef={readyHeadingRef} />
      ) : null}
    </div>
  );
}
