import type { MetadataRoute } from "next";

const BASE = "https://karaduttasotel.com";

/** TR öneksiz, EN /en önekli mutlak URL üretir. */
function urls(path: string): { tr: string; en: string } {
  return {
    tr: path === "/" ? BASE : `${BASE}${path}`,
    en: path === "/" ? `${BASE}/en` : `${BASE}/en${path}`,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Sayfa içeriği anlamlı biçimde değiştiğinde ilgili tarihi güncelleyin.
  // `new Date()` KULLANMAYIN: her build'de değişen lastModified arama
  // motorlarına yanıltıcı "yeni içerik" sinyali verir.
  const lastContentUpdate = new Date("2026-07-08");

  const pages: {
    path: string;
    changeFrequency: "weekly" | "monthly";
    priority: number;
  }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/rooms", changeFrequency: "weekly", priority: 0.9 },
    { path: "/reservation", changeFrequency: "weekly", priority: 0.9 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  ];

  // Her sayfa için TR ve EN girdisi; ikisi de hreflang alternates taşır.
  return pages.flatMap((page) => {
    const { tr, en } = urls(page.path);
    const languages = { tr, en, "x-default": tr };
    return [
      {
        url: tr,
        lastModified: lastContentUpdate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages },
      },
      {
        url: en,
        lastModified: lastContentUpdate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages },
      },
    ];
  });
}
