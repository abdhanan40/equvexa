import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Small uppercase eyebrow label with a gold rule. */
export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-eyebrow font-semibold tracking-eyebrow text-accent uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-70" />
      {children}
    </p>
  );
}
