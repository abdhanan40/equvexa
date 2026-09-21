<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Equvexa project rules

- Read `README.md` for the stack, folder structure and conventions before making changes.
- Never invent business information: products, prices, certifications, statistics, reviews, addresses, phone numbers or emails. Use only information supplied by Equvexa Industries.
- The catalogue has exactly seven categories, defined in `src/data/product-categories.ts`.
- No e-commerce features (cart, checkout, payments, public pricing). Conversion actions are Request a Quote, Wholesale Inquiry and WhatsApp contact.
- Design tokens live in `src/styles/tokens.css`; do not hard-code colours in components.
- Use only the approved images in `public/images/`; never substitute stock or downloaded product imagery, and never edit the image files.
- No fake functionality: controls must perform a real action or say honestly what they do. The forms deliver inquiries by email from the server (`src/server/inquiry/`); success is shown only when delivery succeeded.
