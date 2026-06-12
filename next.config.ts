import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Serve WebP (smaller than the original PNG/JPG at the same quality, and
    // fast to encode). Source files in public/ are untouched — this only
    // affects the optimized variants Next generates and serves.
    formats: ["image/webp"],
    // Cache optimized variants for 31 days instead of the 4-hour default, so
    // repeat visits and warm CDNs re-serve them without re-encoding.
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
};

export default nextConfig;
