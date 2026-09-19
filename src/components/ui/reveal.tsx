"use client";

import { useCallback, type CSSProperties, type ReactNode } from "react";

type RevealElement = "div" | "li" | "article" | "figure" | "section";

const reveal = (element: Element) => element.setAttribute("data-revealed", "");

let observer: IntersectionObserver | null = null;
const pending = new Set<HTMLElement>();
let flushScheduled = false;

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  return observer;
}

/**
 * Runs before the browser paints. Elements already on screen are marked as
 * revealed straight away (they were visible in the server HTML, so they must
 * not flicker); the rest wait for the observer. Only then does the page opt
 * into the hidden state, so content stays visible if JavaScript never runs.
 */
function flush() {
  flushScheduled = false;
  const elements = [...pending];
  pending.clear();
  const viewportHeight = window.innerHeight;
  const inView = elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return rect.top < viewportHeight && rect.bottom > 0;
  });
  elements.forEach((element, index) => {
    if (inView[index]) reveal(element);
    else getObserver().observe(element);
  });
  document.documentElement.setAttribute("data-reveal-ready", "");
}

/**
 * Fades and lifts its content into view once, when scrolled into the
 * viewport. Styles live in globals.css and are skipped for reduced motion.
 * All instances share a single IntersectionObserver.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: {
  as?: RevealElement;
  /** Stagger delay in milliseconds. */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const register = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    pending.add(element);
    if (!flushScheduled) {
      flushScheduled = true;
      queueMicrotask(flush);
    }
    return () => {
      pending.delete(element);
      observer?.unobserve(element);
    };
  }, []);

  return (
    <Tag
      ref={register}
      data-reveal=""
      className={className}
      style={
        delay
          ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
