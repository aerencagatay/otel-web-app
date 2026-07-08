/**
 * Hafif analytics yardımcıları (Plausible).
 *
 * Plausible script'i yalnızca `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env değişkeni
 * tanımlıysa yüklenir (bkz. src/components/analytics/plausible.tsx).
 * Cookie kullanmaz — çerez onayı gerektirmez.
 *
 * Event adları i18n'den bağımsız, sabit key'lerdir. Yeni event eklerken
 * önce EventName union'ına ekleyin.
 */

export type EventName =
  | "availability_search"
  | "room_selected"
  | "reservation_submitted"
  | "reservation_failed"
  | "contact_submitted"
  | "whatsapp_click";

type PlausibleFn = (
  event: string,
  options?: { props?: Record<string, string | number | boolean> }
) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

/**
 * Analytics event'i gönderir. Script yüklü değilse (env yok, adblocker,
 * SSR) sessizce no-op — çağıran taraf hiçbir zaman hata görmez.
 */
export function trackEvent(
  name: EventName,
  props?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(name, props ? { props } : undefined);
  } catch {
    // analytics asla uygulamayı bozmasın
  }
}
