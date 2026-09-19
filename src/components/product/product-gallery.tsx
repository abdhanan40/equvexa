"use client";

import { useEffect, useRef, useState } from "react";

import { ProductPhoto } from "@/components/product/product-photo";
import { iconButtonClasses } from "@/components/ui/control";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/catalog";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Four-image product gallery. The main track uses native scroll snapping,
 * so it can be swiped on touch screens; thumbnails and previous/next buttons
 * cover mouse and keyboard use.
 */
export function ProductGallery({
  images,
  name,
}: {
  images: readonly ProductImage[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();
  const count = images.length;

  // Keep the active thumbnail in sync when the track is swiped.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = slideRefs.current.indexOf(
            entry.target as HTMLDivElement,
          );
          if (index >= 0) setActive(index);
        }
      },
      { root: track, threshold: 0.6 },
    );
    for (const slide of slideRefs.current) {
      if (slide) observer.observe(slide);
    }
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    const track = trackRef.current;
    const slide = slideRefs.current[index];
    if (!track || !slide) return;
    track.scrollTo({
      left: slide.offsetLeft,
      behavior: reducedMotion ? "auto" : "smooth",
    });
    setActive(index);
  };

  return (
    <div>
      <div className="relative">
        <div
          ref={trackRef}
          role="region"
          aria-label={`${name} images`}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => (
            <div
              key={image.src}
              ref={(element) => {
                slideRefs.current[index] = element;
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
              className="w-full shrink-0 snap-center"
            >
              <ProductPhoto
                image={image}
                sizes="(min-width: 1024px) 56vw, 100vw"
                loading={index === 0 ? "eager" : "lazy"}
                className="aspect-square lg:aspect-[6/5]"
              />
            </div>
          ))}
        </div>

        <p
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-ivory/15 bg-ink/70 px-4 py-2 text-eyebrow tracking-eyebrow text-ivory tabular-nums backdrop-blur-md"
        >
          {pad(active + 1)} / {pad(count)}
        </p>
        <div className="tone-dark absolute right-4 bottom-4 flex gap-2">
          <button
            type="button"
            onClick={() => goTo((active - 1 + count) % count)}
            className={iconButtonClasses("bg-ink/55 hover:bg-ink/75")}
          >
            <ArrowLeftIcon className="size-4" />
            <span className="sr-only">Previous image</span>
          </button>
          <button
            type="button"
            onClick={() => goTo((active + 1) % count)}
            className={iconButtonClasses("bg-ink/55 hover:bg-ink/75")}
          >
            <ArrowRightIcon className="size-4" />
            <span className="sr-only">Next image</span>
          </button>
        </div>
      </div>

      <ul className="mt-3 grid grid-cols-4 gap-3">
        {images.map((image, index) => {
          const current = index === active;
          return (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-current={current ? "true" : undefined}
                className="group relative block w-full overflow-hidden"
              >
                <ProductPhoto
                  image={image}
                  alt=""
                  sizes="(min-width: 1024px) 13vw, 23vw"
                  loading="eager"
                  className="aspect-square"
                  imageClassName="transition-[scale] duration-700 ease-out-expo group-hover:scale-105"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-0 border transition-[background-color,border-color] duration-500",
                    current
                      ? "border-gold bg-transparent"
                      : "border-transparent bg-ink/35 group-hover:bg-ink/10",
                  )}
                />
                <span className="sr-only">
                  Show image {index + 1} of {count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p aria-live="polite" className="sr-only">
        {`Image ${active + 1} of ${count}: ${images[active].alt}`}
      </p>
    </div>
  );
}
