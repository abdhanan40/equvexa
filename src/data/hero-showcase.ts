import type { ProductCategorySlug } from "@/types/catalog";

/** Switch choreography, chosen to suit each product's physical character. */
export type HeroTransition = "metal-turn" | "layered-turn" | "vertical-rise";

/** Spotlight colour of the hero background while a product is shown. */
export type HeroTone = "steel" | "leather" | "bronze";

/** Equestrian hardware and leather details that float around the product. */
export type HeroObjectKind =
  | "ring"
  | "d-ring"
  | "snaffle"
  | "buckle"
  | "stud"
  | "strap"
  | "horseshoe";

export type HeroObjectFinish = "steel" | "gold" | "black-leather" | "tan-leather";

/** A floating object for one product: centre in % of the hero stage. */
export type HeroObjectPlacement = {
  kind: HeroObjectKind;
  finish: HeroObjectFinish;
  x: number;
  y: number;
  rotate: number;
};

/**
 * Transparent cutout derived from a studio photo in the category gallery.
 * The approved original is unchanged; the cutout only removes its white
 * background (see README, Product imagery).
 */
export type HeroCutout = {
  src: string;
  alt: string;
  /** Low-resolution alpha mask for the specular highlight layer. */
  mask: string;
  width: number;
  height: number;
};

export type HeroShowcaseEntry = {
  slug: ProductCategorySlug;
  cutout: HeroCutout;
  transition: HeroTransition;
  tone: HeroTone;
  /** Resting rotation of the floating product, in degrees. */
  tilt: number;
  /** Evens out how large each product reads on the stage. Defaults to 1. */
  scale?: number;
  /** Nudges the product within the stage, in % of the stage box: [x, y]. */
  offset?: readonly [number, number];
  /** How the cutout sits in its carousel card, for very wide products. */
  card?: { rotate: number; scale: number };
  /** One placement per slot in HERO_OBJECT_SLOTS, in the same order. */
  objects: readonly HeroObjectPlacement[];
};

export type HeroObjectLayer = "far" | "back" | "front";

/**
 * Fixed depth slots for the floating objects. Each product fills every slot
 * with its own object and position, so objects can gather and re-form when
 * the product changes. Size is a % of the stage width.
 */
export type HeroObjectSlot = {
  layer: HeroObjectLayer;
  size: number;
  opacity: number;
  blur: number;
  /** Idle float cycle in seconds. */
  float: number;
  /**
   * Position in the stacked layout on small screens, where the stage is a
   * square around the product. Slots without one are hidden there.
   */
  mobile?: { x: number; y: number };
};

export const HERO_OBJECT_SLOTS: readonly HeroObjectSlot[] = [
  { layer: "far", size: 5.5, opacity: 0.4, blur: 3, float: 13 },
  { layer: "far", size: 11, opacity: 0.22, blur: 5, float: 16 },
  { layer: "far", size: 7, opacity: 0.3, blur: 3.5, float: 14 },
  { layer: "back", size: 6.5, opacity: 0.75, blur: 1.2, float: 9, mobile: { x: 88, y: 12 } },
  { layer: "back", size: 5.5, opacity: 0.7, blur: 1.2, float: 11 },
  { layer: "back", size: 6, opacity: 0.7, blur: 1.2, float: 10 },
  { layer: "front", size: 10.5, opacity: 1, blur: 0, float: 6, mobile: { x: 7, y: 26 } },
  { layer: "front", size: 7.5, opacity: 1, blur: 0, float: 7 },
  { layer: "front", size: 12.5, opacity: 1, blur: 0.6, float: 8, mobile: { x: 91, y: 78 } },
  { layer: "front", size: 8, opacity: 1, blur: 0, float: 6.5 },
  { layer: "front", size: 6.5, opacity: 1, blur: 1.4, float: 7.5 },
];

/**
 * Products featured in the homepage hero, in carousel order: all seven
 * categories.
 *
 * The hero floats each product on a dark stage as a transparent cutout
 * derived from one of its approved photos (see README, Product imagery).
 */
