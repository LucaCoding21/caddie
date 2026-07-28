"use client";

import { useEffect, useState } from "react";

/**
 * The hero's product-in-use loop. Layered OVER the hero image, which stays the
 * LCP element: the video only starts downloading after the window load event,
 * so it never competes with the hero image (or anything else) for first-paint
 * bandwidth. Until it's actually playing it sits at opacity 0 with the photo
 * showing through, then cross-fades in.
 *
 * Skipped entirely for prefers-reduced-motion and Data Saver users — they keep
 * the static hero.
 */
export default function HeroVideo() {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // navigator.connection is Chromium-only; absent means no signal, load it.
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (conn?.saveData) return;

    const arm = () => setReady(true);
    if (document.readyState === "complete") {
      arm();
      return;
    }
    window.addEventListener("load", arm, { once: true });
    return () => window.removeEventListener("load", arm);
  }, []);

  if (!ready) return null;

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      // Poster intentionally omitted — the hero <picture> under this element
      // is the placeholder, and it's already painted.
      onPlaying={() => setPlaying(true)}
      className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
        playing ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* AV1 first for the browsers that decode it (much better quality/byte);
          H.264 mp4 is the universal fallback. */}
      <source src="/videos/caddie-hero.webm" type="video/webm" />
      <source src="/videos/caddie-hero.mp4" type="video/mp4" />
    </video>
  );
}
