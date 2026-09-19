/** URL-safe identifiers for the seven EQUVEXA product categories. */
export type ProductCategorySlug =
  | "riding-gloves"
  | "stirrups"
  | "riding-chaps"
  | "horse-salt"
  | "horse-riding-caps"
  | "riding-saddles"
  | "horse-bits";

/**
 * How a product image was photographed.
 * - `studio`: product on a plain white background. Presented on a lit ivory
 *   ground so the white blends away without editing the file.
 * - `scene`: a full photograph that fills its frame.
 */
export type ProductImageStyle = "studio" | "scene";

export type ProductImage = {
  /** Path under /public. */
  src: string;
  width: number;
  height: number;
  alt: string;
  style: ProductImageStyle;
  /** CSS object-position used when the image is cropped. Defaults to centre. */
  focus?: string;
};

/** A verified product fact supplied by Equvexa Industries. */
export type ProductDetail = {
  label: string;
  value: string;
};

export type ProductCategory = {
  slug: ProductCategorySlug;
  name: string;
  /** Short editorial line about the category. Never a product claim. */
  tagline: string;
  /** Neutral B2B introduction for listings and the category page. */
  summary: string;
  /** Search-result description for the category page. */
  metaDescription: string;
  /** The four approved images, in gallery order. */
  images: readonly [ProductImage, ProductImage, ProductImage, ProductImage];
  /** Index of the image that represents the category on cards. */
  coverImage: 0 | 1 | 2 | 3;
  /**
   * Verified specifications such as materials, sizes or minimum order
   * quantities. Empty until Equvexa supplies them; pages adapt automatically.
   */
  details: readonly ProductDetail[];
  /** Show OEM / private-label calls to action for this category. */
  privateLabelInquiries: boolean;
};
