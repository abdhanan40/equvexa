import { INQUIRY_PANEL_TITLE_ID } from "@/components/forms/inquiry-panel-ids";
import { CheckIcon } from "@/components/ui/icons";

/**
 * Shown once the server has handed the inquiry to the email provider, so it
 * is on its way to the EQUVEXA inbox. The reference lets the buyer point at
 * this inquiry if they write again.
 */
export function InquirySentPanel({
  title,
  description,
  reference,
  replyTo,
}: {
  title: string;
  description: string;
  reference: string;
  /** The address the buyer gave, which EQUVEXA's reply will go to. */
  replyTo: string;
}) {
  return (
    <section
      aria-labelledby={INQUIRY_PANEL_TITLE_ID.sent}
      className="surface-dark mt-10 border border-border p-6 sm:p-10"
    >
      <p className="flex items-center gap-2 text-eyebrow font-semibold tracking-eyebrow text-accent uppercase">
        <CheckIcon className="size-4 shrink-0" />
        Sent
      </p>
      <h2
        id={INQUIRY_PANEL_TITLE_ID.sent}
        tabIndex={-1}
        className="mt-4 font-display text-display-md tracking-display uppercase outline-none"
      >
        {title}
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        {description}
      </p>
      <dl className="mt-8 grid gap-6 border-t border-border pt-6 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-eyebrow font-semibold tracking-eyebrow text-muted uppercase">
            Your reference
          </dt>
          <dd className="mt-2 font-display text-lg tracking-display">{reference}</dd>
        </div>
        <div>
          <dt className="text-eyebrow font-semibold tracking-eyebrow text-muted uppercase">
            Reply goes to
          </dt>
          <dd className="mt-2 break-all text-foreground/90">{replyTo}</dd>
        </div>
      </dl>
    </section>
  );
}
