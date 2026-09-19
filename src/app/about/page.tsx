import Link from "next/link";

import { ProductPhoto } from "@/components/product/product-photo";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { LineBreak } from "@/components/ui/line-break";
import { productCategoryPath, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { audiences, companyFacts } from "@/data/company";
import {
  categoryBySlug,
  productCategories,
} from "@/data/product-categories";
import { mailtoUrl, whatsappMessages, whatsappUrl } from "@/lib/contact";
import { pageMetadata } from "@/lib/metadata";
import { CtaBand } from "@/sections/shared/cta-band";
import { PageHero } from "@/sections/shared/page-hero";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Equvexa Industries is an equestrian riding gear manufacturer and exporter based in Pakistan, serving international B2B buyers.",
  path: routes.about,
});

export default function AboutPage() {
  const heroImage = categoryBySlug("riding-saddles").images[0];
  const storyImage = categoryBySlug("stirrups").images[3];

  return (
    <>
      <PageHero
        eyebrow="About EQUVEXA"
        title={
          <>
            Crafted with purpose.
            <LineBreak />
            Built for partnership.
          </>
        }
        titleClassName="text-display-lg"
        intro={`${siteConfig.name} is an equestrian riding gear manufacturer and exporter based in ${siteConfig.country}, serving international B2B buyers.`}
        aside={
          <ProductPhoto
            image={heroImage}
            sizes="(min-width: 1024px) 45vw, 100vw"
            loading="eager"
            className="aspect-[4/3]"
          />
        }
      />

      <section aria-labelledby="about-story-title" className="py-24 sm:py-32">
        <Container className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <SectionLabel>Our focus</SectionLabel>
            <h2
              id="about-story-title"
              className="mt-6 font-display text-display-lg tracking-display uppercase"
            >
              Riding gear for the businesses that equip riders
            </h2>
            <div className="mt-8 grid max-w-2xl gap-5 text-base leading-relaxed text-muted sm:text-lg">
              <p>
                EQUVEXA brings together seven categories of equestrian gear,
                from riding gloves and stirrups to saddles and horse bits.
              </p>
              <p>
                We work B2B: our website is a starting point for wholesale,
                export, OEM and private-label conversations, not a retail
                store. Every order is discussed directly with our team.
              </p>
            </div>
          </Reveal>
          <Reveal as="figure" delay={120} className="lg:col-span-5">
            <ProductPhoto
              image={storyImage}
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="aspect-[4/5]"
            />
          </Reveal>
        </Container>
      </section>

      <section
        aria-labelledby="about-range-title"
        className="surface-dark py-24 sm:py-32"
      >
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <SectionLabel>What we make</SectionLabel>
            <h2
              id="about-range-title"
              className="mt-6 font-display text-display-lg tracking-display uppercase"
            >
              Seven categories
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">
              Each category has its own page with approved product imagery and
              inquiry options.
            </p>
          </Reveal>
          <ol className="border-t border-border lg:col-span-7">
            {productCategories.map((category, index) => (
              <Reveal as="li" key={category.slug} delay={index * 60}>
                <Link
                  href={productCategoryPath(category.slug)}
                  className="group grid grid-cols-[3rem_1fr_auto] items-center border-b border-border py-5"
                >
                  <span className="text-eyebrow tracking-eyebrow text-accent tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-display-sm uppercase transition-colors duration-500 group-hover:text-accent">
                    {category.name}
                  </span>
                  <ArrowRightIcon className="size-5 text-muted transition-[translate,color] duration-500 ease-out-expo group-hover:translate-x-1 group-hover:text-accent" />
                </Link>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="about-audience-title" className="py-24 sm:py-32">
        <Container className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-6">
            <SectionLabel>Who we serve</SectionLabel>
            <h2
              id="about-audience-title"
              className="mt-6 font-display text-display-lg tracking-display uppercase"
            >
              International B2B buyers
            </h2>
            <ul className="mt-10 flex flex-wrap gap-2">
              {audiences.map((audience) => (
                <li
                  key={audience}
                  className="border border-border px-4 py-2.5 text-sm"
                >
                  {audience}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5 lg:col-start-8">
            <SectionLabel>Company details</SectionLabel>
            <dl className="mt-8 border-t border-border">
              {companyFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid gap-1 border-b border-border py-4 sm:grid-cols-[8rem_1fr] sm:gap-6"
                >
                  <dt className="text-eyebrow font-semibold tracking-eyebrow text-muted uppercase sm:pt-1">
                    {fact.label}
                  </dt>
                  <dd className="text-base">{fact.value}</dd>
                </div>
              ))}
              <div className="grid gap-1 border-b border-border py-4 sm:grid-cols-[8rem_1fr] sm:gap-6">
                <dt className="text-eyebrow font-semibold tracking-eyebrow text-muted uppercase sm:pt-1">
                  Contact
                </dt>
                <dd className="grid gap-1 text-base">
                  <a
                    href={mailtoUrl()}
                    className="link-underline justify-self-start break-all"
                  >
                    {siteConfig.contact.email}
                  </a>
                  <a
                    href={whatsappUrl(whatsappMessages.general)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline justify-self-start"
                  >
                    WhatsApp {siteConfig.contact.whatsapp.display}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
