"use client";

import dynamic from "next/dynamic";

// Three.js + GLTFLoader + PMREM are ~636 KB of JS — the single largest chunk in
// the build. Importing the canvas statically forced all of it into the
// homepage's initial bundle even though the model lives four folds down, where
// it was parsed/evaluated on the main thread during the hero's first paint.
//
// dynamic({ ssr: false }) splits it into its own chunk so it's never in the
// homepage's initial bundle. The chunk only starts downloading once the canvas
// actually mounts — and exploded-view.tsx now gates that mount behind an
// IntersectionObserver (~one viewport ahead of the section). So Three.js, its
// WebGL init, and the Draco GLB decode all stay off the main thread during the
// hero's first paint, and visitors who never scroll this far never load it.
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
