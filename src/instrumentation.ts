import type { Instrumentation } from "next";

/**
 * Minimal Sentry kurulumu — yalnızca SERVER hataları.
 *
 * - `SENTRY_DSN` env değişkeni tanımlı değilse tamamen devre dışıdır
 *   (init çağrılmaz, hiçbir veri gönderilmez).
 * - Client tarafı bilinçli olarak kapsam dışı: bundle'a Sentry eklemiyoruz.
 * - Tracing kapalı (tracesSampleRate: 0) — sadece hata yakalama.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.SENTRY_DSN) {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
    });
  }
}

/** Next.js'in yakaladığı tüm server hatalarını Sentry'ye iletir. */
export const onRequestError: Instrumentation.onRequestError = async (
  ...args
) => {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.SENTRY_DSN) {
    const Sentry = await import("@sentry/nextjs");
    await Sentry.captureRequestError(...args);
  }
};