export const heroShowcase: readonly HeroShowcaseEntry[] = [
  {
    slug: "stirrups",
    cutout: {
      src: "/images/hero/stirrups-cutout.png",
      alt: "Pair of EQUVEXA stirrups",
      mask: "/images/hero/stirrups-mask.png",
      width: 1117,
      height: 1012,
    },
    transition: "metal-turn",
    tone: "steel",
    tilt: -9,
    objects: [
      { kind: "ring", finish: "steel", x: 17, y: 9, rotate: 0 },
      { kind: "horseshoe", finish: "steel", x: 87, y: 55, rotate: 24 },
      { kind: "ring", finish: "gold", x: 72, y: 96, rotate: 0 },
      { kind: "stud", finish: "steel", x: 36, y: 27, rotate: 0 },
      { kind: "ring", finish: "steel", x: 61, y: 64, rotate: 0 },
      { kind: "d-ring", finish: "gold", x: 40, y: 86, rotate: -30 },
      { kind: "snaffle", finish: "steel", x: 40, y: 14, rotate: -18 },
      { kind: "buckle", finish: "gold", x: 66, y: 9, rotate: 16 },
      { kind: "snaffle", finish: "gold", x: 75, y: 50, rotate: 28 },
      { kind: "stud", finish: "gold", x: 29, y: 72, rotate: 0 },
      { kind: "ring", finish: "steel", x: 50, y: 92, rotate: 0 },
    ],
  },
  {
    slug: "riding-gloves",
    cutout: {
      src: "/images/hero/riding-gloves-cutout.png",
      alt: "Pair of black EQUVEXA riding gloves",
      mask: "/images/hero/riding-gloves-mask.png",
      width: 1045,
      height: 1164,
    },
    transition: "layered-turn",
    tone: "leather",
    tilt: 7,
    objects: [
      { kind: "stud", finish: "gold", x: 15, y: 11, rotate: 0 },
      { kind: "strap", finish: "black-leather", x: 86, y: 52, rotate: -34 },
      { kind: "d-ring", finish: "gold", x: 70, y: 94, rotate: 20 },
      { kind: "d-ring", finish: "gold", x: 38, y: 25, rotate: -24 },
      { kind: "stud", finish: "gold", x: 62, y: 66, rotate: 0 },
      { kind: "strap", finish: "tan-leather", x: 42, y: 88, rotate: 18 },
      { kind: "strap", finish: "black-leather", x: 41, y: 13, rotate: 22 },
      { kind: "stud", finish: "gold", x: 65, y: 11, rotate: 0 },
      { kind: "buckle", finish: "gold", x: 76, y: 48, rotate: -22 },
      { kind: "d-ring", finish: "gold", x: 30, y: 73, rotate: 36 },
      { kind: "stud", finish: "gold", x: 52, y: 93, rotate: 0 },
    ],
  },
  {
    slug: "riding-chaps",
    cutout: {
      src: "/images/hero/riding-chaps-cutout.png",
      alt: "Pair of black EQUVEXA riding chaps with riding boots",
      mask: "/images/hero/riding-chaps-mask.png",
      width: 1048,
      height: 1319,
    },
    transition: "vertical-rise",
    tone: "bronze",
    tilt: -6,
    scale: 0.93,
    objects: [
      { kind: "d-ring", finish: "steel", x: 16, y: 10, rotate: 30 },
      { kind: "strap", finish: "tan-leather", x: 87, y: 56, rotate: 40 },
      { kind: "stud", finish: "steel", x: 71, y: 95, rotate: 0 },
      { kind: "buckle", finish: "steel", x: 37, y: 26, rotate: -14 },
      { kind: "ring", finish: "gold", x: 63, y: 63, rotate: 0 },
      { kind: "stud", finish: "gold", x: 41, y: 87, rotate: 0 },
      { kind: "buckle", finish: "steel", x: 41, y: 13, rotate: 12 },
      { kind: "stud", finish: "steel", x: 66, y: 10, rotate: 0 },
      { kind: "strap", finish: "black-leather", x: 76, y: 49, rotate: -30 },
      { kind: "ring", finish: "steel", x: 29, y: 71, rotate: 0 },
      { kind: "d-ring", finish: "gold", x: 51, y: 93, rotate: -12 },
    ],
  },
  {
    slug: "horse-salt",
    cutout: {
      src: "/images/hero/horse-salt-cutout.png",
      alt: "EQUVEXA horse salt lick with its rope",
      mask: "/images/hero/horse-salt-mask.png",
      width: 768,
      height: 618,
    },
    transition: "vertical-rise",
    tone: "bronze",
    tilt: -4,
    scale: 0.9,
    objects: [
      { kind: "ring", finish: "gold", x: 15, y: 10, rotate: 0 },
      { kind: "horseshoe", finish: "steel", x: 86, y: 56, rotate: 20 },
      { kind: "d-ring", finish: "gold", x: 71, y: 95, rotate: 10 },
      { kind: "stud", finish: "gold", x: 37, y: 26, rotate: 0 },
      { kind: "strap", finish: "tan-leather", x: 62, y: 66, rotate: 30 },
      { kind: "ring", finish: "steel", x: 41, y: 87, rotate: 0 },
      { kind: "horseshoe", finish: "steel", x: 39, y: 13, rotate: -20 },
      { kind: "stud", finish: "gold", x: 66, y: 10, rotate: 0 },
      { kind: "d-ring", finish: "gold", x: 76, y: 48, rotate: -26 },
      { kind: "buckle", finish: "gold", x: 30, y: 72, rotate: 14 },
      { kind: "ring", finish: "gold", x: 52, y: 93, rotate: 0 },
    ],
  },
  {
    slug: "horse-riding-caps",
    cutout: {
      src: "/images/hero/horse-riding-caps-cutout.png",
      alt: "Black EQUVEXA riding cap",
      mask: "/images/hero/horse-riding-caps-mask.png",
      width: 903,
      height: 823,
    },
    transition: "layered-turn",
    tone: "leather",
    tilt: -6,
    scale: 0.96,
    objects: [
      { kind: "stud", finish: "steel", x: 16, y: 11, rotate: 0 },
      { kind: "strap", finish: "black-leather", x: 87, y: 53, rotate: -28 },
      { kind: "ring", finish: "steel", x: 72, y: 95, rotate: 0 },
      { kind: "buckle", finish: "steel", x: 36, y: 26, rotate: -12 },
      { kind: "d-ring", finish: "steel", x: 62, y: 64, rotate: 24 },
      { kind: "stud", finish: "gold", x: 41, y: 88, rotate: 0 },
      { kind: "strap", finish: "black-leather", x: 41, y: 13, rotate: 20 },
      { kind: "d-ring", finish: "steel", x: 65, y: 10, rotate: -18 },
      { kind: "buckle", finish: "steel", x: 76, y: 49, rotate: 18 },
      { kind: "stud", finish: "steel", x: 29, y: 73, rotate: 0 },
      { kind: "ring", finish: "gold", x: 51, y: 93, rotate: 0 },
    ],
  },
  {
    slug: "riding-saddles",
    cutout: {
      src: "/images/hero/riding-saddles-cutout.png",
      alt: "Brown EQUVEXA saddle with a black saddle pad and stirrup",
      mask: "/images/hero/riding-saddles-mask.png",
      width: 1033,
      height: 937,
    },
    transition: "vertical-rise",
    tone: "bronze",
    tilt: -5,
    objects: [
      { kind: "d-ring", finish: "gold", x: 15, y: 10, rotate: 24 },
      { kind: "strap", finish: "tan-leather", x: 86, y: 56, rotate: 36 },
      { kind: "ring", finish: "gold", x: 71, y: 96, rotate: 0 },
      { kind: "stud", finish: "gold", x: 37, y: 27, rotate: 0 },
      { kind: "buckle", finish: "gold", x: 62, y: 64, rotate: -12 },
      { kind: "d-ring", finish: "gold", x: 40, y: 87, rotate: -20 },
      { kind: "strap", finish: "tan-leather", x: 40, y: 13, rotate: -16 },
      { kind: "stud", finish: "gold", x: 66, y: 9, rotate: 0 },
      { kind: "d-ring", finish: "gold", x: 76, y: 50, rotate: 30 },
      { kind: "buckle", finish: "gold", x: 29, y: 73, rotate: -14 },
      { kind: "stud", finish: "gold", x: 51, y: 93, rotate: 0 },
    ],
  },
  {
    slug: "horse-bits",
    cutout: {
      src: "/images/hero/horse-bits-cutout.png",
      alt: "EQUVEXA horse bit",
      mask: "/images/hero/horse-bits-mask.png",
      width: 1211,
      height: 307,
    },
    transition: "metal-turn",
    tone: "steel",
    // A long, flat piece: set on a diagonal so it holds the stage.
    tilt: 32,
    offset: [8, 5],
    card: { rotate: 32, scale: 1.35 },
    objects: [
      { kind: "ring", finish: "steel", x: 16, y: 10, rotate: 0 },
      { kind: "snaffle", finish: "steel", x: 86, y: 55, rotate: 24 },
      { kind: "ring", finish: "gold", x: 72, y: 96, rotate: 0 },
      { kind: "stud", finish: "steel", x: 36, y: 27, rotate: 0 },
      { kind: "d-ring", finish: "gold", x: 61, y: 64, rotate: -24 },
      { kind: "ring", finish: "steel", x: 40, y: 86, rotate: 0 },
      { kind: "snaffle", finish: "gold", x: 40, y: 14, rotate: -14 },
      { kind: "d-ring", finish: "steel", x: 66, y: 9, rotate: 18 },
      { kind: "ring", finish: "gold", x: 76, y: 48, rotate: 0 },
      { kind: "stud", finish: "gold", x: 29, y: 72, rotate: 0 },
      { kind: "snaffle", finish: "steel", x: 52, y: 93, rotate: 12 },
    ],
  },
];
