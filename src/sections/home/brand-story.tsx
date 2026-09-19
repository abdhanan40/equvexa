import { ProductPhoto } from "@/components/product/product-photo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { LineBreak } from "@/components/ui/line-break";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import {
  categoryBySlug,
  productCategories,
} from "@/data/product-categories";

const focusAreas = [
  {
    value: String(productCategories.length).padStart(2, "0"),
    label: "Product categories",
  },
  { value: "B2B", label: "Wholesale and export" },
  { value: "OEM", label: "Private-label inquiries" },
] as const;

export function BrandStory() {
  const image = categoryBySlug("riding-saddles").images[1];

  return (
    <section
      aria-labelledby="brand-story-title"
      className="surface-dark relative isolate overflow-hidden py-24 sm:py-32"
    >
      <Container>
        <div className="grid items-center lg:grid-cols-12">
          <Reveal
            as="figure"
            className="lg:col-span-8 lg:col-start-1 lg:row-start-1"
          >
            <ProductPhoto
              image={image}
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="aspect-[4/3] lg:aspect-[16/11]"
            />
          </Reveal>

          <Reveal
            delay={140}
            className="relative mx-4 -mt-20 border border-border bg-ink-soft p-8 sm:mx-10 sm:p-12 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:mx-0 lg:mt-0 lg:p-14"
          >
            <SectionLabel>About EQUVEXA</SectionLabel>
            <h2
              id="brand-story-title"
              className="mt-6 font-display text-display-lg tracking-display uppercase"
            >
              Built for the ride.
              <LineBreak />
              Made for business.
            </h2>
            <p className="mt-7 text-base leading-relaxed text-muted">
              {siteConfig.name} is an equestrian riding gear manufacturer and
              exporter based in {siteConfig.country}. Our work is focused on
              the businesses that equip riders: tack shops, saddlery stores,
              retailers, distributors and private-label brands.
            </p>

            <dl className="mt-10 grid grid-cols-3 border-y border-border">
              {focusAreas.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col-reverse gap-2 border-r border-border py-5 pr-3 last:border-r-0 [&:not(:first-child)]:pl-4"
                >
                  <dt className="text-[0.625rem] leading-snug tracking-[0.14em] text-muted uppercase">
                    {item.label}
                  </dt>
                  <dd className="font-display text-display-sm text-accent">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            <ButtonLink
              href={routes.about}
              variant="secondary"
              className="mt-10"
            >
              About EQUVEXA
            </ButtonLink>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
