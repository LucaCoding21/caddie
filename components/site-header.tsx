"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function SiteHeader() {
  // Hero is full-viewport and dark; the logo is white to read against it.
  // Once scrolled past the hero, the header sits over light sections, so
  // flip the logo to a dark color to keep it legible.
  const [pastHero, setPastHero] = useState(false);
  // Hide the logo while scrolling down, reveal it on scroll up (and always
  // near the top). lastY tracks the previous position to infer direction.
  const [showLogo, setShowLogo] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setPastHero(y > window.innerHeight - 80);

      // Near the top: always show. Otherwise compare against the last position
      // (with a small dead zone) so tiny jitters don't flicker the logo.
      if (y < 80) {
        setShowLogo(true);
      } else if (y > lastY.current + 4) {
        setShowLogo(false);
      } else if (y < lastY.current - 4) {
        setShowLogo(true);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 pointer-events-none">
      <Link
        href="/"
        className={`font-brand text-2xl font-bold uppercase tracking-tight transition-all duration-300 ${
          pastHero ? "text-zinc-900" : "text-white"
        } ${
          showLogo
            ? "-translate-y-1 opacity-100 pointer-events-auto"
            : "-translate-y-6 opacity-0 pointer-events-none"
        }`}
      >
        Caddie
      </Link>

      <div className="pointer-events-auto flex items-center gap-4 bg-white/95 backdrop-blur rounded-full pl-2 pr-2 py-2 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)]">
        <Image
          src="/colors/black.png"
          alt=""
          width={56}
          height={56}
          className="h-10 w-10 object-contain rounded-full bg-zinc-100"
        />
        <span className="text-base font-medium text-black">
          Caddie Companion
        </span>
        <span className="text-zinc-300" aria-hidden>
          ·
        </span>
        <span className="text-base text-zinc-600 tabular-nums">$29</span>
        <Link
          href="/select-color"
          className="ml-1 inline-flex items-center gap-1 bg-black text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          Order now
          <span aria-hidden>→</span>
        </Link>
      </div>
    </header>
  );
}
