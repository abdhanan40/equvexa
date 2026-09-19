import Link from "next/link";

import { ProductPhoto } from "@/components/product/product-photo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  controlTransition,
  glassControl,
  glassControlHover,
} from "@/components/ui/control";
import { Reveal } from "@/components/ui/reveal";
import { productCategoryPath, quotePath } from "@/config/routes";
import { productCategories } from "@/data/product-categories";
import { cn } from "@/lib/utils";

const pad = (value: number) => String(value).padStart(2, "0");

/** Quick links to each category row further down the page. */
export function CatalogIndex() {
  return (
    <nav
      aria-label="Product categories"
      className="border-b border-border bg-surface"
    >
      <Container>
        <ol className="-mx-5 flex gap-2 overflow-x-auto px-5 py-3.5 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:justify-between [&::-webkit-scrollbar]:hidden">
          {productCategories.map((category, index) => (
            <li key={category.slug} className="shrink-0">
              <a
                href={`#${category.slug}`}
                className={cn(
                  "flex min-h-11 items-center gap-2.5 rounded-full px-4 text-eyebrow font-semibold tracking-eyebrow whitespace-nowrap uppercase",
                  glassControl,
                  glassControlHover,
                  controlTransition,
                  "text-foreground/80 hover:text-foreground",
                )}
              >
                <span className="text-accent tabular-nums">{pad(index + 1)}</span>
                {category.name}
              </a>
            </li>
          ))}
        </ol>
      </Container>
    </nav>
  );
}

/** Editorial catalogue: one alternating row per category. */
export function CatalogList() {
  return (
    <section aria-label="All product categories" className="py-24 sm:py-32">
      <Container>
        <ol className="grid gap-24 lg:gap-36">
          {productCategories.map((category, index) => {
            const reversed = index % 2 === 1;
            const href = productCategoryPath(category.slug);
            return (
              <li
                key={category.slug}
                id={category.slug}
                className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-12 lg:gap-16"
              >
                <Reveal
                  as="figure"
                  className={cn("lg:col-span-7", reversed && "lg:order-2")}
                >
                  <Link
                    href={href}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="group block overflow-hidden"
                  >
                    <ProductPhoto
                      image={category.images[0]}
                      alt=""
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="aspect-[5/4] ring-1 ring-border ring-inset"
                      imageClassName="transition-[scale] duration-[1400ms] ease-out-expo group-hover:scale-[1.03]"
                    />
                  </Link>
                </Reveal>

                <Reveal
                  delay={120}
                  className={cn("lg:col-span-5", reversed && "lg:order-1")}
                >
                  <p className="font-display text-display-md text-accent tabular-nums">
                    {pad(index + 1)}
                  </p>
                  <h2 className="mt-4 font-display text-display-lg tracking-display uppercase">
                    <Link href={href} className="transition-colors duration-500 hover:text-accent">
                      {category.name}
                    </Link>
                  </h2>
                  <p className="mt-4 font-display text-display-sm text-foreground/80">
                    {category.tagline}
                  </p>
                  <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
                    {category.summary}
                  </p>
                  <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <ButtonLink href={href}>View category</ButtonLink>
                    <ButtonLink
                      href={quotePath({ category: category.slug })}
                      variant="text"
                    >
                      Request a quote
                    </ButtonLink>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
