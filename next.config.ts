import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdng.jollytur.com",
        pathname: "/files/cms/media/hotel/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
