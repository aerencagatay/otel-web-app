import Script from "next/script";

/**
 * Plausible Analytics (cookie'siz, GDPR/KVKK uyumlu — çerez bandı gerekmez).
 *
 * Yalnızca `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` tanımlıysa yüklenir; env yoksa
 * hiçbir script eklenmez (lokal geliştirme ve preview'larda sessiz).
 * Custom event'ler için `src/lib/analytics.ts` içindeki `trackEvent`
 * kullanılır.
 */
export default function PlausibleAnalytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
