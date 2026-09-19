import { InquiryTile } from "@/components/product/inquiry-tile";
import { ProductCard } from "@/components/product/product-card";
import { ProductPhoto } from "@/components/product/product-photo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { LineBreak } from "@/components/ui/line-break";
import { quotePath, routes } from "@/config/routes";
import {
  categoryBySlug,
  productCategories,
} from "@/data/product-categories";
import { whatsappMessages, whatsappUrl } from "@/lib/contact";
import { pageMetadata } from "@/lib/metadata";
import { ChecklistSection } from "@/sections/shared/checklist-section";
import { CtaBand } from "@/sections/shared/cta-band";
import { PageHero } from "@/sections/shared/page-hero";
import { ProcessSteps } from "@/sections/shared/process-steps";

export const metadata = pageMetadata({
  title: "OEM / Private Label",
  description:
    "Discuss OEM, private-label and custom equestrian gear orders with EQUVEXA, an equestrian riding gear manufacturer and exporter based in Pakistan.",
  path: routes.oemPrivateLabel,
});

const services = [
  {
    title: "OEM",
    description:
      "Bring your own specifications and discuss producing them as an OEM order.",
  },
  {
    title: "Private Label",
    description:
      "Discuss EQUVEXA products presented under your brand name, with your logo and packaging requirements.",
  },
  {
    title: "Custom Orders",
    description:
      "Ask about adjustments to an existing product for your order, and we will discuss what is possible.",
  },
] as const;

const collaborationSteps = [
  {
    title: "Share your brief",
    description:
      "Tell us about the product, your brand, target quantities and destination market.",
  },
  {
    title: "Discuss specifications",
    description:
      "Talk through specifications, branding placement and packaging requirements with our team.",
  },
  {
    title: "Review the quotation",
    description:
      "Receive a quotation prepared for your requirements and discuss any changes.",
  },
  {
    title: "Confirm the order",
    description:
      "Agree the final details together before the order moves ahead.",
  },
] as const;

const briefItems = [
  "Product category and reference images of what you have in mind",
  "Logo files and your preferred branding placement",
  "Specifications you need, such as sizes or finishes",
  "Packaging and labelling requirements",
  "Estimated quantities and the delivery country",
] as const;

export default function OemPrivateLabelPage() {
  // Not a card cover image, so it is not repeated in the category grid below.
  const heroImage = categoryBySlug("stirrups").images[2];

  return (
    <>
      <PageHero
        eyebrow="OEM / Private Label"
        title={
          <>
            Made to
            <LineBreak />
            your brief
          </>
        }
        intro="OEM, private-label and custom-order inquiries for equestrian brands, retailers and distributors. Share your product, branding and order requirements, and we will discuss the options with you."
        actions={
          <>
            <ButtonLink href={quotePath({ inquiry: "oem" })} size="lg">
              Discuss OEM
            </ButtonLink>
            <ButtonLink
              href={whatsappUrl(whatsappMessages.privateLabel)}
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
            className="aspect-square"
          />
        }
      />

      <section aria-labelledby="oem-overview-title" className="py-24 sm:py-32">
        <Container>
          <Reveal className="max-w-3xl">
            <SectionLabel>Overview</SectionLabel>
            <h2
              id="oem-overview-title"
              className="mt-6 font-display text-display-lg tracking-display uppercase"
            >
              Three ways to work with EQUVEXA
            </h2>
          </Reveal>
          <ul className="mt-16 grid border-t border-border md:grid-cols-3">
            {services.map((service, index) => (
              <Reveal
                as="li"
                key={service.title}
                delay={index * 90}
                className="border-b border-border py-10 md:border-r md:border-b-0 md:px-8 md:first:pl-0 md:last:border-r-0"
              >
                <span className="text-eyebrow tracking-eyebrow text-accent tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-display text-display-md tracking-display uppercase">
                  {service.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted">
                  {service.description}
                </p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section
        aria-labelledby="oem-categories-title"
        className="surface-dark py-24 sm:py-32"
      >
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <SectionLabel>Product categories</SectionLabel>
              <h2
                id="oem-categories-title"
                className="mt-6 font-display text-display-lg tracking-display uppercase"
              >
                Start from the range
              </h2>
            </Reveal>
            <p className="max-w-sm text-base leading-relaxed text-muted">
              Choose any of the seven EQUVEXA categories as the starting point
              for your inquiry.
            </p>
          </div>
          <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {productCategories.map((category, index) => (
              <Reveal as="li" key={category.slug} delay={(index % 4) * 80}>
                <ProductCard
                  category={category}
                  number={index + 1}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                />
              </Reveal>
            ))}
            <Reveal as="li" delay={240}>
              <InquiryTile
                href={quotePath({ inquiry: "oem" })}
                eyebrow="Custom product"
                title="Have your own design in mind?"
                description="Share your specifications and discuss an OEM order with our team."
                cta="Discuss OEM"
                className="min-h-72"
              />
            </Reveal>
          </ul>
        </Container>
      </section>

      <ProcessSteps
        eyebrow="Collaboration"
        title={
          <>
            How an OEM inquiry
            <LineBreak />
            moves forward
          </>
        }
        intro="A general outline. Each project is discussed individually, and nothing is agreed or paid for on this website."
        steps={collaborationSteps}
      />

      <ChecklistSection
        className="bg-surface"
        eyebrow="Branding & specifications"
        title="Prepare for the conversation"
        intro="Having these details ready helps our team understand your brief from the first message."
        items={briefItems}
        aside={
          <ButtonLink href={quotePath({ inquiry: "private-label" })}>
            Start a private-label inquiry
          </ButtonLink>
        }
      />

      <CtaBand
        eyebrow="OEM / Private Label"
        title={
          <>
            Bring your brand
            <LineBreak />
            to the table.
          </>
        }
        intro="Share your specifications, branding and order requirements, and discuss the options with the EQUVEXA team."
        quoteHref={quotePath({ inquiry: "oem" })}
        whatsappMessage={whatsappMessages.privateLabel}
      />
    </>
  );
}
