"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// The four finishes, listed back-to-front (first painted = furthest back, last
// painted = in front): red at the back, black on top. Left-to-right the deck
// still reads black, blue, green, red because each card's `x` fixes its
// horizontal slot. The tools stand nearly upright (90° = fully vertical,
// carabiner head up) with only a slight symmetric tilt, and `x` staggers them
// sideways so they overlap like a tight, near-parallel deck.
const CARDS = [
  { src: "/fan-red.png", alt: "Caddie Companion in red", angle: 99, x: 62 },
  { src: "/fan-green.png", alt: "Caddie Companion in green", angle: 93, x: 21 },
  { src: "/fan-blue.png", alt: "Caddie Companion in blue", angle: 87, x: -21 },
  { src: "/fan-black.png", alt: "Caddie Companion in black", angle: 81, x: -62 },
];

// Shared pivot at the tool's working end (the right end of the source image,
// which becomes the bottom once the tool is stood upright) so the slight tilt
// pivots about the bases while `x` does the sideways staggering.
const PIVOT = "100% 50%";

/**
 * The fanned colour lineup, built from four transparent cut-outs and animated
 * open with GSAP. The deck sits in the top-right of the CTA panel, heads up and
 * sunk so its lower half is cropped at the panel's bottom line while the splayed
 * heads overflow past the top edge. On scroll the cards swing up from a closed,
 * stacked deck out to their resting fan, dealt back-to-front with a stagger.
 */
export default function CaddieFan() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef);
      const cards = q<HTMLElement>(".fan-card");

      // Resting (fanned) state — set first so reduced-motion users still see the
      // final fan, not a collapsed stack.
      cards.forEach((el, i) =>
        gsap.set(el, {
          rotation: CARDS[i].angle,
          x: CARDS[i].x,
          transformOrigin: PIVOT,
          force3D: false,
        })
      );

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Fan open: from a closed, stacked deck (all rotation 0, lying flat) out
      // to each card's resting angle, dealt back-to-front with a stagger. `x`
      // holds its staggered offset throughout, so only the swing-up animates.
      // Fan open: from a closed, stacked deck (all rotation 0, lying flat) out
      // to each card's resting angle, dealt back-to-front with a stagger. `x`
      // holds its staggered offset throughout, so only the swing-up animates.
      // force3D:false keeps the transform 2D so the clip box still crops the
      // cards mid-animation (a 3D-promoted layer escapes overflow clipping).
      // Fan open: from a closed, stacked deck (all rotation 0, lying flat) out
      // to each card's resting angle, dealt back-to-front with a stagger. `x`
      // holds its staggered offset throughout, so only the swing-up animates.
      // force3D:false keeps the transform 2D so the clip box still crops the
      // cards mid-animation (a 3D-promoted layer escapes overflow clipping).
      // Fan open: from a closed, stacked deck (all rotation 0, lying flat) out
      // to each card's resting angle, dealt back-to-front with a stagger. `x`
      // holds its staggered offset throughout, so only the swing-up animates.
      // force3D:false keeps the transform 2D so the clip box still crops the
      // cards mid-animation (a 3D-promoted layer escapes overflow clipping).
      // Fan open: from a closed, stacked deck (all rotation 0, lying flat) out
      // to each card's resting angle, dealt back-to-front with a stagger. `x`
      // holds its staggered offset throughout, so only the swing-up animates.
      // force3D:false keeps the transform 2D so the clip box still crops the
      // cards mid-animation (a 3D-promoted layer escapes overflow clipping).
      gsap.from(cards, {
        rotation: 0,
        transformOrigin: PIVOT,
        force3D: false,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: rootRef.current, start: "top 80%", once: true },
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0">
      {/* Clip box — top lifted and the left edge pulled well off-panel so the
          heads spill up and the left of the deck isn't cropped; only the bottom
          edge sits on the panel's bottom line, cropping the lower half of the
          submerged deck away. */}
      <div className="absolute left-[-100%] right-0 -top-[300%] bottom-0 overflow-hidden [clip-path:inset(0)]">
        {/* Deck anchored to the panel's bottom line and sunk below it so its
            lower half is hidden while the heads overflow the top. Width drives
            the tool length (the source image is horizontal, so its width becomes
            the standing tool's height once rotated). `right` is halved because
            the clip box is now twice the cell width (extended left). */}
        <div className="absolute bottom-0 right-[19.5%] w-[47%] max-w-[560px] translate-y-[170px]">
          {CARDS.map((c) => (
            <Image
              key={c.src}
              src={c.src}
              alt={c.alt}
              width={1100}
              height={299}
              sizes="(max-width: 768px) 60vw, 490px"
              className="fan-card absolute inset-x-0 bottom-0 h-auto w-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
