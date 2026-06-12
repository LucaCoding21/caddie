import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Serve AVIF first (≈20–50% smaller than WebP at the same quality), with
    // WebP as the fallback for browsers that don't support it. Source files in
    // public/ are untouched — this only affects the optimized variants Next
    // generates and serves.
    formats: ["image/avif", "image/webp"],
    // Cache optimized variants for 31 days instead of the 4-hour default, so
    // repeat visits and warm CDNs re-serve them without re-encoding.
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
};

export default nextConfig;
