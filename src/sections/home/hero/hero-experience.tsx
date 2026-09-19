"use client";

import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

import {
  HERO_OBJECT_SLOTS,
  type HeroCutout,
  type HeroObjectPlacement,
  type HeroTone,
  type HeroTransition,
} from "@/data/hero-showcase";
import {
  useFinePointer,
  usePrefersReducedMotion,
} from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

import { HeroCarousel } from "./hero-carousel";
import { HeroObjectGradients, HeroObjectShape } from "./hero-objects";
import {
  EASE_IN,
  EASE_SPRING,
  OBJECT_GATHER_MS,
  OBJECT_HOLD_MS,
  OBJECT_SCATTER_MS,
  gatherKeyframes,
  productEnter,
  productExit,
  scatterKeyframes,
  type SwitchMode,
} from "./hero-transitions";
import styles from "./hero.module.css";

export type HeroItem = {
  slug: string;
  name: string;
  href: string;
  cutout: HeroCutout;
  transition: HeroTransition;
  tone: HeroTone;
  tilt: number;
  scale?: number;
  offset?: readonly [number, number];
  card?: { rotate: number; scale: number };
  objects: readonly HeroObjectPlacement[];
};

/** The shown product and its neighbours, whose large images are loaded. */
function withNeighbours(set: ReadonlySet<number>, index: number, count: number) {
  const next = new Set(set);
  next.add(index);
  next.add((index + 1) % count);
  next.add((index - 1 + count) % count);
  return next;
}

const TONES: readonly HeroTone[] = ["steel", "leather", "bronze"];

/** Fixed positions keep server and client markup identical. */
const DUST = [
  { x: 14, y: 82, size: 2, duration: 19, delay: 0, drift: 18 },
  { x: 27, y: 64, size: 3, duration: 23, delay: 5.5, drift: -12 },
  { x: 38, y: 92, size: 2, duration: 17, delay: 2.5, drift: 14 },
  { x: 55, y: 74, size: 2, duration: 21, delay: 9, drift: -16 },
  { x: 63, y: 88, size: 3, duration: 25, delay: 3.5, drift: 10 },
  { x: 72, y: 70, size: 2, duration: 18, delay: 12, drift: -10 },
  { x: 84, y: 86, size: 2, duration: 22, delay: 7, drift: 12 },
  { x: 92, y: 66, size: 3, duration: 20, delay: 14, drift: -14 },
  { x: 46, y: 58, size: 2, duration: 24, delay: 16, drift: 8 },
  { x: 8, y: 60, size: 2, duration: 26, delay: 10, drift: 16 },
] as const;

/**
 * Pointer response. Layer values are pixel offsets at the viewport edge
 * (pointer range is -0.5 to 0.5): background layers move against the
 * pointer, the product and foreground details move with it.
 */
const MOTION = {
  smoothing: 0.06,
  productShift: [26, 18],
  productTilt: [18, 12],
  far: -22,
  back: -44,
  front: 84,
  sheen: 60,
  repelRadius: 240,
  repelStrength: 38,
} as const;

