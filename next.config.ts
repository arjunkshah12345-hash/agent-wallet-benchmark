import type { NextConfig } from "next";

// Served from GitHub Pages at /agent-wallet-benchmark. Set PAGES_BASE_PATH=""
// to build for a root domain.
const basePath = process.env.PAGES_BASE_PATH ?? "/agent-wallet-benchmark";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
