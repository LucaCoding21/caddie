"use client";

import { useEffect, useRef } from "react";

type Source = { src: string; type: string };

/**
 * A muted, looping autoplay clip that doesn't download until it's near the
 * viewport. `preload="none"` keeps its ~2 MB off the initial page load (these
 * sit below the fold), and the IntersectionObserver starts playback exactly as
 * the user reaches it — so it still autoplays on arrival, visually identical to
 * a plain autoPlay <video>, just no longer competing with the hero for
 * bandwidth. Pauses when scrolled away to save battery/CPU.
 */
export default function LazyVideo({
  sources,
  poster,
  className,
  ariaLabel,
}: {
  sources: Source[];
  poster: string;
  className?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // play() can reject if interrupted (fast scroll) — harmless.
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      // A little lead so the clip has a beat to start fetching before it's
      // fully on screen, without pulling it during the initial load.
      { rootMargin: "300px 0px", threshold: 0.15 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-label={ariaLabel}
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  );
}
