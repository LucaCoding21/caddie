import Image from "next/image";

/**
 * Tool callouts for the full-bleed anatomy photo.
 *
 * Coordinates are percentages of the image box (0–100), so they map directly
 * onto the photo regardless of rendered size. `node` is the dot on the part;
 * `points` is the SVG connector polyline (node → elbow → label edge); `label`
 * is where the text block sits and which edge the line meets:
 *   right  → text left-aligned, grows rightward from {x}
 *   left   → text right-aligned, ends at {x}
 * Tweak these against the rendered screenshot — see comment block below.
 */
type Side = "left" | "right";

type Callout = {
  n: string;
  title: string;
  desc: string;
  node: [number, number];
  points: string;
  label: { x: number; y: number; side: Side };
};

const CALLOUTS: Callout[] = [
  // Close — clean whitespace sits right beside these parts, so short leaders.
  {
    n: "01",
    title: "Magnetic Ball Markers",
    desc: "Two, seated in the body",
    node: [40, 36],
    points: "40,36 36,27",
    label: { x: 36, y: 26, side: "left" },
  },
  {
    n: "02",
    title: "T25 Torx Driver",
    desc: "Tunes adjustable clubs",
    node: [70, 33],
    points: "70,33 78,28",
    label: { x: 79, y: 27, side: "right" },
  },
  // Far — these parts sit over product/steel, so labels run out to the margins.
  {
    n: "03",
    title: "Divot Repair Fork",
    desc: "Fixes pitch marks",
    node: [67, 46],
    points: "67,46 80,40 86,40",
    label: { x: 86, y: 40, side: "right" },
  },
  {
    n: "04",
    title: "Knife",
    desc: "Full-tang, stainless",
    node: [63, 61],
    points: "63,61 80,58 86,58",
    label: { x: 86, y: 58, side: "right" },
  },
  {
    n: "05",
    title: "Bottle Opener",
    desc: "For the 19th hole",
    node: [54, 62],
    points: "54,62 30,54 15,54",
    label: { x: 15, y: 54, side: "left" },
  },
  {
    n: "06",
    title: "Brass Wire Brush",
    desc: "Cleans grooves",
    node: [37, 64],
    points: "37,64 24,78 15,78",
    label: { x: 15, y: 78, side: "left" },
  },
];

// Keeps every label a guaranteed gutter from the viewport edge: a right-side
// label's left edge sits at 85vw, so it can be at most (100 − 85)vw − gutter
// wide; left-side labels are the mirror. Text wraps before it ever bleeds.
const LABEL_MAX_WIDTH = "calc(15vw - 1.5rem)";

export default function Anatomy() {
  return (
    <section className="relative w-full bg-[#fafaf7] py-16 md:py-20">
      {/* Section eyebrow — technical/engineered framing */}
      <div className="mx-auto mb-10 flex max-w-7xl items-baseline justify-between px-6 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400 md:mb-14 md:px-12">
        <span>[ Anatomy ]</span>
        <span>Six tools · one body</span>
      </div>

      {/* Relative wrapper sized to the image — annotations are absolutely
          positioned in here, so percentage coords map onto the photo. */}
      <div className="relative w-full">
        <Image
          src="/recreate_this_exact_photo_and_202605251519.jpeg"
          alt="Caddie Companion folded fully open, every tool fanned out"
          width={2752}
          height={1536}
          className="h-auto w-full"
          sizes="100vw"
        />

        {/* Connector lines. viewBox 0–100 + preserveAspectRatio=none lets us
            author endpoints in % space; non-scaling-stroke keeps lines crisp.
            Hidden on small screens — see the mobile legend below. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden h-full w-full text-zinc-900/55 lg:block"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          {CALLOUTS.map((c) => (
            <polyline
              key={c.n}
              points={c.points}
              stroke="currentColor"
              strokeWidth={1}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* Nodes (square markers on each part) */}
        <div aria-hidden className="absolute inset-0 hidden lg:block">
          {CALLOUTS.map((c) => (
            <span
              key={c.n}
              className="absolute h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 bg-zinc-900 outline outline-2 outline-[#fafaf7]/80"
              style={{ left: `${c.node[0]}%`, top: `${c.node[1]}%` }}
            />
          ))}
        </div>

        {/* Labels */}
        <div className="absolute inset-0 hidden lg:block">
          {CALLOUTS.map((c) => {
            const right = c.label.side === "right";
            return (
              <div
                key={c.n}
                className={`absolute -translate-y-1/2 ${
                  right ? "text-left" : "-translate-x-full text-right"
                }`}
                style={{
                  left: `${c.label.x}%`,
                  top: `${c.label.y}%`,
                  maxWidth: LABEL_MAX_WIDTH,
                }}
              >
                <div className="font-mono text-[11px] font-medium uppercase leading-tight tracking-[0.12em] text-zinc-900 md:text-xs">
                  {c.title}
                </div>
                <div className="mt-1 font-mono text-[10px] leading-tight tracking-wide text-zinc-500 md:text-[11px]">
                  {c.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compact legend — the side overlay needs room, so below lg we list
          the tools instead. */}
      <ul className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 px-6 lg:hidden">
        {CALLOUTS.map((c) => (
          <li key={c.n} className="flex items-baseline gap-2">
            <span aria-hidden className="h-[5px] w-[5px] shrink-0 bg-zinc-400" />
            <span className="font-mono text-[11px] uppercase tracking-wide text-zinc-700">
              {c.title}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
