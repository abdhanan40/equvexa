import Image from "next/image";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/catalog";

/**
 * Renders an approved product image in a frame sized by `className`.
 * Studio shots sit on a lit ivory ground and are never cropped; scene shots
 * fill the frame using the image's focal point.
 */
export function ProductPhoto({
  image,
  sizes,
  alt = image.alt,
  className,
  imageClassName,
  loading,
  preload,
}: {
  image: ProductImage;
  sizes: string;
  /** Pass "" when nearby text already names the product. */
  alt?: string;
  className?: string;
  imageClassName?: string;
  loading?: "eager" | "lazy";
  preload?: boolean;
}) {
  if (image.style === "studio") {
    return (
      <div
        className={cn(
          "studio-light studio-frame relative overflow-hidden p-[7%]",
          className,
        )}
      >
        <div
          className="studio-photo"
          style={{ "--photo-ratio": image.width / image.height } as CSSProperties}
        >
          <Image
            src={image.src}
            alt={alt}
            fill
            sizes={sizes}
            loading={loading}
            preload={preload}
            className={cn("object-contain", imageClassName)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-ink-soft", className)}>
      <Image
        src={image.src}
        alt={alt}
        fill
        sizes={sizes}
        loading={loading}
        preload={preload}
        className={cn("object-cover", imageClassName)}
        style={{ objectPosition: image.focus }}
      />
    </div>
  );
}
