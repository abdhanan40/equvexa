import { siteConfig } from "@/config/site";

export type CompanyFact = {
  label: string;
  value: string;
};

/**
 * Company facts shown on the About page.
 *
 * Only information confirmed by Equvexa Industries belongs here. Add items
 * such as founding year, facilities or certifications once they are
 * supplied; the About page renders whatever this list contains.
 */
export const companyFacts: readonly CompanyFact[] = [
  { label: "Company", value: siteConfig.name },
  { label: "Brand", value: siteConfig.brand },
  { label: "Based in", value: siteConfig.country },
  {
    label: "Business",
    value: "Equestrian riding gear manufacturing and export",
  },
  {
    label: "Buyers",
    value:
      "International B2B: retailers, tack shops, wholesalers, distributors, importers and private-label brands",
  },
];

/** The audiences EQUVEXA serves, as described by the business. */
export const audiences = [
  "Equestrian tack shops",
  "Saddlery stores",
  "Riding equipment retailers",
  "Wholesalers",
  "Distributors",
  "Importers",
  "Private-label brands",
] as const;
