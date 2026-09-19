import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductDetails } from "@/components/product/product-details";
import { ProductGallery } from "@/components/product/product-gallery";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/section-label";
import { LineBreak } from "@/components/ui/line-break";
import { productCategoryPath, quotePath, routes } from "@/config/routes";
import {
  getCategoryNumber,
  getProductCategory,
  productCategories,
} from "@/data/product-categories";
import { whatsappMessages, whatsappUrl } from "@/lib/contact";
import { pageMetadata } from "@/lib/metadata";
import { enterDelay } from "@/lib/utils";
import { RelatedCategories } from "@/sections/products/related-categories";
import { CtaBand } from "@/sections/shared/cta-band";

export const dynamicParams = false;

export function generateStaticParams() {
  return productCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const category = getProductCategory(slug);
  if (!category) return {};
  return pageMetadata({
    title: category.name,
    description: category.metaDescription,
    path: productCategoryPath(category.slug),
  });
}

const pad = (value: number) => String(value).padStart(2, "0");

export default async function ProductCategoryPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const category = getProductCategory(slug);
  if (!category) notFound();

  const number = getCategoryNumber(category.slug);

  return (
    <>
      <section className="surface-dark glow-warm grain relative isolate overflow-hidden pt-header">
        <Container className="pt-8 pb-20 sm:pt-12 lg:pb-28">
          <nav aria-label="Breadcrumb" className="animate-enter">
            <ol className="flex flex-wrap items-center gap-3 text-eyebrow font-semibold tracking-eyebrow text-muted uppercase">
              <li>
                <Link
                  href={routes.products}
                  className="transition-colors duration-500 hover:text-foreground"
                >
                  Products
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">
                {category.name}
              </li>
            </ol>
          </nav>

          <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5 lg:pt-4">
              <div className="animate-enter" style={enterDelay(80)}>
                <SectionLabel>
                  Category {pad(number)} / {pad(productCategories.length)}
                </SectionLabel>
              </div>
              <h1
                className="mt-6 animate-enter font-display text-display-xl tracking-display uppercase"
                style={enterDelay(160)}
              >
                {category.name}
              </h1>
              <p
                className="mt-5 animate-enter font-display text-display-sm text-foreground/80"
                style={enterDelay(240)}
              >
                {category.tagline}
              </p>
              <p
                className="mt-6 max-w-lg animate-enter text-base leading-relaxed text-muted"
                style={enterDelay(320)}
              >
                {category.summary}
              </p>

              <div
                className="mt-9 flex animate-enter flex-wrap gap-3"
                style={enterDelay(400)}
              >
                <ButtonLink href={quotePath({ category: category.slug })}>
                  Request a Quote
                </ButtonLink>
                <ButtonLink
                  href={whatsappUrl(whatsappMessages.category(category.name))}
                  variant="secondary"
                  icon={<WhatsAppIcon className="size-5 shrink-0" />}
                >
                  WhatsApp inquiry
                </ButtonLink>
              </div>

              {category.privateLabelInquiries ? (
                <div className="mt-6 animate-enter" style={enterDelay(480)}>
                  <ButtonLink href={routes.oemPrivateLabel} variant="text">
                    OEM &amp; private-label options
                  </ButtonLink>
                </div>
              ) : null}

              <div className="animate-enter" style={enterDelay(540)}>
                <ProductDetails category={category} />
              </div>
            </div>

            <div
              className="animate-enter lg:col-span-7"
              style={enterDelay(200)}
            >
              <ProductGallery images={category.images} name={category.name} />
            </div>
          </div>
        </Container>
      </section>

      <RelatedCategories slug={category.slug} />

      <CtaBand
        eyebrow={category.name}
        title={
          <>
            Discuss your
            <LineBreak />
            {category.name.toLowerCase()} order.
          </>
        }
        intro={`Share quantities, styles and any branding requirements for ${category.name.toLowerCase()} to start the conversation with our team.`}
        quoteHref={quotePath({ category: category.slug })}
        whatsappMessage={whatsappMessages.category(category.name)}
      />
    </>
  );
}
