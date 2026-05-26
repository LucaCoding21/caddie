import Image from "next/image";

const BRUSH =
  "/6v1/ChatGPT%20Image%20May%2024%2C%202026%2C%2012_02_58%20AM.png";
const DIVOT = "/6v1/divot-tool.png";
const OPENER = "/6v1/bottle-opener.png";
const MARKER = "/6v1/ball-marker.png";
const KNIFE = "/6v1/pocket-knife.png";
const DRIVER = "/6v1/torx-driver.png";
const COMPANION =
  "/6v1/ChatGPT%20Image%20May%2023%2C%202026%2C%2011_30_27%20PM.png";

const TOOLS: { label: string; src: string }[] = [
  { label: "Divot Tool", src: DIVOT },
  { label: "Brush", src: BRUSH },
  { label: "Ball Marker", src: MARKER },
  { label: "T25 Torx Driver", src: DRIVER },
  { label: "Pocket Knife", src: KNIFE },
  { label: "Bottle Opener", src: OPENER },
];

export default function SixIntoOne() {
  return (
    <section className="w-full bg-[#fafaf7] px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        <h2
          className="font-brand font-medium text-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] leading-[1.05] tracking-tight max-w-4xl"
        >
          Everything that rattles around your bag.
          <br className="hidden sm:block" />
          <span className="text-zinc-400"> Folded into one.</span>
        </h2>

        {/* Composition — six (cool studio) → one (warm course) */}
        <div className="mt-20 md:mt-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left — the six. Uniform tiles, contain so no product gets cropped. */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-3 gap-x-3 gap-y-5 md:gap-x-4 md:gap-y-6">
              {TOOLS.map(({ label, src }) => (
                <figure key={label} className="group">
                  {/* bg matches the photos' studio gray so each product floats
                      on one uniform field — tweak hex if a seam shows */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-[#efeeea] ring-1 ring-black/5">
                    <Image
                      src={src}
                      alt={label}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 30vw, 16vw"
                    />
                  </div>
                  <figcaption className="font-brand mt-2.5 text-[11px] md:text-xs text-zinc-500 tracking-wide">
                    {label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Connector — arrow, vertically centered */}
          <div
            aria-hidden
            className="font-brand lg:col-span-1 lg:self-center flex items-center justify-center text-zinc-400 text-2xl md:text-3xl rotate-90 lg:rotate-0"
          >
            →
          </div>

          {/* Right — the one. Larger, warm, the resolution. */}
          <figure className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#efeeea]">
              <Image
                src={COMPANION}
                alt="Caddie Companion in hand on the course"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <figcaption className="font-brand mt-5 text-xl md:text-2xl font-medium text-black tracking-tight">
              Caddie Companion
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
