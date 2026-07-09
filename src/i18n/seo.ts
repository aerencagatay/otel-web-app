import type { Metadata } from "next";
import type { Locale } from "./routing";

/**
 * Bir sayfa için canonical + hreflang (`alternates.languages`) üretir.
 * TR kök URL'de öneksiz (`/about`), EN `/en` önekli (`/en/about`).
 *
 * @param locale  Aktif dil.
 * @param path    TR yolundaki (öneksiz) sayfa yolu, ör. "/about" veya "/".
 */
export function buildAlternates(
  locale: Locale,
  path: string
): Metadata["alternates"] {
  const tr = path;
  const en = path === "/" ? "/en" : `/en${path}`;
  return {
    canonical: locale === "tr" ? tr : en,
    languages: {
      tr,
      en,
      "x-default": tr,
    },
  };
}
