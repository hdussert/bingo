import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a phone on the local network load the dev server's scripts
  allowedDevOrigins: ["192.168.1.64"],
};

export default nextConfig;
