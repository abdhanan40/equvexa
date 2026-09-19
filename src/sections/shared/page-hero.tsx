import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { cn, enterDelay } from "@/lib/utils";

/** Dark opening band for inner pages. The header sits transparently over it. */
export function PageHero({
  eyebrow,
  title,
  intro,
  actions,
  aside,
  className,
  titleClassName,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  actions?: ReactNode;
  /** Optional content beside the text on large screens, e.g. an image. */
  aside?: ReactNode;
  className?: string;
  /** Adjust the title size for long headings. */
  titleClassName?: string;
}) {
  return (
    <section
      className={cn(
        "surface-dark glow-warm grain relative isolate overflow-hidden pt-header",
        className,
      )}
    >
      <Container
        className={cn(
          "relative pt-14 pb-20 sm:pt-20 lg:pb-28",
          aside && "grid items-center gap-14 lg:grid-cols-12 lg:gap-10",
        )}
      >
        <div className={cn(aside ? "lg:col-span-6" : "max-w-4xl")}>
          <div className="animate-enter">
            <SectionLabel>{eyebrow}</SectionLabel>
          </div>
          <h1
            className={cn(
              "mt-7 animate-enter font-display text-display-xl tracking-display uppercase",
              titleClassName,
            )}
            style={enterDelay(120)}
          >
            {title}
          </h1>
          {intro ? (
            <div
              className="mt-8 max-w-2xl animate-enter text-base leading-relaxed text-muted sm:text-lg"
              style={enterDelay(240)}
            >
              {intro}
            </div>
          ) : null}
          {actions ? (
            <div
              className="mt-10 flex animate-enter flex-wrap gap-3 sm:gap-4"
              style={enterDelay(360)}
            >
              {actions}
            </div>
          ) : null}
        </div>
        {aside ? (
          <div
            className="animate-enter lg:col-span-6"
            style={enterDelay(300)}
          >
            {aside}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
