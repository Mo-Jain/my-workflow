import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

export default nextConfig;



