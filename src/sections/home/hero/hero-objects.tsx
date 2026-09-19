import type { ReactNode } from "react";

import type {
  HeroObjectFinish,
  HeroObjectKind,
} from "@/data/hero-showcase";

/*
 * Equestrian hardware and leather details drawn in SVG: rings, bit rings,
 * buckles, studs, strap offcuts and horseshoes. Metal is built from stacked
 * strokes (dark body, lighter core, bright highlight) so each piece reads as
 * a rounded, polished form. All colours are mixed from the brand tokens.
 */

type MetalFinish = "steel" | "gold";

const METAL_STOPS: Record<MetalFinish, { dark: string; mid: string; light: string }> = {
  steel: {
    dark: "color-mix(in oklab, var(--color-ink) 80%, var(--color-ivory))",
    mid: "color-mix(in oklab, var(--color-ink) 42%, var(--color-ivory))",
    light: "color-mix(in oklab, var(--color-ivory) 85%, white)",
  },
  gold: {
    dark: "color-mix(in oklab, var(--color-gold-deep) 62%, var(--color-ink))",
    mid: "var(--color-gold)",
    light: "color-mix(in oklab, var(--color-gold-soft) 45%, var(--color-ivory))",
  },
};

const LEATHER_STOPS = {
  "black-leather": {
    dark: "color-mix(in oklab, var(--color-ink) 92%, var(--color-leather))",
    mid: "color-mix(in oklab, var(--color-ink-soft) 70%, var(--color-leather))",
    edge: "color-mix(in oklab, var(--color-ink-soft) 55%, var(--color-ivory) 18%)",
  },
  "tan-leather": {
    dark: "color-mix(in oklab, var(--color-leather) 75%, var(--color-ink))",
    mid: "color-mix(in oklab, var(--color-bronze) 70%, var(--color-leather))",
    edge: "color-mix(in oklab, var(--color-bronze) 55%, var(--color-gold-soft))",
  },
} as const;

const THREAD = "color-mix(in oklab, var(--color-gold-soft) 70%, var(--color-ivory))";

const stop = (offset: string, color: string, opacity?: number) => (
  <stop offset={offset} style={{ stopColor: color, stopOpacity: opacity }} />
);

/** Shared gradients, rendered once by the hero. */
export function HeroObjectGradients() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        {(Object.keys(METAL_STOPS) as MetalFinish[]).map((finish) => {
          const c = METAL_STOPS[finish];
          return (
            <g key={finish}>
              <linearGradient id={`hx-${finish}-body`} x1="0" y1="0" x2="1" y2="1">
                {stop("0%", c.mid)}
                {stop("30%", c.dark)}
                {stop("52%", c.light)}
                {stop("68%", c.dark)}
                {stop("100%", c.mid)}
              </linearGradient>
              <linearGradient id={`hx-${finish}-core`} x1="1" y1="0" x2="0" y2="1">
                {stop("0%", c.dark)}
                {stop("40%", c.mid)}
                {stop("58%", c.light)}
                {stop("80%", c.mid)}
                {stop("100%", c.dark)}
              </linearGradient>
              <linearGradient id={`hx-${finish}-shine`} x1="0" y1="0" x2="1" y2="1">
                {stop("0%", c.light, 0)}
                {stop("38%", c.light, 0.05)}
                {stop("50%", "white", 0.95)}
                {stop("62%", c.light, 0.05)}
                {stop("100%", c.light, 0)}
              </linearGradient>
              <radialGradient id={`hx-${finish}-dome`} cx="0.36" cy="0.32" r="0.75">
                {stop("0%", c.light)}
                {stop("35%", c.mid)}
                {stop("80%", c.dark)}
                {stop("100%", c.dark)}
              </radialGradient>
            </g>
          );
        })}
        {(Object.keys(LEATHER_STOPS) as (keyof typeof LEATHER_STOPS)[]).map((finish) => {
          const c = LEATHER_STOPS[finish];
          return (
            <linearGradient key={finish} id={`hx-${finish}`} x1="0" y1="0" x2="0.35" y2="1">
              {stop("0%", c.mid)}
              {stop("45%", c.dark)}
              {stop("70%", c.mid)}
              {stop("100%", c.dark)}
            </linearGradient>
          );
        })}
      </defs>
    </svg>
  );
}

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

