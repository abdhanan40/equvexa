import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { LineBreak } from "@/components/ui/line-break";
import { quotePath } from "@/config/routes";
import { whatsappMessages, whatsappUrl } from "@/lib/contact";

/** Closing conversion band: quote request and WhatsApp. */
export function CtaBand({
  eyebrow = "Start a conversation",
  title = (
    <>
      Let&apos;s build
      <LineBreak />
      your next order.
    </>
  ),
  intro = "Looking for wholesale supply, OEM or private-label opportunities? Connect with EQUVEXA to discuss your requirements.",
  quoteHref = quotePath(),
  whatsappMessage = whatsappMessages.general,
}: {
  eyebrow?: string;
  title?: ReactNode;
  intro?: string;
  quoteHref?: string;
  whatsappMessage?: string;
}) {
  return (
    <section className="surface-dark grain relative isolate overflow-hidden py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-square w-[min(70rem,140vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-leather/70 via-leather/15 to-transparent to-70%"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent"
      />
      <Container className="text-center">
        <Reveal>
          <SectionLabel className="justify-center">{eyebrow}</SectionLabel>
          <h2 className="mx-auto mt-8 max-w-5xl font-display text-display-xl tracking-display uppercase">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {intro}
          </p>
        </Reveal>
        <Reveal
          delay={220}
          className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <Magnetic>
            <ButtonLink href={quoteHref} size="lg">
              Request a Quote
            </ButtonLink>
          </Magnetic>
          <Magnetic>
            <ButtonLink
              href={whatsappUrl(whatsappMessage)}
              variant="secondary"
              size="lg"
              icon={<WhatsAppIcon className="size-5 shrink-0" />}
            >
              WhatsApp
            </ButtonLink>
          </Magnetic>
        </Reveal>
      </Container>
    </section>
  );
}
