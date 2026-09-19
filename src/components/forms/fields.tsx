import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/* Rounded, quietly tinted fields in the same control language as the rest of
   the site; the border warms to gold on focus. */
const controlClasses =
  "w-full rounded-control border border-foreground/25 bg-foreground/[0.03] px-4 text-base text-foreground transition-colors duration-300 placeholder:text-muted hover:border-foreground/45 focus:border-accent focus:bg-foreground/[0.05] aria-invalid:border-danger";

type FieldBaseProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
};

function describedBy(id: string, hint?: string, error?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) {
  const content = (
    <>
      {children}
      {required ? (
        <span aria-hidden="true" className="text-accent">
          {" "}
          *
        </span>
      ) : (
        <span className="ml-2 font-normal tracking-normal text-muted normal-case">
          (optional)
        </span>
      )}
    </>
  );
  const classes =
    "text-eyebrow font-semibold tracking-[0.16em] text-foreground uppercase";

  return htmlFor ? (
    <label htmlFor={htmlFor} className={classes}>
      {content}
    </label>
  ) : (
    <span className={classes}>{content}</span>
  );
}

function FieldMessages({
  id,
  hint,
  error,
}: {
  id: string;
  hint?: string;
  error?: string;
}) {
  if (error) {
    return (
      <p id={`${id}-error`} className="text-sm font-medium text-danger">
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={`${id}-hint`} className="text-sm text-muted">
        {hint}
      </p>
    );
  }
  return null;
}

export function TextField({
  id,
  label,
  required,
  hint,
  error,
  className,
  ...props
}: FieldBaseProps & Omit<ComponentProps<"input">, "id" | "className">) {
  return (
    <div className={cn("grid content-start gap-2.5", className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClasses, "h-13")}
        {...props}
      />
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  required,
  hint,
  error,
  className,
  placeholder,
  options,
  ...props
}: FieldBaseProps & {
  placeholder: string;
  options: readonly { value: string; label: string }[];
} & Omit<ComponentProps<"select">, "id" | "className">) {
  return (
    <div className={cn("grid content-start gap-2.5", className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cn(controlClasses, "h-13 appearance-none pr-12")}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  required,
  hint,
  error,
  className,
  ...props
}: FieldBaseProps & Omit<ComponentProps<"textarea">, "id" | "className">) {
  return (
    <div className={cn("grid content-start gap-2.5", className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClasses, "min-h-44 resize-y py-3 leading-relaxed")}
        {...props}
      />
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}

export function RadioCardGroup({
  id,
  name,
  label,
  required,
  hint,
  error,
  className,
  options,
  value,
  onChange,
}: FieldBaseProps & {
  name: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset
      aria-describedby={describedBy(id, hint, error)}
      className={cn("grid gap-3", className)}
    >
      <legend className="mb-3">
        <Label required={required}>{label}</Label>
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option, index) => (
          <label
            key={option.value}
            className={cn(
              "flex min-h-13 cursor-pointer items-center gap-3 rounded-control border bg-foreground/[0.03] px-4 py-3 text-sm transition-colors duration-300 has-checked:border-accent has-checked:bg-accent/10 hover:border-foreground/45",
              error ? "border-danger" : "border-foreground/25",
            )}
          >
            <input
              id={index === 0 ? id : undefined}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              required={required}
              className="size-4 shrink-0 accent-[var(--color-accent)]"
            />
            {option.label}
          </label>
        ))}
      </div>
      <FieldMessages id={id} hint={hint} error={error} />
    </fieldset>
  );
}

/** Lists validation errors with links to each field. */
export function ErrorSummary({
  errors,
}: {
  errors: readonly { id: string; message: string }[];
}) {
  if (errors.length === 0) return null;
  return (
    <div
      role="alert"
      className="rounded-control border border-danger/50 bg-danger/5 p-5"
    >
      <p className="text-sm font-semibold text-danger">
        Please check {errors.length === 1 ? "this field" : "these fields"}:
      </p>
      <ul className="mt-3 grid list-disc gap-1.5 pl-5 text-sm">
        {errors.map((error) => (
          <li key={error.id}>
            <a href={`#${error.id}`} className="text-foreground underline underline-offset-4">
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
