/**
 * Cloudflare Turnstile server-side verification helper.
 *
 * Generic on purpose: used by the reservation API and (per Task 03) the
 * contact form backend as well.
 *
 * Missing TURNSTILE_SECRET_KEY:
 * - Development/test: verification is bypassed with a one-time console
 *   warning, so local dev and `npm run build` work without Cloudflare
 *   credentials.
 * - Production: FAIL CLOSED — the request is rejected with reason
 *   "no-secret-configured", so a forgotten env var can't silently disable
 *   bot protection. Callers should map this reason to a 503.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

let warnedNoSecret = false;
function warnOnce() {
  if (warnedNoSecret) return;
  warnedNoSecret = true;
  console.warn(
    "[turnstile] TURNSTILE_SECRET_KEY yapılandırılmamış — doğrulama dev ortamında atlanıyor."
  );
}

export type TurnstileVerifyResult = {
  success: boolean;
  reason?: "missing-token" | "no-secret-configured" | "verify-failed" | "network-error";
};

/**
 * Verifies a Turnstile token against Cloudflare's siteverify endpoint.
 *
 * Behavior:
 * - No `TURNSTILE_SECRET_KEY` configured:
 *   - production -> fails closed (reason: "no-secret-configured").
 *   - otherwise  -> bypass (success: true) with a one-time warning.
 * - Token missing/empty -> fails (reason: "missing-token").
 * - Cloudflare rejects the token, or the request itself errors -> fails.
 */
export async function verifyTurnstileToken(
  token: string | null | undefined,
  ip?: string
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      // Misconfiguration: never silently disable bot protection in prod.
      console.error(
        "[turnstile] TURNSTILE_SECRET_KEY prod ortamında tanımlı değil — istek reddediliyor (fail-closed)."
      );
      return { success: false, reason: "no-secret-configured" };
    }
    warnOnce();
    return { success: true, reason: "no-secret-configured" };
  }

  if (!token) {
    return { success: false, reason: "missing-token" };
  }

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!res.ok) {
      return { success: false, reason: "verify-failed" };
    }

    const data = (await res.json()) as { success?: boolean };
    return data.success
      ? { success: true }
      : { success: false, reason: "verify-failed" };
  } catch (err) {
    console.error("Turnstile verification error:", err);
    return { success: false, reason: "network-error" };
  }
}
