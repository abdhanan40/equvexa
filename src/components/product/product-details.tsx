import type { ProductCategory } from "@/types/catalog";

/**
 * Verified specifications for a category. Until Equvexa supplies them, an
 * honest note explains that details are confirmed per inquiry.
 */
export function ProductDetails({ category }: { category: ProductCategory }) {
  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="text-eyebrow font-semibold tracking-eyebrow text-accent uppercase">
        Specifications
      </h2>
      {category.details.length > 0 ? (
        <dl className="mt-5 grid gap-x-6 sm:grid-cols-[auto_1fr]">
          {category.details.map((detail) => (
            <div
              key={detail.label}
              className="grid gap-1 border-b border-border py-3 sm:col-span-2 sm:grid-cols-subgrid"
            >
              <dt className="text-sm text-muted">{detail.label}</dt>
              <dd className="text-sm">{detail.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
          Specifications, sizing and order quantities for{" "}
          {category.name.toLowerCase()} are discussed directly with our team
          for each inquiry.
        </p>
      )}
    </div>
  );
}
