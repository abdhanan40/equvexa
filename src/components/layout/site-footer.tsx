import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { MailIcon, WhatsAppIcon } from "@/components/ui/icons";
import { footerNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { mailtoUrl, whatsappMessages, whatsappUrl } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="surface-dark relative isolate overflow-hidden border-t border-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/50 to-transparent"
      />
      <Container className="py-20 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-3">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo/equvexa-logo.png"
                alt="EQUVEXA Riding: Performance, Precision, Passion"
                width={1124}
                height={937}
                sizes="176px"
                className="h-auto w-44"
              />
            </Link>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted">
              {siteConfig.description}
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid gap-10 sm:grid-cols-3 lg:col-span-6"
          >
            {footerNavigation.map((group) => (
              <div key={group.title}>
                <h2 className="text-eyebrow font-semibold tracking-eyebrow text-accent uppercase">
                  {group.title}
                </h2>
                <ul className="mt-6 grid gap-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="link-underline text-sm text-foreground/75 transition-colors duration-500 hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="lg:col-span-3">
            <h2 className="text-eyebrow font-semibold tracking-eyebrow text-accent uppercase">
              Contact
            </h2>
            <ul className="mt-6 grid gap-4 text-sm">
              <li>
                <a
                  href={mailtoUrl()}
                  className="group inline-flex items-start gap-3 text-foreground/75 transition-colors duration-500 hover:text-foreground"
                >
                  <MailIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span className="[overflow-wrap:anywhere]">
                    {siteConfig.contact.email}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl(whatsappMessages.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-3 text-foreground/75 transition-colors duration-500 hover:text-foreground"
                >
                  <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>
                    WhatsApp {siteConfig.contact.whatsapp.display}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </a>
              </li>
              <li className="text-muted">{siteConfig.country}</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-border pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="tracking-[0.16em] uppercase">
            Wholesale · OEM · Private Label
          </p>
        </div>
      </Container>
    </footer>
  );
}
