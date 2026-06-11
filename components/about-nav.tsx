"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * The About page's left-hand nav (wordmark + links), fixed to the top-left and
 * revealed on scroll. It shows near the top of the page and whenever the user
 * scrolls up, and tucks away while scrolling down — mirroring FloatingPill on
 * the right so the two reveal together as one nav bar.
 */
export function AboutNav() {
  const [show, setShow] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setShow(true);
      } else if (y > lastY.current + 4) {
        setShow(false);
      } else if (y < lastY.current - 4) {
        setShow(true);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed left-4 top-5 z-50 transition-all duration-300 sm:left-8 sm:top-6 ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-6 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 text-black sm:gap-6">
        <Link href="/" aria-label="Caddie Companion home" className="block">
          <Image
            src="/caddie-logo.png"
            alt="Caddie Companion"
            width={305}
            height={103}
            preload
            className="h-6 w-auto sm:h-8"
          />
        </Link>
        <nav className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide sm:ml-4 sm:gap-6 sm:text-sm">
          <Link href="/about" className="hover:underline underline-offset-4">
            About
          </Link>
          <Link href="/contact" className="hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </div>
    </div>
  );
}
