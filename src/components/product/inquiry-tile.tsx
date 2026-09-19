import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

/** Dark call-to-action tile that sits alongside product cards in a grid. */
export function InquiryTile({
  href,
  eyebrow,
  title,
  description,
  cta,
  className,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "surface-dark glow-warm group relative flex h-full flex-col justify-between gap-10 overflow-hidden border border-border p-7 transition-colors duration-700 ease-out-expo hover:border-gold/60 lg:p-8",
        className,
      )}
    >
      <SectionLabel>{eyebrow}</SectionLabel>
      <div>
        <p className="font-display text-display-sm text-balance uppercase">
          {title}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted">{description}</p>
        <span className="mt-8 inline-flex items-center gap-2 text-eyebrow font-semibold tracking-eyebrow text-accent uppercase">
          {cta}
          <ArrowRightIcon className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
