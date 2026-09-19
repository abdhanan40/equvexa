"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useFinePointer, usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

/**
 * Gently pulls its child towards the pointer while hovered. Only active for
 * precise pointers when reduced motion is not requested.
 */
export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: ReactNode;
  /** Share of the pointer offset applied as movement. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || !finePointer || reducedMotion) return;

    let bounds: DOMRect | null = null;
    let frame = 0;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      bounds ??= element.getBoundingClientRect();
      const x = event.clientX - (bounds.left + bounds.width / 2);
      const y = event.clientY - (bounds.top + bounds.height / 2);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        element.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
      });
    };

    const handleLeave = () => {
      bounds = null;
      cancelAnimationFrame(frame);
      element.style.transform = "";
    };

    element.addEventListener("pointermove", handleMove, { passive: true });
    element.addEventListener("pointerleave", handleLeave);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", handleMove);
      element.removeEventListener("pointerleave", handleLeave);
      element.style.transform = "";
    };
  }, [finePointer, reducedMotion, strength]);

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex transition-transform duration-700 ease-out-expo",
        className,
      )}
    >
      {children}
    </span>
  );
}
