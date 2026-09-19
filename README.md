# Equvexa Industries — B2B Website

Website for Equvexa Industries, an equestrian riding gear manufacturer and exporter based in Pakistan, built for international B2B buyers: wholesalers, distributors, tack shops, equestrian retailers and private-label brands.

> **Status: Stage 2 (UI) for local, private preview.** All pages are built. Forms have no submission backend yet: they prepare a message that the visitor sends by email or WhatsApp. Nothing is deployed.

## Tech stack

| Tool                                  | Version                                                    |
| ------------------------------------- | ---------------------------------------------------------- |
| Next.js (App Router, Turbopack)       | 16.3.5                                                     |
| React                                 | 19.2.8 (the App Router renders with the React bundled in Next.js) |
| TypeScript                            | 5.9                                                        |
| Tailwind CSS                          | 4.3                                                        |
| ESLint                                | 9, flat config with `eslint-config-next`                   |
| clsx + tailwind-merge                 | Class name composition through `cn()`                      |

No animation library is used: motion relies on CSS, the Web Animations API and `requestAnimationFrame`. Requires Node.js 20.9 or later.

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000> (Next.js picks the next free port if 3000 is busy). To override environment values, copy `.env.example` to `.env.local`.

## Scripts

| Command             | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Start the development server                            |
| `npm run build`     | Create a production build (includes type checking)      |
| `npm run start`     | Serve the production build                              |
| `npm run lint`      | Run ESLint                                              |
| `npm run typecheck` | Generate route types, then run the TypeScript compiler  |

## Routes

| Route                     | Page                                             |
| ------------------------- | ------------------------------------------------ |
| `/`                       | Home, with the interactive product hero          |
| `/products`               | Catalogue of all seven categories                |
| `/products/[slug]`        | Category page with a four-image gallery (7 statically generated pages) |
| `/oem-private-label`      | OEM, private-label and custom orders             |
| `/wholesale-export`       | Wholesale and export inquiries                   |
| `/about`                  | Company positioning and confirmed details        |
| `/contact`                | Email, WhatsApp and message form                 |
| `/request-a-quote`        | B2B quote form (`?category=` and `?inquiry=` preselect fields) |

`sitemap.xml`, `robots.txt`, app icons and the Open Graph image are generated from `src/app`.

## Project structure

```text
public/images/
  logo/                     Official logo (EI-logo.jpeg) and transparent crops derived from it
  products/<category-slug>/ Approved product images, four per category
  hero/                     A cutout of one approved photo per category for the homepage
                            hero, with small silhouette masks for the highlight sweep
src/
  app/                      Routes, layouts, metadata files
  assets/                   Reserved for statically imported images and icons (empty)
  components/
    forms/                  Form fields and the "inquiry ready" panel
    layout/                 Header, mobile menu, footer, logo
    product/                Product photo, card, gallery, details, inquiry tile
    ui/                     Primitives: Button, Container, Reveal, Magnetic, icons, ...
  config/                   Site details, routes and navigation
  data/                     Product categories, hero showcase, company facts
  hooks/                    Media query, scroll and hydration hooks
  lib/                      Utilities: cn, contact links, inquiry helpers, metadata
  sections/
    home/                   Homepage sections; hero/ holds the interactive hero
    products/ quote/ contact/  Page-specific sections
    shared/                 Page hero, process steps, CTA band, checklist, direct contact
  styles/                   Fonts, design tokens and global styles
  types/                    Shared TypeScript types
```

## Conventions

