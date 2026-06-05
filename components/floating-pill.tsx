"use client";

import { useEffect, useRef, useState } from "react";
import { ProductPill } from "@/components/product-pill";

/**
 * The product pill, fixed to the top-right and revealed on scroll. It shows near
 * the top of the page and whenever the user scrolls up, and tucks away while
 * scrolling down — the same idiom as SiteHeader's logo on the home page.
 */
export function FloatingPill() {
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
      className={`pointer-events-none fixed right-5 top-6 z-50 transition-all duration-300 sm:right-8 ${
        show
          ? "translate-y-0 opacity-100"
          : "-translate-y-6 opacity-0"
      }`}
    >
      <ProductPill />
    </div>
  );
}
