import { join } from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: join(__dirname, ".."),
};

export default nextConfig;
