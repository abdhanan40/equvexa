import { productCategoryPath, routes } from "@/config/routes";
import { productCategories } from "@/data/product-categories";

export type NavItem = {
  label: string;
  href: string;
};

export const mainNavigation: readonly NavItem[] = [
  { label: "Home", href: routes.home },
  { label: "Products", href: routes.products },
  { label: "OEM / Private Label", href: routes.oemPrivateLabel },
  { label: "Wholesale", href: routes.wholesaleExport },
  { label: "About", href: routes.about },
  { label: "Contact", href: routes.contact },
];

export const footerNavigation: readonly {
  title: string;
  items: readonly NavItem[];
}[] = [
  {
    title: "Products",
    items: productCategories.map((category) => ({
      label: category.name,
      href: productCategoryPath(category.slug),
    })),
  },
  {
    title: "Company",
    items: [
      { label: "Home", href: routes.home },
      { label: "About", href: routes.about },
      { label: "All products", href: routes.products },
      { label: "Contact", href: routes.contact },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "OEM / Private Label", href: routes.oemPrivateLabel },
      { label: "Wholesale / Export", href: routes.wholesaleExport },
      { label: "Request a Quote", href: routes.requestQuote },
    ],
  },
];

/** Whether a navigation item matches the current pathname. */
export function isActivePath(pathname: string, href: string) {
  if (href === routes.home) return pathname === routes.home;
  return pathname === href || pathname.startsWith(`${href}/`);
}
