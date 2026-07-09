/**
 * Rezervasyon akışının anlık bağlamını (tarih + oda) sayfa genelindeki
 * bileşenlerle (ör. WhatsApp yüzen butonu) paylaşan minik module-level
 * store — `useSyncExternalStore` ile tüketilir.
 *
 * Neden URL senkronu değil? booking-flow zaten `searchParams`'ı OKUYAN iki
 * effect taşıyor (deep-link prefill + `auto=1` otomatik arama). Adım
 * geçişlerinde `router.replace` ile query yazmak bu effect'leri yeniden
 * tetikler (prefill/auto döngü riski) ve URL'yi geçici UI durumuyla
 * kirletir. Hafif bir store, akış durumunu URL semantiğine dokunmadan
 * paylaşır; deep-link'li girişlerde WhatsApp butonu yine searchParams'a
 * düşer (fallback).
 */

export interface BookingContext {
  checkIn: string;
  checkOut: string;
  roomType?: string;
}

let current: BookingContext | null = null;
const listeners = new Set<() => void>();

/** Akış adım 2-3'e girerken set edilir, adım 1'e dönünce/unmount'ta null. */
export function setBookingContext(ctx: BookingContext | null): void {
  current = ctx;
  for (const listener of listeners) listener();
}

export function getBookingContext(): BookingContext | null {
  return current;
}

/** SSR snapshot'ı — sunucuda bağlam her zaman boş. */
export function getServerBookingContext(): null {
  return null;
}

export function subscribeBookingContext(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
