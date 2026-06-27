"use client";

import dynamic from "next/dynamic";

// Three.js + GLTFLoader + PMREM are ~636 KB of JS — the single largest chunk in
// the build. Importing the canvas statically forced all of it into the
// homepage's initial bundle even though the model lives four folds down, where
// it was parsed/evaluated on the main thread during the hero's first paint.
//
// dynamic({ ssr: false }) splits it into its own chunk that loads *after*
// hydration instead of blocking it — so the hero's LCP and Time-to-Interactive
// no longer pay for Three.js. The canvas still mounts right away on the client,
// so the model (and its scroll-driven explode) is ready by the time the section
// is reached: same behaviour as before, just no longer on the critical path.
const CaddieExplodeCanvas = dynamic(() => import("./CaddieExplodeCanvas"), {
  ssr: false,
  // Matches the canvas's own internal placeholder, so the panel looks identical
  // whether we're waiting on the chunk or the GLB — no pop-in, no visible swap.
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">
      loading model…
    </div>
  ),
});

export default CaddieExplodeCanvas;
