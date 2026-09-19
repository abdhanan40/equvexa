"use client";

import Image from "next/image";
import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { iconButtonClasses } from "@/components/ui/control";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

import type { HeroItem } from "./hero-experience";
import styles from "./hero.module.css";

/** How many cards are visible at once. */
const VISIBLE = 2;

/** Horizontal travel, in pixels, that counts as a swipe on touch screens. */
const SWIPE = 40;

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Featured-product cards: a circular carousel showing two cards at a time,
 * the active product first. The track holds the list twice, so the window
 * can always slide one card forwards or back: before a move that would run
 * past either end, it jumps, unseen, to the same cards in the other copy.
 * Only the visible cards can be focused. Selecting a card switches the
 * product at the centre of the hero.
 */
export function HeroCarousel({
  items,
  active,
  onSelect,
}: {
  items: readonly HeroItem[];
  active: number;
  onSelect: (index: number) => void;
}) {
  const count = items.length;
  const trackRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipeStart = useRef<number | null>(null);
  const focusFirst = useRef(false);

  // Index of the first visible card on the doubled track, and where the
  // slide to it starts when it begins with an unseen jump.
  const [position, setPosition] = useState(active);
  const [jumpFrom, setJumpFrom] = useState<number | null>(null);

  // Follow the active product (adjusting state during render, as React
  // recommends), keeping the window within the first copy and one card.
  const [trackedActive, setTrackedActive] = useState(active);
  if (trackedActive !== active) {
    setTrackedActive(active);
    let delta = (active - trackedActive + count) % count;
    if (delta > count / 2) delta -= count;
    let from = position;
    if (from + delta < 0) from += count;
    else if (from + delta > count) from -= count;
    setJumpFrom(from !== position ? from : null);
    setPosition(from + delta);
  }

  useLayoutEffect(() => {
    const track = trackRef.current;
    // Apply the jump without a transition and commit it with a forced
    // layout, so the slide to the new position starts from it.
    if (track && jumpFrom !== null) {
      track.style.transition = "none";
      track.style.setProperty("--start", String(jumpFrom));
      track.getBoundingClientRect();
      track.style.transition = "";
      track.style.setProperty("--start", String(position));
    }
    // After a keyboard move, keep focus on the active card, which is first.
    if (focusFirst.current) {
      focusFirst.current = false;
      cardRefs.current[position]?.focus({ preventScroll: true });
    }
  }, [jumpFrom, position]);

  const step = (delta: number) => onSelect((active + delta + count) % count);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const onCard = (event.target as HTMLElement).closest("li") !== null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusFirst.current = onCard;
      step(1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusFirst.current = onCard;
      step(-1);
    }
  };

  // Touch swipe on the cards.
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") swipeStart.current = event.clientX;
  };
  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (start === null) return;
    const distance = event.clientX - start;
    if (Math.abs(distance) >= SWIPE) step(distance < 0 ? 1 : -1);
  };

  const track = [...items, ...items];

  return (
    <div
      role="group"
      aria-label="Featured products"
      onKeyDown={handleKeyDown}
      className={styles.carousel}
    >
      <div
        className={styles.cardsWindow}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          swipeStart.current = null;
        }}
      >
        <ul
          ref={trackRef}
          className={styles.cardsTrack}
          style={{ "--start": position } as CSSProperties}
        >
          {track.map((item, slot) => {
            const index = slot % count;
            const selected = index === active;
            const visible = slot >= position && slot < position + VISIBLE;
            return (
              <li key={`${item.slug}-${slot < count ? "a" : "b"}`} inert={!visible}>
                <button
                  ref={(element) => {
                    cardRefs.current[slot] = element;
                  }}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(index)}
                  className={cn(styles.card, selected && styles.cardActive)}
                >
                  <span className={styles.cardImage}>
                    {/* Sized for the card, so the thumbnail and the large
                        hero image request different files. */}
                    <Image
                      src={item.cutout.src}
                      alt=""
                      width={140}
                      height={Math.round(
                        (140 * item.cutout.height) / item.cutout.width,
                      )}
                      className="h-full w-full object-contain"
                      style={
                        item.card
                          ? { rotate: `${item.card.rotate}deg`, scale: item.card.scale }
                          : undefined
                      }
                    />
                  </span>
                  <span className={styles.cardName}>{item.name}</span>
                  <span className={styles.cardMeta}>Wholesale &amp; OEM</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.carouselNav}>
        <p aria-hidden="true" className={styles.counter}>
          <span className={styles.counterCurrent}>{pad(active + 1)}</span>
          {" / "}
          {pad(count)}
        </p>
        <button
          type="button"
          onClick={() => step(-1)}
          className={iconButtonClasses()}
        >
          <ArrowLeftIcon className="size-4" />
          <span className="sr-only">Previous product</span>
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          className={iconButtonClasses()}
        >
          <ArrowRightIcon className="size-4" />
          <span className="sr-only">Next product</span>
        </button>
      </div>
    </div>
  );
}
