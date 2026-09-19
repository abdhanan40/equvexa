import Link from "next/link";

import { ProductPhoto } from "@/components/product/product-photo";
import { ArrowRightIcon } from "@/components/ui/icons";
import { productCategoryPath } from "@/config/routes";
import { getCoverImage } from "@/data/product-categories";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/catalog";

/** Editorial category card: image, number, name and a quiet range link. */
export function ProductCard({
  category,
  number,
  sizes,
  className,
}: {
  category: ProductCategory;
  number: number;
  sizes: string;
  className?: string;
}) {
  return (
    <Link
      href={productCategoryPath(category.slug)}
      className={cn("group block", className)}
    >
      <div className="relative">
        <ProductPhoto
          image={getCoverImage(category)}
          alt=""
          sizes={sizes}
          className="aspect-square"
          imageClassName="transition-[scale,translate,filter] duration-[1400ms] ease-out-expo group-hover:-translate-y-[1.5%] group-hover:scale-[1.045] group-hover:brightness-[1.06]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/55 via-ink/0 to-ink/10 transition-opacity duration-1000 ease-out-expo group-hover:opacity-70"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border border-ivory/10 transition-colors duration-700 ease-out-expo group-hover:border-gold/70"
        />
        <span
          aria-hidden="true"
          className="absolute top-3 left-3 rounded-full border border-ivory/15 bg-ink/65 px-3 py-1.5 text-eyebrow leading-none font-semibold tracking-eyebrow text-ivory tabular-nums backdrop-blur-md"
        >
          {String(number).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4 border-b border-border pb-4 transition-colors duration-700 ease-out-expo group-hover:border-accent">
        <div>
          <h3 className="font-display text-display-sm text-balance uppercase">
            {category.name}
          </h3>
          <p className="mt-2 text-eyebrow font-semibold tracking-eyebrow text-muted uppercase transition-colors duration-500 group-hover:text-accent">
            View range
          </p>
        </div>
        <ArrowRightIcon className="mt-1.5 size-5 shrink-0 text-muted transition-[translate,color] duration-500 ease-out-expo group-hover:translate-x-1 group-hover:text-accent" />
      </div>
    </Link>
  );
}
