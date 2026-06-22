import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Serve AVIF to browsers that support it (~20% smaller than WebP at equal
    // quality), falling back to WebP, then the original. Order matters: the
    // first format the browser's Accept header matches wins.
    formats: ["image/avif", "image/webp"],
    // Cache optimized variants for 31 days instead of the 4-hour default, so
    // repeat visits and warm CDNs re-serve them without re-encoding.
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
};

export default nextConfig;
