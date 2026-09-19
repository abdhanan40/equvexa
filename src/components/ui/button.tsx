import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import {
  controlTransition,
  glassControl,
  glassControlHover,
} from "@/components/ui/control";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "text";
type ButtonSize = "md" | "lg";

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/**
 * Shared button styles, in the same pill language as the homepage hero:
 * a muted-gold primary and a glass secondary, both fully rounded and lifting
 * a little on hover. Colours use the semantic roles, so buttons adapt to
 * light sections and `surface-dark` sections automatically.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}) {
  return cn(
    "group/button inline-flex items-center justify-center gap-3 whitespace-nowrap text-[0.75rem] leading-none font-semibold tracking-[0.16em] uppercase disabled:pointer-events-none disabled:opacity-50",
    controlTransition,
    variant !== "text" && [
      "rounded-full hover:-translate-y-0.5 disabled:hover:translate-y-0",
      size === "lg" ? "h-14 px-10" : "h-12 px-8",
    ],
    variant === "primary" &&
      "bg-gold text-ink shadow-lg shadow-ink/15 hover:bg-gold-soft",
    // A button needs a clearer edge than a nav capsule, especially on the
    // ivory pages, so it carries a slightly stronger border.
    variant === "secondary" && [
      glassControl,
      glassControlHover,
      "border-foreground/25 text-foreground",
    ],
    variant === "text" &&
      "gap-2.5 py-2 text-foreground hover:text-accent focus-visible:text-accent",
    className,
  );
}

function ButtonContent({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <>
      <span>{children}</span>
      {icon === undefined ? (
        <ArrowRightIcon className="size-4 shrink-0 transition-transform duration-500 ease-out-expo group-hover/button:translate-x-1" />
      ) : (
        icon
      )}
    </>
  );
}

type ButtonLinkProps = ButtonStyleOptions & {
  href: string;
  children: ReactNode;
  /** Custom icon, or `null` for none. Defaults to an arrow. */
  icon?: ReactNode;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

/** A link styled as a button. External URLs open in a new tab. */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  icon,
  ...props
}: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, className });
  const content = <ButtonContent icon={icon}>{children}</ButtonContent>;

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  if (/^https?:\/\//.test(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      >
        {content}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  );
}

type ButtonProps = ButtonStyleOptions & {
  icon?: ReactNode;
} & Omit<ComponentProps<"button">, "className">;

export function Button({
  variant,
  size,
  className,
  children,
  icon,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      {...props}
    >
      <ButtonContent icon={icon}>{children}</ButtonContent>
    </button>
  );
}
