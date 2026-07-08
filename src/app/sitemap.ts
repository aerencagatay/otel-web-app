import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://karaduttasotel.com";

  // Sayfa içeriği anlamlı biçimde değiştiğinde ilgili tarihi güncelleyin.
  // `new Date()` KULLANMAYIN: her build'de değişen lastModified arama
  // motorlarına yanıltıcı "yeni içerik" sinyali verir.
  const lastContentUpdate = new Date("2026-07-08");

  return [
    { url: base, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: lastContentUpdate, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/rooms`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/reservation`, lastModified: lastContentUpdate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/contact`, lastModified: lastContentUpdate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/kvkk`, lastModified: lastContentUpdate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/gizlilik`, lastModified: lastContentUpdate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/iptal-politikasi`, lastModified: lastContentUpdate, changeFrequency: "yearly", priority: 0.3 },
  ];
}
