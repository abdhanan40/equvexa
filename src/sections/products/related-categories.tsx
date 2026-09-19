import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { routes } from "@/config/routes";
import {
  getCategoryNumber,
  getRelatedCategories,
} from "@/data/product-categories";
import type { ProductCategorySlug } from "@/types/catalog";

export function RelatedCategories({ slug }: { slug: ProductCategorySlug }) {
  const related = getRelatedCategories(slug, 3);

  return (
    <section aria-labelledby="related-title" className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionLabel>Related categories</SectionLabel>
            <h2
              id="related-title"
              className="mt-6 font-display text-display-lg tracking-display uppercase"
            >
              Explore the range
            </h2>
          </Reveal>
          <ButtonLink href={routes.products} variant="text">
            All products
          </ButtonLink>
        </div>
        <ul className="mt-14 grid gap-12 sm:grid-cols-3 sm:gap-6 lg:gap-8">
          {related.map((category, index) => (
            <Reveal as="li" key={category.slug} delay={index * 90}>
              <ProductCard
                category={category}
                number={getCategoryNumber(category.slug)}
                sizes="(min-width: 640px) 30vw, 100vw"
              />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
