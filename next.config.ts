import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
