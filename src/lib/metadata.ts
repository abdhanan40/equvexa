import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

/** Page metadata with a canonical URL and matching Open Graph fields. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.brand,
      locale: "en",
      url: path,
      title: `${title} | ${siteConfig.brand}`,
      description,
    },
  };
}
