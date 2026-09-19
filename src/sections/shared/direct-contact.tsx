import { MailIcon, WhatsAppIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { mailtoUrl, whatsappMessages, whatsappUrl } from "@/lib/contact";
import { cn } from "@/lib/utils";

/** Email and WhatsApp links for "prefer to talk directly" panels. */
export function DirectContact({
  whatsappMessage = whatsappMessages.general,
  className,
}: {
  whatsappMessage?: string;
  className?: string;
}) {
  const linkClasses =
    "group flex items-center gap-4 border-b border-border py-5 transition-colors duration-500 hover:text-accent";

  return (
    <ul className={cn("border-t border-border", className)}>
      <li>
        <a href={mailtoUrl()} className={linkClasses}>
          <MailIcon className="size-5 shrink-0 text-accent" />
          <span className="grid min-w-0 gap-1">
            <span className="text-eyebrow tracking-eyebrow text-muted uppercase">
              Email
            </span>
            <span className="text-sm break-all">{siteConfig.contact.email}</span>
          </span>
        </a>
      </li>
      <li>
        <a
          href={whatsappUrl(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClasses}
        >
          <WhatsAppIcon className="size-5 shrink-0 text-accent" />
          <span className="grid gap-1">
            <span className="text-eyebrow tracking-eyebrow text-muted uppercase">
              WhatsApp
            </span>
            <span className="text-sm">
              {siteConfig.contact.whatsapp.display}
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
          </span>
        </a>
      </li>
    </ul>
  );
}
