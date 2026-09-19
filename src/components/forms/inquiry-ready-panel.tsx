"use client";

import { useState, type Ref } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import {
  CheckIcon,
  CopyIcon,
  MailIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { mailtoUrl } from "@/lib/contact";
import type { PreparedInquiry } from "@/lib/inquiry";

type CopyState = "idle" | "copied" | "failed";

/**
 * Shown after a form validates. Nothing is sent by the website: the visitor
 * chooses email or WhatsApp and sends the pre-filled message themselves.
 */
export function InquiryReadyPanel({
  inquiry,
  headingRef,
}: {
  inquiry: PreparedInquiry;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const fullText = `${inquiry.subject}\n\n${inquiry.body}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <section
      aria-labelledby="inquiry-ready-title"
      className="surface-dark mt-10 border border-border p-6 sm:p-10"
    >
      <h2
        id="inquiry-ready-title"
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-display-md tracking-display uppercase outline-none"
      >
        Your inquiry is ready to send
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        Nothing has been sent yet. Choose how you would like to send it to{" "}
        {siteConfig.brand}. Your email app or WhatsApp opens with the message
        filled in, so you can review it before sending.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <ButtonLink
          href={inquiry.emailUrl}
          icon={<MailIcon className="size-5 shrink-0" />}
        >
          Send by email
        </ButtonLink>
        <ButtonLink
          href={inquiry.whatsappUrl}
          variant="secondary"
          icon={<WhatsAppIcon className="size-5 shrink-0" />}
        >
          Send on WhatsApp
        </ButtonLink>
        <Button
          variant="text"
          onClick={copy}
          className="px-3"
          icon={
            copyState === "copied" ? (
              <CheckIcon className="size-4 shrink-0" />
            ) : (
              <CopyIcon className="size-4 shrink-0" />
            )
          }
        >
          {copyState === "copied" ? "Copied" : "Copy message"}
        </Button>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted">
        {copyState === "copied" && "Message copied to your clipboard."}
        {copyState === "failed" &&
          "Copying is not available here. Open the preview below and copy the text."}
      </p>

      <details className="mt-6 border-t border-border pt-6">
        <summary className="cursor-pointer text-eyebrow font-semibold tracking-eyebrow text-accent uppercase">
          Preview message
        </summary>
        <pre className="mt-4 font-sans text-sm leading-relaxed whitespace-pre-wrap text-foreground/85">
          {fullText}
        </pre>
      </details>

      <p className="mt-6 text-sm text-muted">
        If your email app does not open, write to{" "}
        <a
          href={mailtoUrl()}
          className="text-foreground underline underline-offset-4 break-all"
        >
          {siteConfig.contact.email}
        </a>
        .
      </p>
    </section>
  );
}
