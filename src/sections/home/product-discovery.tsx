import { InquiryTile } from "@/components/product/inquiry-tile";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { LineBreak } from "@/components/ui/line-break";
import { quotePath, routes } from "@/config/routes";
import { productCategories } from "@/data/product-categories";

/** All seven categories: a swipeable row on phones, an editorial grid above. */
export function ProductDiscovery() {
  return (
    <section
      aria-labelledby="product-discovery-title"
      className="overflow-hidden py-24 sm:py-32"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel>Our products</SectionLabel>
            <h2
              id="product-discovery-title"
              className="mt-6 font-display text-display-lg tracking-display uppercase"
            >
              Professional gear
              <LineBreak />
              for every ride
            </h2>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-5 lg:justify-self-end">
            <p className="max-w-md text-base leading-relaxed text-muted">
              Seven categories of equestrian riding gear, open to wholesale,
              distribution and private-label inquiries.
            </p>
            <ButtonLink href={routes.products} variant="text" className="mt-5">
              View all products
            </ButtonLink>
          </Reveal>
        </div>

        <ul className="-mx-5 mt-14 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 sm:overflow-visible sm:px-0 lg:mt-20 lg:grid-cols-4 lg:gap-x-8 lg:pb-16 [&::-webkit-scrollbar]:hidden">
          {productCategories.map((category, index) => (
            <Reveal
              as="li"
              key={category.slug}
              delay={(index % 4) * 90}
              className="w-[78vw] max-w-80 shrink-0 snap-start sm:w-auto sm:max-w-none lg:even:translate-y-16"
            >
              <ProductCard
                category={category}
                number={index + 1}
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 78vw"
              />
            </Reveal>
          ))}
          <Reveal
            as="li"
            delay={270}
            className="w-[78vw] max-w-80 shrink-0 snap-start sm:w-auto sm:max-w-none lg:even:translate-y-16"
          >
            <InquiryTile
              href={quotePath()}
              eyebrow="Wholesale & OEM"
              title="Buying across several categories?"
              description="Share all of your requirements in a single inquiry."
              cta="Request a quote"
              className="aspect-square sm:aspect-auto"
            />
          </Reveal>
        </ul>
      </Container>
    </section>
  );
}
