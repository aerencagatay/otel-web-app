import type { NextConfig } from "next";

// Allow phone/other LAN devices to load dev resources when testing via the
// Network URL (e.g. http://<your-lan-ip>:3000). Dev-only; ignored in
// production. Set DEV_LAN_ORIGIN in .env.local to your machine's current
// LAN IP instead of hard-coding it here (it changes across networks/DHCP
// leases and shouldn't be committed).
const devLanOrigins = process.env.DEV_LAN_ORIGIN
  ? [process.env.DEV_LAN_ORIGIN]
  : [];

const nextConfig: NextConfig = {
  allowedDevOrigins: devLanOrigins,
};

export default nextConfig;
