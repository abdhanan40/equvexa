import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";

/*
 * Brand typefaces (provisional, to be confirmed in the design stage).
 *
 * Fonts are self-hosted at build time by next/font. Each one exposes a CSS
 * variable that src/styles/tokens.css maps to the `font-display` and
 * `font-sans` utilities. To change a typeface, swap the import below and
 * keep the variable name.
 *
 * Do not pass `fallback` here: it replaces next/font's metric-adjusted
 * fallback face, which prevents layout shift while fonts load. Generic
 * families are appended in tokens.css instead.
 */

/** Display serif for headings and editorial moments. */
export const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display-family",
});

/** Sans-serif for body copy, navigation, forms and specifications. */
export const sansFont = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans-family",
});
