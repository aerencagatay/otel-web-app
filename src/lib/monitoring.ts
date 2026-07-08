/**
 * Sunucu tarafı hata raporlama yardımcısı (Sentry).
 *
 * Route handler'lar hataları kendi içinde yakalayıp kullanıcıya düzgün
 * yanıt döndüğü için Next.js `onRequestError` kancası bu hataları görmez;
 * kritik path'lerdeki catch bloklarından bu fonksiyon çağrılır.
 *
 * `SENTRY_DSN` yoksa no-op — lokal geliştirmede sessiz.
 */
export async function reportServerError(
  err: unknown,
  context?: Record<string, unknown>
): Promise<void> {
  if (!process.env.SENTRY_DSN) return;
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(err, context ? { extra: context } : undefined);
  } catch {
    // raporlama hatası asla asıl akışı bozmasın
  }
}
