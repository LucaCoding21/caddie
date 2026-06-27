import { getImageProps } from "next/image";
import HeroCopy from "@/components/hero-copy";

// Tiny (16px) blurred previews, inlined so they paint instantly while the full
// hero downloads — no blank black frame on first load. Generated from the
// source images with sharp.
const MOBILE_BLUR =
  "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAACwAwCdASoQABwAPu1iqU2ppaOiMAgBMB2JYgC7ACHfhmljLxm0AAD+2M6u0jXOQ3/h3Cq1gwjyhOvmy/BskGQfcrQ8a19kSr45UbfsbipSkoFgW6Ng8sQA";
const DESKTOP_BLUR =
  "data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoQAAkAA4BaJZgCdAEPAg/zAAD+6+GQhfXBU7t9dXsUzBpjw7c2RD5YAAA=";

export default function Hero() {
  // Art-direction pattern (Next.js docs): build the optimized srcSets with
  // getImageProps and hand them to a <picture> with orientation media queries.
  // The browser's preload scanner fetches ONLY the matching orientation, and —
  // unlike next/image's two-<Image> CSS toggle, which is forced to lazy-load to
  // avoid loading both — this one loads eagerly at high priority straight from
  // the initial HTML. That removes the "LCP image was lazily loaded" penalty
  // without ever downloading the off-orientation crop. Quality is unchanged:
  // still Next-optimized AVIF/WebP at the default quality, same source images.
  const common = { sizes: "100vw" };

  const {
    props: { srcSet: portraitSrcSet },
  } = getImageProps({
    ...common,
    src: "/caddie-companion-golf-multi-tool-mobile-hero.webp",
    alt: "",
    width: 941,
    height: 1672,
  });

  const {
    props: { srcSet: landscapeSrcSet, ...imgProps },
  } = getImageProps({
    ...common,
    src: "/caddie-companion-golf-divot-tool-hero.webp",
    alt: "Black Caddie Companion golf multi-tool open on the grass, showing its divot fork, knife, and groove brush",
    width: 1672,
    height: 941,
  });

  return (
    <section className="sticky top-0 h-svh w-full overflow-hidden bg-black">
      {/* Blurred placeholders — one per orientation, so the right preview paints
          instantly behind the hero while it downloads. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center landscape:hidden"
        style={{ backgroundImage: `url(${MOBILE_BLUR})` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-cover bg-center landscape:block"
        style={{ backgroundImage: `url(${DESKTOP_BLUR})` }}
      />

      {/* LCP hero — selected by viewport orientation, not width: any portrait
          viewport (phone or tablet held tall) gets the dedicated portrait crop,
          since the wide shot zooms in and crops the tool. Landscape viewports
          (tablet landscape, laptops, desktops) get the wide shot. */}
      <picture>
        <source
          media="(orientation: landscape)"
          srcSet={landscapeSrcSet}
          sizes="100vw"
        />
        <source
          media="(orientation: portrait)"
          srcSet={portraitSrcSet}
          sizes="100vw"
        />
        <img
          {...imgProps}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center landscape:object-[20%_center]"
        />
      </picture>

      {/* Subtle top gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-black/60 via-black/10 to-transparent"
      />

      {/* Subtle bottom gradient for text legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
      />

      <HeroCopy />
    </section>
  );
}
