import { cn } from "@/lib/utils";

/*
 * Shared control surfaces, taken from the homepage hero so navigation,
 * buttons and icon controls across the site read as one family.
 *
 * They are built from the semantic colour roles, so the same classes give a
 * dark glass control inside `surface-dark` sections (header, page heroes,
 * dark bands) and a quietly tinted one on the ivory pages.
 */

/** Translucent glass surface with a hairline border and a soft blur. */
export const glassControl =
  "border border-foreground/15 bg-foreground/5 backdrop-blur-md";

/** Hover response for a glass control: warmer border, a touch more light. */
export const glassControlHover =
  "hover:border-accent/55 hover:bg-foreground/10";

/** Transition used by every control, matching the hero's timing. */
export const controlTransition =
  "transition-[background-color,border-color,color,translate] duration-300 ease-out-expo";

/**
 * Circular icon-only control: gallery and carousel arrows, the menu button.
 * Size 2.75rem keeps the touch target comfortable.
 */
export function iconButtonClasses(className?: string) {
  return cn(
    "inline-grid size-11 shrink-0 place-items-center rounded-full text-foreground",
    glassControl,
    glassControlHover,
    controlTransition,
    "hover:-translate-y-0.5",
    className,
  );
}

/**
 * Pill used for items inside a navigation capsule or a selector bar. The
 * active item carries the muted gold; the rest stay quiet until hovered.
 */
export function navPillClasses(active: boolean, className?: string) {
  return cn(
    "block rounded-full px-4.5 py-2 text-sm font-medium whitespace-nowrap",
    controlTransition,
    active
      ? "bg-gold text-ink"
      : "text-foreground/75 hover:bg-foreground/10 hover:text-foreground",
    className,
  );
}

/** The glass capsule that holds a row of nav pills. */
export const navCapsuleClasses = cn(
  "flex items-center gap-1 rounded-full p-1.5 shadow-lg shadow-ink/30",
  glassControl,
  "bg-foreground/7 backdrop-blur-xl",
);
