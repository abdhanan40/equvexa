import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MailIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { LineBreak } from "@/components/ui/line-break";
import { quotePath, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { mailtoUrl, whatsappMessages, whatsappUrl } from "@/lib/contact";
import { pageMetadata } from "@/lib/metadata";
import { ContactForm } from "@/sections/contact/contact-form";
import { PageHero } from "@/sections/shared/page-hero";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact EQUVEXA by email or WhatsApp about wholesale, OEM and private-label equestrian riding gear.",
  path: routes.contact,
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s talk
            <LineBreak />
            business
          </>
        }
        intro="Reach the EQUVEXA team by email or WhatsApp, or prepare a message with the form below."
      />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="grid content-start gap-4 lg:col-span-5">
            <Reveal className="surface-dark p-8 sm:p-10">
              <MailIcon className="size-7 text-accent" />
              <h2 className="mt-6 text-eyebrow font-semibold tracking-eyebrow text-accent uppercase">
                Email
              </h2>
              <p className="mt-3 font-display text-display-sm break-all">
                {siteConfig.contact.email}
              </p>
              <ButtonLink
                href={mailtoUrl({ subject: "B2B inquiry" })}
                variant="secondary"
                className="mt-8"
              >
                Send an email
              </ButtonLink>
            </Reveal>

            <Reveal delay={100} className="surface-dark p-8 sm:p-10">
              <WhatsAppIcon className="size-7 text-accent" />
              <h2 className="mt-6 text-eyebrow font-semibold tracking-eyebrow text-accent uppercase">
                WhatsApp
              </h2>
              <p className="mt-3 font-display text-display-sm lining-nums">
                {siteConfig.contact.whatsapp.display}
              </p>
              <ButtonLink
                href={whatsappUrl(whatsappMessages.general)}
                variant="secondary"
                className="mt-8"
              >
                Chat on WhatsApp
              </ButtonLink>
            </Reveal>

            <Reveal delay={200} className="border border-border p-8 sm:p-10">
              <h2 className="text-eyebrow font-semibold tracking-eyebrow text-accent uppercase">
                Ready for pricing?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Use the quote form to share categories, quantities and inquiry
                type in one place.
              </p>
              <ButtonLink href={quotePath()} className="mt-7">
                Request a Quote
              </ButtonLink>
              <p className="mt-8 border-t border-border pt-6 text-sm text-muted">
                Based in {siteConfig.country}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <SectionLabel>Send a message</SectionLabel>
            <h2 className="mt-6 mb-10 font-display text-display-lg tracking-display uppercase">
              How can we help?
            </h2>
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
