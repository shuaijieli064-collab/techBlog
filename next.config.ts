import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.96"],
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
};

export default nextConfig;
