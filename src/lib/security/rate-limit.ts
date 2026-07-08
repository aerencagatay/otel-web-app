import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

/**
 * Rate limiting for public API routes (reservations, availability, login).
 *
 * Backed by Upstash Redis so limits are shared across serverless instances.
 * If UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not configured
 * (e.g. local dev), every limiter below becomes a no-op that always allows
 * the request, and a single warning is logged on first use. This keeps
 * `npm run build` and local development working without any Upstash setup.
 */

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis =
  redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

let warnedNoop = false;
function warnOnce() {
  if (warnedNoop) return;
  warnedNoop = true;
  console.warn(
    "[rate-limit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN yapılandırılmamış — rate limiting devre dışı (yalnızca dev ortamında beklenen davranış)."
  );
}

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

const NOOP_RESULT: RateLimitResult = {
  success: true,
  limit: Infinity,
  remaining: Infinity,
  reset: 0,
};

export interface AppRateLimiter {
  /** Returns success:true when the request is allowed. */
  limit(identifier: string): Promise<RateLimitResult>;
}

function createLimiter(opts: {
  tokens: number;
  window: `${number} ${"ms" | "s" | "m" | "h" | "d"}`;
  prefix: string;
}): AppRateLimiter {
  if (!redis) {
    return {
      async limit() {
        warnOnce();
        return NOOP_RESULT;
      },
    };
  }

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(opts.tokens, opts.window),
    prefix: `karadut:${opts.prefix}`,
    analytics: false,
  });

  return {
    async limit(identifier: string) {
      const result = await limiter.limit(identifier);
      return result;
    },
  };
}

/** IP başına 3 istek / 10 dakika. */
const reservationLimiterShort = createLimiter({
  tokens: 3,
  window: "10 m",
  prefix: "reservation-10m",
});

/** IP başına günlük 10 istek. */
const reservationLimiterDaily = createLimiter({
  tokens: 10,
  window: "1 d",
  prefix: "reservation-1d",
});

export const reservationLimiter = {
  async limit(identifier: string): Promise<RateLimitResult> {
    const short = await reservationLimiterShort.limit(identifier);
    if (!short.success) return short;
    return reservationLimiterDaily.limit(identifier);
  },
};

/** IP başına 30 istek / dakika. */
export const availabilityLimiter = createLimiter({
  tokens: 30,
  window: "1 m",
  prefix: "availability-1m",
});

/** IP başına 5 istek / 15 dakika. */
const loginLimiterByIp = createLimiter({
  tokens: 5,
  window: "15 m",
  prefix: "login-ip-15m",
});

/** E-posta başına 10 istek / saat. */
const loginLimiterByEmail = createLimiter({
  tokens: 10,
  window: "1 h",
  prefix: "login-email-1h",
});

export const loginLimiter = {
  async limit(ip: string, email?: string): Promise<RateLimitResult> {
    const byIp = await loginLimiterByIp.limit(ip);
    if (!byIp.success) return byIp;
    if (email) {
      return loginLimiterByEmail.limit(email.toLowerCase());
    }
    return byIp;
  },
};

/**
 * Extracts the client IP from the `x-forwarded-for` header (Vercel appends
 * the real client IP as the first entry). Falls back to a constant string
 * so rate limiting still buckets local/dev requests together instead of
 * throwing.
 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export const RATE_LIMIT_MESSAGE =
  "Çok fazla deneme yaptınız. Lütfen birkaç dakika sonra tekrar deneyin.";
