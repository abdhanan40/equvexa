import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { CheckIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

/** Heading on one side, a list of practical points on the other. */
export function ChecklistSection({
  eyebrow,
  title,
  intro,
  items,
  aside,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  items: readonly string[];
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("py-24 sm:py-32", className)}>
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <SectionLabel>{eyebrow}</SectionLabel>
          <h2 className="mt-6 font-display text-display-lg tracking-display uppercase">
            {title}
          </h2>
          {intro ? (
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              {intro}
            </p>
          ) : null}
          {aside ? <div className="mt-10">{aside}</div> : null}
        </Reveal>
        <ul className="border-t border-border lg:col-span-6 lg:col-start-7">
          {items.map((item, index) => (
            <Reveal
              as="li"
              key={item}
              delay={index * 70}
              className="flex items-start gap-4 border-b border-border py-5"
            >
              <CheckIcon className="mt-0.5 size-5 shrink-0 text-accent" />
              <span className="text-base leading-relaxed">{item}</span>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
