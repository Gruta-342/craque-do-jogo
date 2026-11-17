import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@craque/game-engine", "@craque/shared"]
};

export default nextConfig;
