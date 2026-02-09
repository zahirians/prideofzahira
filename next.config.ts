import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages: https://zahirians.github.io/prideofzahira
  basePath: "/prideofzahira",
  images: { unoptimized: true },
};

export default nextConfig;