export function HeroExperience({
  items,
  intro,
  copy,
  badge,
}: {
  items: readonly HeroItem[];
  /** Eyebrow and headline, rendered on the server. */
  intro: ReactNode;
  /** Supporting copy and the primary action. */
  copy: ReactNode;
  /** Lower-left business link. */
  badge: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const count = items.length;

  // Large product images load on demand: the one in view and its neighbours,
  // so whichever product the arrows bring in next is already there.
  const [primed, setPrimed] = useState(() => withNeighbours(new Set(), 0, count));
  if (
    !primed.has(active) ||
    !primed.has((active + 1) % count) ||
    !primed.has((active - 1 + count) % count)
  ) {
    setPrimed(withNeighbours(primed, active, count));
  }

  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sheenRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const objectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const motionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visibleRef = useRef(0);
  const lockedRef = useRef(false);
  const geometryDirty = useRef(true);

  // Object layouts change with the product; cached positions must refresh.
  useLayoutEffect(() => {
    geometryDirty.current = true;
  }, [shown]);

  // Pointer parallax, product tilt and foreground repulsion. Transforms are
  // written straight to the DOM inside requestAnimationFrame, so React never
  // re-renders per frame. Object centres come from cached geometry that is
  // refreshed only on resize, scroll or a product change.
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const layers = [farRef.current, backRef.current, frontRef.current];
    const tilt = tiltRef.current;
    if (!section || !stage || !tilt || layers.some((layer) => !layer)) return;
    if (!finePointer || reducedMotion) return;

    // Stable arrays filled by ref callbacks; the rendered nodes persist.
    const objectElements = objectRefs.current;
    const sheenElements = sheenRefs.current;
    const frontSlots = HERO_OBJECT_SLOTS.flatMap((slot, index) =>
      slot.layer === "front" ? [index] : [],
    );
    const push = HERO_OBJECT_SLOTS.map(() => ({ x: 0, y: 0 }));
    const bases = HERO_OBJECT_SLOTS.map(() => ({ x: 0, y: 0 }));
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let previousTime = 0;
    let inView = true;

    // Layout positions, free of any transform: an object's offset inside its
    // layer is its centre, because `translate: -50% -50%` is not an offset.
    const measure = () => {
      const rect = stage.getBoundingClientRect();
      HERO_OBJECT_SLOTS.forEach((_, index) => {
        const element = objectElements[index];
        if (!element) return;
        bases[index] = {
          x: rect.left + window.scrollX + element.offsetLeft,
          y: rect.top + window.scrollY + element.offsetTop,
        };
      });
      geometryDirty.current = false;
    };

    const render = (time: number) => {
      if (geometryDirty.current) measure();
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16.7;
      previousTime = time;
      const ease = 1 - Math.pow(1 - MOTION.smoothing, elapsed / 16.7);

      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      const { x, y } = current;
      let moving =
        Math.abs(target.x - x) > 0.0005 || Math.abs(target.y - y) > 0.0005;

      tilt.style.transform = `translate3d(${x * MOTION.productShift[0]}px, ${y * MOTION.productShift[1]}px, 0) perspective(1400px) rotateX(${-y * MOTION.productTilt[1]}deg) rotateY(${x * MOTION.productTilt[0]}deg)`;
      for (const sheen of sheenElements) {
        if (sheen) sheen.style.transform = `translate3d(${-x * MOTION.sheen}%, 0, 0)`;
      }
      const offsets = [MOTION.far, MOTION.back, MOTION.front];
      layers.forEach((layer, index) => {
        layer!.style.transform = `translate3d(${x * offsets[index]}px, ${y * offsets[index]}px, 0)`;
      });

      if (!lockedRef.current) {
        for (const index of frontSlots) {
          const element = objectElements[index];
          if (!element) continue;
          let targetX = 0;
          let targetY = 0;
          if (pointer) {
            const dx = bases[index].x + x * MOTION.front + push[index].x - pointer.x;
            const dy = bases[index].y + y * MOTION.front + push[index].y - pointer.y;
            const distance = Math.hypot(dx, dy);
            if (distance > 0 && distance < MOTION.repelRadius) {
              const force = (1 - distance / MOTION.repelRadius) ** 2;
              targetX = (dx / distance) * force * MOTION.repelStrength;
              targetY = (dy / distance) * force * MOTION.repelStrength;
            }
          }
          const p = push[index];
          p.x += (targetX - p.x) * Math.min(1, ease * 1.6);
          p.y += (targetY - p.y) * Math.min(1, ease * 1.6);
          if (Math.abs(targetX - p.x) > 0.05 || Math.abs(targetY - p.y) > 0.05) moving = true;
          element.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.x * 0.25}deg)`;
        }
      }

      if (moving && inView) {
        frame = requestAnimationFrame(render);
      } else {
        frame = 0;
        previousTime = 0;
      }
    };

    const start = () => {
      if (!frame && inView) frame = requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      target.x = event.clientX / window.innerWidth - 0.5;
      target.y = event.clientY / window.innerHeight - 0.5;
      pointer = { x: event.pageX, y: event.pageY };
      start();
    };

    const handlePointerLeave = () => {
      target.x = 0;
      target.y = 0;
      pointer = null;
      start();
    };

    const invalidate = () => {
      geometryDirty.current = true;
    };

    const resizeObserver = new ResizeObserver(invalidate);
    resizeObserver.observe(stage);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
    });
    intersectionObserver.observe(section);

    section.addEventListener("pointermove", handlePointerMove, { passive: true });
    section.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", invalidate);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", invalidate);
      tilt.style.transform = "";
      for (const element of [...layers, ...objectElements, ...sheenElements]) {
        if (element) element.style.transform = "";
      }
    };
  }, [finePointer, reducedMotion]);

  // Gather, turn, re-form. Interaction is locked until the choreography ends.
  const select = async (next: number) => {
    const previous = visibleRef.current;
    if (lockedRef.current || next === previous) return;

    const exitElement = itemRefs.current[previous];
    const enterElement = itemRefs.current[next];
    const stage = stageRef.current;
    if (!exitElement || !enterElement || !stage) return;

    lockedRef.current = true;
    setActive(next);

    // Each product leaves and arrives with its own motion.
    const modeFor = (index: number): SwitchMode =>
      reducedMotion ? "reduced" : finePointer ? items[index].transition : "touch";
    const animateObjects = !reducedMotion;

    // Offsets from each visible object to the product at the stage centre.
    const offsetsToCentre = () => {
      const rect = stage.getBoundingClientRect();
      const centreX = rect.left + rect.width / 2;
      const centreY = rect.top + rect.height / 2;
      return objectRefs.current.map((element) => {
        if (!element || element.offsetParent === null) return null;
        const box = element.getBoundingClientRect();
        return {
          dx: centreX - (box.left + box.width / 2),
          dy: centreY - (box.top + box.height / 2),
        };
      });
    };

    try {
      if (animateObjects) {
        offsetsToCentre().forEach((offset, index) => {
          const motion = motionRefs.current[index];
          if (!offset || !motion) return;
          motion.animate(gatherKeyframes(offset.dx, offset.dy), {
            duration: OBJECT_GATHER_MS,
            easing: EASE_IN,
            fill: "forwards",
          });
        });
      }

      const exit = productExit(modeFor(previous));
      const leaving = exitElement.animate(exit.keyframes, {
        duration: exit.duration,
        easing: exit.easing,
        fill: "forwards",
      });
      await leaving.finished;

      // Hand over in one go: the arriving product is put in its entry pose
      // before it is shown, so its resting state never flashes.
      const enter = productEnter(modeFor(next));
      const arriving = enterElement.animate(enter.keyframes, {
        duration: enter.duration,
        easing: enter.easing,
        fill: "backwards",
      });
      exitElement.dataset.state = "hidden";
      enterElement.dataset.state = "active";
      leaving.cancel();

      // Swap the product and object layout in one synchronous render once the
      // entry is running, so that render cannot delay its first frames. The
      // objects are still gathered out of sight while it happens.
      await arriving.ready;
      flushSync(() => setShown(next));
      geometryDirty.current = true;

      const scatter: Promise<unknown>[] = [];
      if (animateObjects) {
        offsetsToCentre().forEach((offset, index) => {
          const motion = motionRefs.current[index];
          if (!motion) return;
          for (const animation of motion.getAnimations()) animation.cancel();
          if (!offset) return;
          const objectElement = objectRefs.current[index];
          if (objectElement) objectElement.style.transform = "";
          scatter.push(
            motion.animate(scatterKeyframes(offset.dx, offset.dy), {
              duration: OBJECT_SCATTER_MS,
              delay: OBJECT_HOLD_MS + index * 22,
              easing: EASE_SPRING,
              fill: "backwards",
            }).finished,
          );
        });
      }

      await Promise.all([arriving.finished, ...scatter]);
    } catch {
      // An animation was cancelled, for example when the hero unmounts.
    } finally {
      visibleRef.current = next;
      lockedRef.current = false;
    }
  };

  const activeItem = items[active];
  const shownItem = items[shown];

  const renderObjects = (layer: "far" | "back" | "front") =>
    HERO_OBJECT_SLOTS.map((slot, index) => {
      if (slot.layer !== layer) return null;
      const placement = shownItem.objects[index];
      const style = {
        "--x": `${placement.x}%`,
        "--y": `${placement.y}%`,
        "--mobile-x": slot.mobile ? `${slot.mobile.x}%` : undefined,
        "--mobile-y": slot.mobile ? `${slot.mobile.y}%` : undefined,
        "--size": `${slot.size}%`,
        "--opacity": slot.opacity,
        "--blur": `${slot.blur}px`,
        "--rotate": `${placement.rotate}deg`,
        "--float": `${slot.float}s`,
        "--order": index,
      } as CSSProperties;

      return (
        <div
          key={index}
          ref={(element) => {
            objectRefs.current[index] = element;
          }}
          className={styles.object}
          data-mobile={slot.mobile ? "" : undefined}
          style={style}
        >
          <div
            ref={(element) => {
              motionRefs.current[index] = element;
            }}
            className={styles.objectMotion}
          >
            <div className={styles.objectFloat}>
              <div className={styles.objectBody}>
                <HeroObjectShape kind={placement.kind} finish={placement.finish} />
              </div>
            </div>
          </div>
        </div>
      );
    });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className={cn(styles.hero, "surface-dark grain")}
    >
      <HeroObjectGradients />

      {/* Layer 0: spotlight, tinted for the active product's material. */}
      <div aria-hidden="true" className={styles.backdrop}>
        {TONES.map((tone) => (
          <div
            key={tone}
            className={styles.tone}
            data-tone={tone}
            data-active={activeItem.tone === tone ? "" : undefined}
          />
        ))}
        <div className={styles.halo} />
        <div className={styles.vignette} />
      </div>

      {/* Layer 1: dust in the light. */}
      <div aria-hidden="true" className={styles.dust}>
        {DUST.map((mote) => (
          <span
            key={`${mote.x}-${mote.y}`}
            className={styles.mote}
            style={
              {
                "--mote-x": `${mote.x}%`,
                "--mote-y": `${mote.y}%`,
                "--mote-size": `${mote.size}px`,
                "--mote-duration": `${mote.duration}s`,
                "--mote-delay": `${mote.delay}s`,
                "--mote-drift": `${mote.drift}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className={styles.frame}>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.intro}>{intro}</div>
            <div className={styles.copy}>{copy}</div>
            <div className={styles.badge}>{badge}</div>
          </div>

          <div ref={stageRef} className={styles.stage}>
            {/* Layers 1–2: far and background details, behind the product. */}
            <div ref={farRef} aria-hidden="true" className={cn(styles.layer, styles.layerFar)}>
              {renderObjects("far")}
            </div>
            <div ref={backRef} aria-hidden="true" className={cn(styles.layer, styles.layerBack)}>
              {renderObjects("back")}
            </div>

            {/* Layer 3: the product. */}
            <div className={styles.productSpace}>
              <div className={styles.productEntry}>
                <div aria-hidden="true" className={styles.groundShadow} />
                <div className={styles.productFloat}>
                  <div ref={tiltRef} className={styles.productTilt}>
                    {items.map((item, index) => (
                      <div
                        key={item.slug}
                        ref={(element) => {
                          itemRefs.current[index] = element;
                        }}
                        data-state={index === shown ? "active" : "hidden"}
                        className={styles.productItem}
                        style={
                          {
                            "--tilt": `${item.tilt}deg`,
                            "--product-scale": item.scale,
                            "--offset-x": item.offset ? `${item.offset[0]}%` : undefined,
                            "--offset-y": item.offset ? `${item.offset[1]}%` : undefined,
                          } as CSSProperties
                        }
                      >
                        {primed.has(index) ? (
                          <>
                            <Image
                              src={item.cutout.src}
                              alt={item.cutout.alt}
                              fill
                              sizes="(min-width: 1024px) 46vw, 88vw"
                              loading={index === 0 ? "eager" : "lazy"}
                              fetchPriority={index === 0 ? "high" : "auto"}
                              className={styles.productImage}
                            />
                            <span
                              aria-hidden="true"
                              className={styles.sheen}
                              style={{ "--mask": `url(${item.cutout.mask})` } as CSSProperties}
                            >
                              <span
                                ref={(element) => {
                                  sheenRefs.current[index] = element;
                                }}
                                className={styles.sheenBand}
                              />
                            </span>
                          </>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Layer 5: foreground details, in front of product and text. */}
            <div ref={frontRef} aria-hidden="true" className={cn(styles.layer, styles.layerFront)}>
              {renderObjects("front")}
            </div>
          </div>

          <div className={styles.right}>
            <HeroCarousel items={items} active={active} onSelect={select} />
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {`Showing ${activeItem.name}, ${active + 1} of ${items.length}`}
      </p>
    </section>
  );
}
