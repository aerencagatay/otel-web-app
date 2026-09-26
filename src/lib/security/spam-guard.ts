/**
 * Contact form spam heuristics — the layer behind Turnstile.
 *
 * Turnstile alone isn't enough: captcha-solving services hand bots valid
 * tokens, and they rotate IPs past the per-IP rate limit. The observed
 * attack (2026-09) posts random mixed-case strings ("NKbwmtujZJjfJEsj") with
 * real victims' e-mail addresses so our auto-reply floods their inbox
 * ("e-mail bombing"). Submissions caught here are dropped silently: the
 * caller answers 200 so the bot learns nothing, and no mail is sent.
 */

/** A human can't read and fill the form this fast. */
const MIN_FILL_MS = 3_000;

/**
 * A single word that is not all-caps yet has several capitals after its
 * first letter, e.g. "StiWdUvDrADvypOocGT". Real names ("McDonald",
 * "DeLaCroix") have at most two; shouting ("AYŞE") is all-caps.
 */
function isRandomCaseToken(token: string): boolean {
  const letters = token.replace(/[^\p{L}]/gu, "");
  if (letters.length < 8) return false;
  if (letters === letters.toLocaleUpperCase("tr")) return false;
  const innerCapitals = letters
    .slice(1)
    .split("")
    .filter((ch) => ch !== ch.toLocaleLowerCase("tr")).length;
  return innerCapitals >= 3;
}

export function looksLikeGibberish(text: string): boolean {
  return text
    .trim()
    .split(/[\s-]+/)
    .some(isRandomCaseToken);
}

export type SpamReason = "honeypot" | "too-fast" | "gibberish";

export function detectContactSpam(input: {
  name: string;
  message: string;
  /** Hidden honeypot field; humans never see or fill it. */
  website?: string;
  /** Time between form render and submit; undefined = unknown (old client). */
  elapsedMs?: number;
}): SpamReason | null {
  if (input.website && input.website.trim() !== "") return "honeypot";
  if (input.elapsedMs !== undefined && input.elapsedMs < MIN_FILL_MS) return "too-fast";
  if (looksLikeGibberish(input.name) || looksLikeGibberish(input.message)) {
    return "gibberish";
  }
  return null;
}
