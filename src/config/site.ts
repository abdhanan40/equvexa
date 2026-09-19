/**
 * Site-wide configuration.
 *
 * Only confirmed business information belongs here. Social links, a postal
 * address and company history will be added once they are supplied by
 * Equvexa Industries.
 */
export const siteConfig = {
  name: "Equvexa Industries",
  brand: "EQUVEXA",
  description:
    "Equestrian riding gear manufacturer and exporter based in Pakistan, serving international B2B buyers.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  country: "Pakistan",
  contact: {
    email: "equvexaindustries@gmail.com",
    whatsapp: {
      display: "+92 312 4477636",
      /** International format without "+" or spaces, as wa.me expects. */
      number: "923124477636",
    },
  },
} as const;
