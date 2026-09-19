import type {
  ProductCategory,
  ProductCategorySlug,
  ProductImage,
} from "@/types/catalog";

function productImage(
  slug: ProductCategorySlug,
  file: number,
  size: [width: number, height: number],
  alt: string,
  options: Pick<ProductImage, "style" | "focus">,
): ProductImage {
  return {
    src: `/images/products/${slug}/${slug}-${String(file).padStart(2, "0")}.png`,
    width: size[0],
    height: size[1],
    alt,
    ...options,
  };
}

const SQUARE: [number, number] = [1254, 1254];
const LANDSCAPE: [number, number] = [1312, 1199];

/**
 * The seven EQUVEXA product categories, in display order.
 *
 * Single source of truth for category content and imagery. Copy describes
 * each category and invites B2B inquiries; it never states materials,
 * specifications, certifications or quantities. Add verified facts to
 * `details` once Equvexa Industries supplies them.
 */
export const productCategories: readonly ProductCategory[] = [
  {
    slug: "riding-gloves",
    name: "Riding Gloves",
    tagline: "For the hands that hold the reins.",
    summary:
      "Riding gloves for tack shops, equestrian retailers, distributors and private-label brands. Share the styles, sizes and branding you have in mind, and our team will discuss options for your order.",
    metaDescription:
      "EQUVEXA riding gloves for B2B buyers. Wholesale, distribution and private-label inquiries with an equestrian gear manufacturer and exporter based in Pakistan.",
    images: [
      productImage("riding-gloves", 1, SQUARE, "Pair of black EQUVEXA riding gloves on a white background", { style: "studio" }),
      productImage("riding-gloves", 4, SQUARE, "Rider wearing EQUVEXA riding gloves while holding the reins", { style: "scene", focus: "62% 50%" }),
      productImage("riding-gloves", 3, SQUARE, "Close-up of an EQUVEXA riding glove wrist strap with the EQUVEXA logo", { style: "scene", focus: "40% 45%" }),
      productImage("riding-gloves", 2, SQUARE, "EQUVEXA riding gloves showing the palm and the back of the hand", { style: "studio" }),
    ],
    coverImage: 2,
    details: [],
    privateLabelInquiries: true,
  },
  {
    slug: "stirrups",
    name: "Stirrups",
    tagline: "Where the rider's foot meets the saddle.",
    summary:
      "Stirrups for saddlery stores, wholesalers and private-label programmes. Tell us about the designs and quantities you are considering to start a B2B conversation.",
    metaDescription:
      "EQUVEXA stirrups for B2B buyers. Wholesale, distribution and private-label inquiries with an equestrian gear manufacturer and exporter based in Pakistan.",
    images: [
      productImage("stirrups", 1, SQUARE, "Pair of EQUVEXA stirrups on a white background", { style: "studio" }),
      productImage("stirrups", 2, SQUARE, "EQUVEXA stirrups on a wooden table beside a saddle pad", { style: "scene", focus: "45% 60%" }),
      productImage("stirrups", 3, SQUARE, "Detail views of an EQUVEXA stirrup, including the tread and the branded side", { style: "scene" }),
      productImage("stirrups", 4, LANDSCAPE, "Rider's boot resting in an EQUVEXA stirrup", { style: "scene", focus: "50% 55%" }),
    ],
    coverImage: 1,
    details: [],
    privateLabelInquiries: true,
  },
  {
    slug: "riding-chaps",
    name: "Riding Chaps",
    tagline: "Worn close, from boot to knee.",
    summary:
      "Riding chaps for equestrian retailers, wholesalers and distributors. Contact our team to discuss styles, sizing and branding for your market.",
    metaDescription:
      "EQUVEXA riding chaps for B2B buyers. Wholesale, distribution and private-label inquiries with an equestrian gear manufacturer and exporter based in Pakistan.",
    images: [
      productImage("riding-chaps", 1, [1145, 1374], "Pair of black EQUVEXA riding chaps with riding boots on a white background", { style: "studio" }),
      productImage("riding-chaps", 2, [1199, 1312], "Rider standing in a stable wearing EQUVEXA riding chaps", { style: "scene", focus: "58% 62%" }),
      productImage("riding-chaps", 4, LANDSCAPE, "Mounted rider wearing EQUVEXA riding chaps", { style: "scene", focus: "60% 50%" }),
      productImage("riding-chaps", 3, SQUARE, "Detail views of EQUVEXA riding chaps, including the zip and the strap", { style: "scene" }),
    ],
    coverImage: 1,
    details: [],
    privateLabelInquiries: true,
  },
  {
    slug: "horse-salt",
    name: "Horse Salt",
    tagline: "Salt licks for the stable.",
    summary:
      "Horse salt licks for tack shops, feed and equestrian retailers, and distributors. Share your quantity and packaging requirements to discuss supply.",
    metaDescription:
      "EQUVEXA horse salt licks for B2B buyers. Wholesale, distribution and private-label inquiries with an equestrian supplier and exporter based in Pakistan.",
    images: [
      productImage("horse-salt", 1, LANDSCAPE, "EQUVEXA horse salt lick with a rope beside its box, with a horse in the stable", { style: "scene", focus: "62% 60%" }),
      productImage("horse-salt", 3, LANDSCAPE, "Two EQUVEXA horse salt licks with their box in a stable", { style: "scene", focus: "60% 60%" }),
      productImage("horse-salt", 4, LANDSCAPE, "Three EQUVEXA horse salt licks with packaging in a stable", { style: "scene" }),
      productImage("horse-salt", 2, LANDSCAPE, "Horse licking an EQUVEXA salt lick in a stable", { style: "scene", focus: "70% 60%" }),
    ],
    coverImage: 0,
    details: [],
    privateLabelInquiries: true,
  },
  {
    slug: "horse-riding-caps",
    name: "Horse Riding Caps",
    tagline: "Finishing the rider's turnout.",
    summary:
      "Horse riding caps for equestrian retailers, saddlery stores and distributors. Share the styles, sizes and quantities you need to discuss options.",
    metaDescription:
      "EQUVEXA horse riding caps for B2B buyers. Wholesale, distribution and private-label inquiries with an equestrian gear manufacturer and exporter based in Pakistan.",
    images: [
      productImage("horse-riding-caps", 1, LANDSCAPE, "Black EQUVEXA riding cap on a wooden table in a stable", { style: "scene", focus: "45% 55%" }),
      productImage("horse-riding-caps", 3, LANDSCAPE, "Black EQUVEXA riding cap on a wooden stand in a stable", { style: "scene", focus: "40% 60%" }),
      productImage("horse-riding-caps", 2, LANDSCAPE, "Black EQUVEXA riding cap beside EQUVEXA packaging", { style: "scene", focus: "60% 55%" }),
      productImage("horse-riding-caps", 4, LANDSCAPE, "Three EQUVEXA riding caps displayed in a stable", { style: "scene" }),
    ],
    coverImage: 0,
    details: [],
    privateLabelInquiries: true,
  },
  {
    slug: "riding-saddles",
    name: "Riding Saddles",
    tagline: "The foundation of every ride.",
    summary:
      "Riding saddles for saddlery stores, tack shops and distributors. Discuss models, sizing and branding requirements with our team.",
    metaDescription:
      "EQUVEXA riding saddles for B2B buyers. Wholesale, distribution and private-label inquiries with an equestrian gear manufacturer and exporter based in Pakistan.",
    images: [
      productImage("riding-saddles", 1, LANDSCAPE, "Brown EQUVEXA saddle with a black saddle pad on a wooden stand", { style: "scene", focus: "55% 55%" }),
      productImage("riding-saddles", 4, LANDSCAPE, "EQUVEXA saddles displayed with a riding cap and gloves in a stable", { style: "scene" }),
      productImage("riding-saddles", 2, LANDSCAPE, "Brown EQUVEXA saddle on a stand, seen from the side", { style: "scene", focus: "58% 55%" }),
      productImage("riding-saddles", 3, LANDSCAPE, "Black EQUVEXA saddle on a wooden stand", { style: "scene", focus: "50% 55%" }),
    ],
    coverImage: 0,
    details: [],
    privateLabelInquiries: true,
  },
  {
    slug: "horse-bits",
    name: "Horse Bits",
    tagline: "Where rider and horse connect.",
    summary:
      "Horse bits for tack shops, equestrian retailers and wholesalers. Share the styles and quantities you are looking for to start an inquiry.",
    metaDescription:
      "EQUVEXA horse bits for B2B buyers. Wholesale, distribution and private-label inquiries with an equestrian gear manufacturer and exporter based in Pakistan.",
    images: [
      productImage("horse-bits", 2, LANDSCAPE, "EQUVEXA horse bit on a wooden block in front of its presentation box", { style: "scene", focus: "50% 55%" }),
      productImage("horse-bits", 1, LANDSCAPE, "EQUVEXA horse bit resting on a wooden block in a stable", { style: "scene", focus: "45% 60%" }),
      productImage("horse-bits", 3, LANDSCAPE, "EQUVEXA horse bit on a wooden block beside EQUVEXA packaging", { style: "scene", focus: "40% 60%" }),
      productImage("horse-bits", 4, LANDSCAPE, "Display board of six EQUVEXA horse bits", { style: "scene" }),
    ],
    coverImage: 0,
    details: [],
    privateLabelInquiries: true,
  },
];

export function getProductCategory(slug: string): ProductCategory | undefined {
  return productCategories.find((category) => category.slug === slug);
}

/** Looks up a category that must exist, such as one referenced in data. */
export function categoryBySlug(slug: ProductCategorySlug): ProductCategory {
  const category = getProductCategory(slug);
  if (!category) throw new Error(`Unknown product category: ${slug}`);
  return category;
}

/** Position of a category in the catalogue, starting at 1. */
export function getCategoryNumber(slug: ProductCategorySlug): number {
  return productCategories.findIndex((category) => category.slug === slug) + 1;
}

/** The next categories in catalogue order, wrapping around to the start. */
export function getRelatedCategories(
  slug: ProductCategorySlug,
  count = 3,
): ProductCategory[] {
  const start = getCategoryNumber(slug);
  return Array.from(
    { length: count },
    (_, offset) =>
      productCategories[(start + offset) % productCategories.length],
  );
}

export function getCoverImage(category: ProductCategory): ProductImage {
  return category.images[category.coverImage];
}
