import { clsx, type ClassValue } from "clsx";
import type { CSSProperties } from "react";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * tailwind-merge only knows Tailwind's default scales. Custom tokens from
 * src/styles/tokens.css are registered here so conflicting classes resolve
 * correctly, e.g. cn("tracking-eyebrow", "tracking-wide") -> "tracking-wide".
 * Colour and font-family tokens need no registration.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      animate: ["enter", "drop-in"],
      container: ["site"],
      ease: ["out-expo", "in-out-quint"],
      radius: ["control"],
      spacing: ["header"],
      text: [
        "display-2xl",
        "display-xl",
        "display-lg",
        "display-md",
        "display-sm",
        "eyebrow",
      ],
      tracking: ["eyebrow", "display"],
    },
  },
});

/** Combines conditional class names and resolves Tailwind class conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Inline style that delays the `animate-enter` page-entry animation. */
export function enterDelay(milliseconds: number) {
  return { "--enter-delay": `${milliseconds}ms` } as CSSProperties;
}
