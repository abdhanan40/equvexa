"use client";

import { useState, type ChangeEvent } from "react";

import {
  ErrorSummary,
  TextAreaField,
  TextField,
} from "@/components/forms/fields";
import { InquiryFallbackPanel } from "@/components/forms/inquiry-fallback-panel";
import { InquirySentPanel } from "@/components/forms/inquiry-sent-panel";
import { SpamTrap } from "@/components/forms/spam-trap";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useHydrated } from "@/hooks/use-hydrated";
import { useInquirySubmission } from "@/hooks/use-inquiry-submission";
import {
  FIELD_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  prepareContactInquiry,
  validateContactInquiry,
} from "@/lib/inquiry";
import { submitContactInquiry } from "@/server/inquiry/actions";
import type { ContactInquiry } from "@/types/inquiry";

const emptyContactInquiry: ContactInquiry = {
  name: "",
  email: "",
  company: "",
  message: "",
};

const fieldOrder: readonly (keyof ContactInquiry)[] = [
  "name",
  "email",
  "company",
  "message",
];

const fieldId = (field: keyof ContactInquiry) => `contact-${field}`;

export function ContactForm() {
  const [values, setValues] = useState<ContactInquiry>(emptyContactInquiry);
  // Kept when the form clears, so the confirmation can name it.
  const [sentTo, setSentTo] = useState("");
  const hydrated = useHydrated();

  const submission = useInquirySubmission<ContactInquiry>({
    validate: validateContactInquiry,
    send: submitContactInquiry,
    fieldOrder,
    fieldId,
    onSent: () => {
      setSentTo(values.email.trim());
      setValues(emptyContactInquiry);
    },
  });
  const { state, errors, attempted, sending } = submission;

  const bind = (field: keyof ContactInquiry) => ({
    id: fieldId(field),
    name: field,
    value: values[field],
    error: errors[field],
    maxLength: FIELD_MAX_LENGTH[field],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = { ...values, [field]: event.target.value };
      setValues(next);
      submission.handleChange(next);
    },
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
        className="relative grid gap-7"
      >
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
          hint={`Up to ${MESSAGE_MAX_LENGTH.toLocaleString("en")} characters.`}
          required
        />
        <SpamTrap />
        <div className="flex flex-col gap-5 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Your message is sent to the {siteConfig.brand} inbox. Your email
            address is used only to reply to you.
          </p>
          <Button
            type="submit"
            size="lg"
            className="shrink-0"
            disabled={!hydrated || sending}
          >
            {sending ? "Sending..." : "Send message"}
          </Button>
        </div>
        <p aria-live="polite" className="sr-only">
          {sending ? "Sending your message." : ""}
        </p>
      </form>

      {state.status === "sent" ? (
        <InquirySentPanel
          title="Your message has been sent"
          description={`It is on its way to the ${siteConfig.brand} inbox. Keep the reference below if you write to us again about this message.`}
          reference={state.reference}
          replyTo={sentTo}
        />
      ) : null}

      {state.status === "failed" || state.status === "rate-limited" ? (
        <InquiryFallbackPanel
          inquiry={prepareContactInquiry(values)}
          title={
            state.status === "rate-limited"
              ? "Too many messages from this device"
              : "Your message could not be sent"
          }
          intro={
            state.status === "rate-limited"
              ? `Several messages have already been sent from this device. Please wait a few minutes before trying again, or send this one yourself by email or WhatsApp.`
              : `The website could not deliver your message to ${siteConfig.brand}. Everything you typed is still in the form above. Try again, or send the same message yourself by email or WhatsApp.`
          }
          onRetry={submission.retry}
        />
      ) : null}
    </div>
  );
}
