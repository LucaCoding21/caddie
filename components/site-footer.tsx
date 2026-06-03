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
      {/* Full-bleed backdrop: golf clubs against the sky. */}
      <Image
        src="/footer-clubs-v2.jpg"
        alt="Golf clubs against a blue sky"
        fill
        priority
        sizes="100vw"
        className="select-none object-cover object-[center_15%]"
      />

      {/* Wordmark, centered over the photo. */}
      <h2 className="relative z-10 select-none font-brand text-8xl font-bold uppercase tracking-tight text-white md:text-[11rem]">
        Caddie
      </h2>

      <p className="absolute bottom-6 z-10 font-inter text-xs text-white/80">
        © 2026 Caddie. Designed for the walk from tee to green.
      </p>
    </footer>
  );
}
