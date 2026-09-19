import type { HeroTransition } from "@/data/hero-showcase";

/** Cubic-bezier equivalents of the reference choreography's easings. */
export const EASE_IN = "cubic-bezier(0.55, 0.055, 0.675, 0.19)";
export const EASE_SETTLE = "cubic-bezier(0.22, 1.16, 0.42, 1)";
export const EASE_SPRING = "cubic-bezier(0.18, 1.35, 0.36, 1)";

export type SwitchMode = HeroTransition | "touch" | "reduced";

type Phase = { keyframes: Keyframe[]; duration: number; easing: string };

const perspective = "perspective(1400px)";

/**
 * Product switch: the current product turns away under motion blur, the
 * new one arrives with depth. Only transform, opacity and filter animate.
 * The resting tilt is a separate `rotate` property, so it is preserved.
 */
const choreography: Record<SwitchMode, { exit: Phase; enter: Phase }> = {
  // Polished metal turns on its vertical axis, catching the light.
  "metal-turn": {
    exit: {
      keyframes: [
        { transform: `${perspective} rotateY(0deg) scale(1)`, filter: "blur(0px)", opacity: 1 },
        { transform: `${perspective} rotateY(58deg) scale(0.94)`, filter: "blur(5px)", opacity: 1, offset: 0.7 },
        { transform: `${perspective} rotateY(84deg) scale(0.9)`, filter: "blur(10px)", opacity: 0 },
      ],
      duration: 600,
      easing: EASE_IN,
    },
    enter: {
      keyframes: [
        { transform: `${perspective} rotateY(-84deg) scale(0.9)`, filter: "blur(10px)", opacity: 0 },
        { opacity: 1, offset: 0.12 },
        { transform: `${perspective} rotateY(-40deg) scale(0.96)`, filter: "blur(5px)", offset: 0.3 },
        { transform: `${perspective} rotateY(0deg) scale(1)`, filter: "blur(0px)", opacity: 1 },
      ],
      duration: 1400,
      easing: EASE_SETTLE,
    },
  },
  // Gloves settle at an angle, like a pair laid down and turned over.
  "layered-turn": {
    exit: {
      keyframes: [
        { transform: `${perspective} translate3d(0, 0, 0) rotate(0deg) rotateX(0deg) scale(1)`, filter: "blur(0px)", opacity: 1 },
        { opacity: 1, offset: 0.55 },
        { transform: `${perspective} translate3d(0, 34px, 0) rotate(16deg) rotateX(38deg) scale(0.9)`, filter: "blur(9px)", opacity: 0 },
      ],
      duration: 560,
      easing: EASE_IN,
    },
    enter: {
      keyframes: [
        { transform: `${perspective} translate3d(0, -40px, 0) rotate(-14deg) rotateX(-42deg) scale(1.06)`, filter: "blur(9px)", opacity: 0 },
        { opacity: 1, offset: 0.12 },
        { transform: `${perspective} translate3d(0, -8px, 0) rotate(-3deg) rotateX(-8deg) scale(1.01)`, filter: "blur(2px)", offset: 0.45 },
        { transform: `${perspective} translate3d(0, 0, 0) rotate(0deg) rotateX(0deg) scale(1)`, filter: "blur(0px)", opacity: 1 },
      ],
      duration: 1300,
      easing: EASE_SETTLE,
    },
  },
  // Tall leather sweeps vertically into place.
  "vertical-rise": {
    exit: {
      keyframes: [
        { transform: `${perspective} translate3d(0, 0, 0) rotateX(0deg) scale(1)`, filter: "blur(0px)", opacity: 1 },
        { opacity: 1, offset: 0.55 },
        { transform: `${perspective} translate3d(0, -70px, 0) rotateX(-22deg) scale(0.95)`, filter: "blur(9px)", opacity: 0 },
      ],
      duration: 560,
      easing: EASE_IN,
    },
    enter: {
      keyframes: [
        { transform: `${perspective} translate3d(0, 90px, 0) rotateX(24deg) scale(0.95)`, filter: "blur(9px)", opacity: 0 },
        { opacity: 1, offset: 0.12 },
        { transform: `${perspective} translate3d(0, 10px, 0) rotateX(4deg) scale(1)`, filter: "blur(2px)", offset: 0.45 },
        { transform: `${perspective} translate3d(0, 0, 0) rotateX(0deg) scale(1)`, filter: "blur(0px)", opacity: 1 },
      ],
      duration: 1400,
      easing: EASE_SETTLE,
    },
  },
  // Touch screens: a short, light crossfade.
  touch: {
    exit: {
      keyframes: [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(0.96)", opacity: 0 },
      ],
      duration: 260,
      easing: EASE_IN,
    },
    enter: {
      keyframes: [
        { transform: "scale(1.03)", opacity: 0 },
        { opacity: 1, offset: 0.35 },
        { transform: "scale(1)", opacity: 1 },
      ],
      duration: 560,
      easing: EASE_SETTLE,
    },
  },
  // Reduced motion: opacity only.
  reduced: {
    exit: { keyframes: [{ opacity: 1 }, { opacity: 0 }], duration: 150, easing: "linear" },
    enter: { keyframes: [{ opacity: 0 }, { opacity: 1 }], duration: 250, easing: "linear" },
  },
};

export const productExit = (mode: SwitchMode) => choreography[mode].exit;
export const productEnter = (mode: SwitchMode) => choreography[mode].enter;

/** Floating objects gather at the product, then re-form in the new layout. */
export const OBJECT_GATHER_MS = 500;
export const OBJECT_HOLD_MS = 250;
export const OBJECT_SCATTER_MS = 900;

export const gatherKeyframes = (dx: number, dy: number): Keyframe[] => [
  { transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)", opacity: 1 },
  { transform: `translate3d(${dx}px, ${dy}px, 0) rotate(45deg) scale(0.1)`, opacity: 0 },
];

export const scatterKeyframes = (dx: number, dy: number): Keyframe[] => [
  { transform: `translate3d(${dx}px, ${dy}px, 0) rotate(-45deg) scale(0.1)`, opacity: 0 },
  { transform: "translate3d(0, 0, 0) rotate(0deg) scale(1)", opacity: 1 },
];
