import type { ProductCategorySlug } from "@/types/catalog";
import type { InquiryType } from "@/types/inquiry";

/** Every public route. Link to these instead of hard-coding paths. */
export const routes = {
  home: "/",
  products: "/products",
  oemPrivateLabel: "/oem-private-label",
  wholesaleExport: "/wholesale-export",
  about: "/about",
  contact: "/contact",
  requestQuote: "/request-a-quote",
} as const;

export function productCategoryPath(slug: ProductCategorySlug) {
  return `${routes.products}/${slug}`;
}

/** Quote page link, optionally preselecting a category and inquiry type. */
export function quotePath(options?: {
  category?: ProductCategorySlug;
  inquiry?: InquiryType;
}) {
  const params = new URLSearchParams();
  if (options?.category) params.set("category", options.category);
  if (options?.inquiry) params.set("inquiry", options.inquiry);
  const query = params.toString();
  return query ? `${routes.requestQuote}?${query}` : routes.requestQuote;
}
