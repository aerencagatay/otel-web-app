/**
 * Cloudflare Turnstile server-side verification helper.
 *
 * Generic on purpose: used by the reservation API and (per Task 03) the
 * contact form backend as well. If TURNSTILE_SECRET_KEY is not configured,
 * verification is bypassed with a console warning — this keeps local dev
 * and `npm run build` working without Cloudflare credentials. In
 * production, missing the env var is treated as a misconfiguration and the
 * caller should still fail closed by checking `NODE_ENV`.
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
 * - No `TURNSTILE_SECRET_KEY` configured -> bypass (success: true) with a
 *   one-time warning. Intended for local dev only.
 * - Token missing/empty -> fails (unless bypassed above).
 * - Cloudflare rejects the token, or the request itself errors -> fails.
 */
export async function verifyTurnstileToken(
  token: string | null | undefined,
  ip?: string
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
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

/** Whether Turnstile enforcement should be treated as active (prod-like). */
export function isTurnstileEnforced(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}
