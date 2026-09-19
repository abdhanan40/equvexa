import Link from "next/link";

import { ProductPhoto } from "@/components/product/product-photo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { LineBreak } from "@/components/ui/line-break";
import { quotePath, routes } from "@/config/routes";
import { categoryBySlug } from "@/data/product-categories";
import { whatsappMessages, whatsappUrl } from "@/lib/contact";
import { pageMetadata } from "@/lib/metadata";
import { ChecklistSection } from "@/sections/shared/checklist-section";
import { CtaBand } from "@/sections/shared/cta-band";
import { DirectContact } from "@/sections/shared/direct-contact";
import { PageHero } from "@/sections/shared/page-hero";
import { ProcessSteps } from "@/sections/shared/process-steps";

export const metadata = pageMetadata({
  title: "Wholesale / Export",
  description:
    "Wholesale and export inquiries for EQUVEXA equestrian riding gear, for retailers, tack shops, wholesalers, distributors and importers.",
  path: routes.wholesaleExport,
});

const audiences = [
  {
    title: "Retailers & tack shops",
    description:
      "Equestrian stores and saddlery shops looking for gear for their customers.",
  },
  {
    title: "Wholesalers",
    description: "Businesses supplying equestrian gear to other retailers.",
  },
  {
    title: "Distributors",
    description: "Regional and national distribution partners.",
  },
  {
    title: "Importers",
    description: "Buyers bringing equestrian gear into their home markets.",
  },
] as const;

const inquirySteps = [
  {
    title: "Choose categories",
    description:
      "Shortlist the product categories that fit your customers and market.",
  },
  {
    title: "Share requirements",
    description:
      "Tell us about quantities, styles, sizing, branding and the delivery country.",
  },
  {
    title: "Request a quote",
    description:
      "Send your inquiry through the quote form, by email or on WhatsApp.",
  },
  {
    title: "Discuss the order",
    description:
      "Talk through the quotation and order details directly with our team.",
  },
] as const;

const inquiryChecklist = [
  "Your company name and country",
  "The product categories you are interested in",
  "Estimated quantities for each category",
  "Any branding or packaging requirements",
  "The delivery destination for your order",
] as const;

export default function WholesaleExportPage() {
  const heroImage = categoryBySlug("horse-riding-caps").images[3];

  return (
    <>
      <PageHero
        eyebrow="Wholesale / Export"
        title={
          <>
            Built for global
            <LineBreak />
            partnerships
          </>
        }
        intro="Wholesale and export inquiries from equestrian retailers, wholesalers, distributors and importers. Tell us what you need and speak directly with our team."
        actions={
          <>
            <ButtonLink href={quotePath({ inquiry: "wholesale" })} size="lg">
              Start wholesale inquiry
            </ButtonLink>
            <ButtonLink
              href={whatsappUrl(whatsappMessages.wholesale)}
              variant="secondary"
              size="lg"
              icon={<WhatsAppIcon className="size-5 shrink-0" />}
            >
              WhatsApp
            </ButtonLink>
          </>
        }
        aside={
          <ProductPhoto
            image={heroImage}
            sizes="(min-width: 1024px) 45vw, 100vw"
            loading="eager"
            className="aspect-[4/3]"
          />
        }
      />

      <section aria-labelledby="audiences-title" className="py-24 sm:py-32">
        <Container>
          <Reveal className="max-w-3xl">
            <SectionLabel>Who it is for</SectionLabel>
            <h2
              id="audiences-title"
              className="mt-6 font-display text-display-lg tracking-display uppercase"
            >
              For the businesses
              <LineBreak />
              that equip riders
            </h2>
          </Reveal>
          <ul className="mt-16 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((audience, index) => (
              <Reveal
                as="li"
                key={audience.title}
                delay={index * 80}
                className="bg-background p-8 lg:p-10"
              >
                <span className="text-eyebrow tracking-eyebrow text-accent tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-8 text-sm font-semibold tracking-[0.14em] uppercase">
                  {audience.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {audience.description}
                </p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-8">
            <Link
              href={routes.oemPrivateLabel}
              className="group inline-flex items-center gap-3 text-sm"
            >
              <span className="text-muted">Building your own brand?</span>
              <span className="link-underline font-semibold">
                See OEM &amp; private label
              </span>
              <ArrowRightIcon className="size-4 text-accent transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </Container>
      </section>

      <ProcessSteps
        className="surface-dark"
        eyebrow="Inquiry process"
        title={
          <>
            How wholesale
            <LineBreak />
            inquiries work
          </>
        }
        intro="Every wholesale order starts with a conversation. Nothing is purchased or paid for on this website."
        steps={inquirySteps}
      />

      <ChecklistSection
        eyebrow="Your inquiry"
        title="What to include in your message"
        intro="These details help our team respond to your wholesale inquiry with the right information."
        items={inquiryChecklist}
        aside={
          <div className="surface-dark p-8">
            <p className="text-eyebrow font-semibold tracking-eyebrow text-accent uppercase">
              Contact the team
            </p>
            <DirectContact
              className="mt-4"
              whatsappMessage={whatsappMessages.wholesale}
            />
          </div>
        }
      />

      <CtaBand
        eyebrow="Wholesale / Export"
        title={
          <>
            Start your
            <LineBreak />
            wholesale inquiry.
          </>
        }
        intro="Tell us which categories, quantities and destination you have in mind, and continue the conversation with EQUVEXA."
        quoteHref={quotePath({ inquiry: "wholesale" })}
        whatsappMessage={whatsappMessages.wholesale}
      />
    </>
  );
}
