import Image from "next/image";

// Reveal footer: pinned to the bottom of the viewport at a low z-index. The
// page content scrolls over it on an opaque layer; the last section sliding up
// uncovers this. Height is driven by --footer-h (see globals.css), which also
// reserves the matching scroll space in page.tsx.
export default function SiteFooter() {
  return (
    <footer
      className="fixed inset-x-0 bottom-0 z-0 flex flex-col items-center justify-center gap-10 overflow-hidden bg-white px-6 md:px-12"
      style={{ height: "var(--footer-h)" }}
    >
      <Image
        src="/caddie-footer2.png"
        alt="Caddie"
        width={3986}
        height={1832}
        priority
        className="h-auto w-full max-w-[1500px] select-none object-contain"
      />
      <p className="font-inter text-xs text-zinc-400">
        © 2026 Caddie. Designed for the walk from tee to green.
      </p>
    </footer>
  );
}
