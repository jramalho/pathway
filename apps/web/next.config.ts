import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pathway/api", "@pathway/ui-tokens"],
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
