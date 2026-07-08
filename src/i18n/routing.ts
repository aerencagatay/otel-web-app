import { defineRouting } from "next-intl/routing";

/**
 * i18n yönlendirme yapılandırması (tek doğruluk kaynağı).
 *
 * - defaultLocale `tr`, `localePrefix: "as-needed"` → Türkçe URL'leri önek
 *   ALMAZ (`/`, `/rooms` …) ve mevcut SEO/backlink'ler korunur; İngilizce
 *   `/en` öneki altında yaşar (`/en`, `/en/rooms` …).
 * - `localeCookie` kapalı: dil tercihi URL'den okunur, otomatik
 *   yönlendirme yapılmaz (arama motorlarının TR kök URL'lerini stabil
 *   görmesi için).
 */
export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
