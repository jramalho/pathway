import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @pathway/api is a source-only TS workspace package; transpile it for the client bundle.
  transpilePackages: ["@pathway/api"],
  images: {
    // Allow Strapi media URLs (localhost in dev, any host in prod).
    // Using unoptimized in the page for now, but keep remotePatterns for next/image.
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
