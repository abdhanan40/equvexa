import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

export type ProcessStep = {
  title: string;
  description: string;
};

/** Numbered, intentionally general process. Describes steps, not guarantees. */
export function ProcessSteps({
  eyebrow,
  title,
  intro,
  steps,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  steps: readonly ProcessStep[];
  className?: string;
}) {
  return (
    <section className={cn("py-24 sm:py-32", className)}>
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel>{eyebrow}</SectionLabel>
            <h2 className="mt-6 font-display text-display-lg tracking-display uppercase">
              {title}
            </h2>
          </Reveal>
          {intro ? (
            <Reveal delay={100} className="lg:col-span-5">
              <p className="max-w-md text-base leading-relaxed text-muted lg:ml-auto">
                {intro}
              </p>
            </Reveal>
          ) : null}
        </div>

        <ol className="mt-16 grid border-t border-border sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 90}
              className="group relative border-b border-border py-10 sm:odd:border-r sm:[&:nth-child(odd)]:pr-8 sm:[&:nth-child(even)]:pl-8 lg:border-r lg:border-b-0 lg:px-8 lg:first:pl-0 lg:last:border-r-0"
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 h-px w-0 bg-accent transition-[width] duration-1000 ease-out-expo group-hover:w-full"
              />
              <span className="font-display text-display-md text-accent tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-8 text-sm font-semibold tracking-[0.16em] uppercase">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
