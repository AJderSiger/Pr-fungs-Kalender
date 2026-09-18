import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Erlaubt Zugriffe über den temporären localtunnel-Preview-Link im Dev-Modus.
  allowedDevOrigins: ["*.loca.lt"],
};

export default nextConfig;
