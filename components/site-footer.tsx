import Image from "next/image";

// Reveal footer: pinned to the bottom of the viewport at a low z-index. The
// page content scrolls over it on an opaque layer; the last section sliding up
// uncovers this. Height is driven by --footer-h (see globals.css), which also
// reserves the matching scroll space in page.tsx.
export default function SiteFooter() {
  return (
    <footer
      className="fixed inset-x-0 bottom-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-white"
      style={{ height: "var(--footer-h)" }}
    >
      {/* Full-bleed backdrop: the four Caddie tools on a bed of golf balls. */}
      <Image
        src="/footer-balls.png"
        alt="Caddie Companion tools in green, black, blue, and red resting on golf balls"
        fill
        preload
        sizes="100vw"
        className="select-none object-cover object-[center_30%]"
      />

      <p className="absolute bottom-6 z-10 px-6 text-center font-inter text-xs text-white/80">
        © 2026 Caddie Companion. Designed for the walk from tee to green.
      </p>
    </footer>
  );
}
