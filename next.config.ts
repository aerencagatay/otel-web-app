import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phone/other LAN devices to load dev resources when testing via the
  // Network URL (e.g. http://192.168.1.59:3000). Dev-only; ignored in
  // production. Update the IP if your LAN address changes.
  allowedDevOrigins: ["192.168.1.59"],
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

export default nextConfig;
