import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a test build use its own folder so it doesn't disturb a running `npm run dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    // Product photos uploaded in the DOTS Admin (Sanity) are served from this CDN.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
