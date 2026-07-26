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
    // AVIF önce denenir (WebP'ye göre ~%20 daha küçük), desteklemeyen
    // tarayıcılarda WebP'ye düşer. next/image ile sunulan her görselin
    // transfer boyutunu düşürür.
    formats: ["image/avif", "image/webp"],
    // Optimize edilmiş görsellerin tarayıcı/edge cache ömrü (varsayılan 4 saat).
    // 31 güne çıkarınca tekrar eden ziyaretçiler görselleri yeniden indirmez —
    // "Fast Data Transfer" kotasını korur.
    minimumCacheTTL: 2678400, // 31 gün
  },

  async headers() {
    return [
      {
        // `public/img/` altındaki statik medya (videolar + hazır .jpg/.webp
        // türevleri). Bu dosyalar `/_next/static/` gibi hash'li DEĞİL, bu yüzden
        // Next varsayılan olarak uzun cache VERMEZ ve her ziyarette (özellikle
        // ~3 MB'lık videolar) yeniden inerdi. Bir yıllık immutable cache ile
        // tekrar eden ziyaretçiler ve sayfa geçişleri bunları yeniden indirmez.
        //
        // ÖNEMLİ: `immutable` olduğu için bir fotoğraf/videoyu DEĞİŞTİRİRSEN
        // dosya adını da değiştir (ör. `otel-video.mp4` → `otel-video-v2.mp4`)
        // ya da `?v=2` ekle; yoksa eski dosyayı cache'leyen tarayıcılar bir yıl
        // boyunca eskisini gösterir.
        source: "/img/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
