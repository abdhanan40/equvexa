import type { MetadataRoute } from "next";

import { productCategoryPath, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { productCategories } from "@/data/product-categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...Object.values(routes),
    ...productCategories.map((category) => productCategoryPath(category.slug)),
  ];

  return paths.map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
  }));
}