- **Server Components by default.** `"use client"` is limited to the header and menu, hero experience, gallery, forms, `Reveal` and `Magnetic`.
- **Naming:** files are kebab-case (`container.tsx`); components are PascalCase named exports (`Container`).
- **Imports** use the `@/` alias for `src/`, e.g. `@/components/ui/container`.
- **Styling** uses Tailwind utilities backed by the design tokens; avoid hard-coded colour values in components. Combine class names with `cn()` from `@/lib/utils`.
- **Controls:** every interactive control comes from the shared language in `src/components/ui/control.ts` — `glassControl` (translucent surface, hairline border, blur), `iconButtonClasses` (circular arrows and the menu button), `navPillClasses` and `navCapsuleClasses` (the header capsule and any selector bar) — with `Button`/`ButtonLink` for pill buttons: muted-gold primary, glass secondary, plain text for quiet links. Add new controls from these rather than restyling one component on its own. Content surfaces (cards, panels, images, grids) keep their square editorial framing.
- **Colour roles:** prefer the semantic utilities (`bg-background`, `bg-surface`, `text-foreground`, `text-muted`, `text-accent`, `border-border`) so components adapt inside `surface-dark` sections. Gold text uses `gold` on dark surfaces and `gold-deep` on light surfaces; see the contrast notes in `tokens.css`.
- **New custom tokens** outside the colour and font namespaces must also be registered with tailwind-merge in `src/lib/utils.ts`.
- **Motion:** use `animate-enter` for page-entry (`animate-drop-in` for elements that settle from above, such as the homepage header), `<Reveal>` for scroll reveals and `motion-safe:` for anything decorative. Every animation must have a reduced-motion fallback.
- **Headings:** use `<LineBreak />` instead of `<br />` in display headings so they wrap naturally on phones.

## Product imagery

- All category content and image references live in `src/data/product-categories.ts`. Each image is marked `studio` (white background) or `scene` (full photograph); `<ProductPhoto>` presents studio shots on a lit ivory ground without editing the files.
- The homepage hero features all seven categories. Their order, cutouts, transitions and floating details are configured in `src/data/hero-showcase.ts`.
- `public/images/hero/` holds one cutout per category, derived from an approved photo so the product can float on the dark hero stage. For Stirrups, Riding Gloves and Riding Chaps the white studio background and its floor shadow are made transparent. The other four approved photos are full scenes, so the product (salt lick with its rope, riding cap, saddle with pad and stirrup, horse bit) was traced by hand and its edges refined against the photo, leaving out the stable, table and props around it. The product itself is untouched, and the originals in `public/images/products/` are never modified. Each cutout has a small white silhouette (`-mask.png`) used as a CSS mask for the highlight that follows the pointer.
- Add verified specifications to a category's `details` array; the category page shows them automatically.

## Homepage hero

`src/sections/home/hero/` is one full-viewport scene, composed in `hero.module.css`:

- `hero.tsx` (server) supplies the headline, copy and business link; `hero-experience.tsx` (client) lays out the scene and drives it.
- The identity line, headline, copy, primary action and the OEM link sit on the left; the featured-product cards on the right; the product floats at the centre with hardware details in front of and behind it (`hero-objects.tsx` draws them in SVG from the brand tokens).
- The cards (`hero-carousel.tsx`) form a circular carousel of all seven categories: two visible at a time with the active product first, a counter, arrows, arrow keys and touch swipe. Only the visible cards can be focused. Large product images load for the product in view and its neighbours only.
- Pointer response is written straight to the DOM inside one `requestAnimationFrame` loop: the product tilts and shifts, background layers drift against the pointer, foreground details move with it and give way near the cursor. It is skipped entirely for coarse pointers and reduced motion.
- Switching products runs one choreography (`hero-transitions.ts`): the details gather at the centre, the product turns away under motion blur, the new one arrives in its own way, the spotlight changes tone and the details re-form. Controls are locked until it ends.
- Below 1024px the scene stacks: header, headline, product, copy, action, cards.

## Content rules

- The catalogue has exactly seven categories: Riding Gloves, Stirrups, Riding Chaps, Horse Salt, Horse Riding Caps, Riding Saddles and Horse Bits.
- Publish only business information confirmed by Equvexa Industries. No invented products, prices, certifications, statistics, reviews, addresses or contact details.
- This is not an e-commerce store: no cart, checkout or payments. The primary actions are Request a Quote, Wholesale Inquiry and WhatsApp contact.
- Never show a success message for something that did not happen. The forms state that nothing is sent until the visitor sends it.