/** A path drawn as a polished metal rod. */
function Rod({ d, finish, width }: { d: string; finish: MetalFinish; width: number }) {
  return (
    <>
      <path d={d} stroke={`url(#hx-${finish}-body)`} strokeWidth={width} />
      <path d={d} stroke={`url(#hx-${finish}-core)`} strokeWidth={width * 0.58} />
      <path d={d} stroke={`url(#hx-${finish}-shine)`} strokeWidth={width * 0.2} />
    </>
  );
}

const metal = (finish: HeroObjectFinish): MetalFinish =>
  finish === "gold" ? "gold" : "steel";

const leather = (finish: HeroObjectFinish): keyof typeof LEATHER_STOPS =>
  finish === "tan-leather" ? "tan-leather" : "black-leather";

const shapes: Record<HeroObjectKind, (finish: HeroObjectFinish) => ReactNode> = {
  ring: (finish) => <Rod d={circle(100, 100, 64)} finish={metal(finish)} width={26} />,
  "d-ring": (finish) => (
    <Rod d="M76 42H104a58 58 0 0 1 0 116H76Z" finish={metal(finish)} width={20} />
  ),
  snaffle: (finish) => (
    <>
      <Rod d={circle(46, 100, 34)} finish={metal(finish)} width={13} />
      <Rod d={circle(154, 100, 34)} finish={metal(finish)} width={13} />
      <Rod d="M79 96 99 105M101 105 121 96" finish={metal(finish)} width={15} />
      <Rod d={circle(100, 105, 6)} finish="gold" width={5} />
    </>
  ),
  buckle: (finish) => (
    <>
      <Rod
        d="M52 60H148a16 16 0 0 1 16 16V124a16 16 0 0 1-16 16H52a16 16 0 0 1-16-16V76a16 16 0 0 1 16-16Z"
        finish={metal(finish)}
        width={15}
      />
      <Rod d="M100 60V140" finish={metal(finish)} width={11} />
      <Rod d="M100 100H176" finish={metal(finish)} width={8} />
    </>
  ),
  stud: (finish) => (
    <>
      <Rod d={circle(100, 100, 44)} finish={metal(finish)} width={14} />
      <circle cx="100" cy="100" r="37" fill={`url(#hx-${metal(finish)}-dome)`} />
      <circle
        cx="100"
        cy="100"
        r="21"
        strokeOpacity="0.35"
        strokeWidth="2"
        style={{ stroke: "var(--color-ink)" }}
      />
      <ellipse cx="86" cy="84" rx="9" ry="5" fill="white" fillOpacity="0.55" transform="rotate(-35 86 84)" />
    </>
  ),
  strap: (finish) => {
    const tone = LEATHER_STOPS[leather(finish)];
    return (
      <>
        <path
          d="M18 120C62 94 120 86 180 66L188 100C128 118 70 128 28 156Z"
          fill={`url(#hx-${leather(finish)})`}
        />
        <path
          d="M20 121C64 95 121 87 181 67"
          strokeWidth="2"
          strokeOpacity="0.8"
          style={{ stroke: tone.edge }}
        />
        <path
          d="M32 128C70 106 122 98 176 80M36 146C74 124 126 114 182 96"
          strokeWidth="1.8"
          strokeDasharray="5 5"
          strokeOpacity="0.9"
          style={{ stroke: THREAD }}
        />
        {[
          [98, 106],
          [124, 99],
          [150, 91],
        ].map(([cx, cy]) => (
          <ellipse
            key={cx}
            cx={cx}
            cy={cy}
            rx="4.5"
            ry="3.5"
            fillOpacity="0.9"
            style={{ fill: "var(--color-ink)" }}
          />
        ))}
      </>
    );
  },
  horseshoe: (finish) => (
    <>
      <Rod
        d="M62 166C28 124 30 52 100 36C170 52 172 124 138 166"
        finish={metal(finish)}
        width={26}
      />
      {[
        [48, 128],
        [44, 96],
        [56, 66],
        [144, 66],
        [156, 96],
        [152, 128],
      ].map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="3"
          fillOpacity="0.75"
          style={{ fill: "var(--color-ink)" }}
        />
      ))}
    </>
  ),
};

export function HeroObjectShape({
  kind,
  finish,
}: {
  kind: HeroObjectKind;
  finish: HeroObjectFinish;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="block h-auto w-full overflow-visible"
    >
      {shapes[kind](finish)}
    </svg>
  );
}
