"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "karadut-cookie-consent";

export type CookieConsent = "accepted" | "essential-only";

/** Reads the stored cookie preference (client-only). Null = not yet chosen. */
export function getStoredCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "essential-only" ? value : null;
}

/**
 * Minimal cookie consent banner — bottom bar, two choices, stores the
 * preference in localStorage. Does not block the reservation flow (it is a
 * fixed overlay, not a modal). No analytics script is wired here yet — a
 * later analytics integration should read `getStoredCookieConsent()` before
 * loading any non-essential script.
 */
export default function CookieBanner() {
  const t = useTranslations("cookieBanner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Deferred to a timer (rather than an unconditional setState call in the
    // effect body) so the banner's mount-reveal doesn't trigger a cascading
    // render warning; localStorage is only readable client-side anyway, so
    // the banner is always absent on the very first paint.
    const timer = setTimeout(() => {
      if (getStoredCookieConsent() == null) {
        setVisible(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  function choose(consent: CookieConsent) {
    window.localStorage.setItem(STORAGE_KEY, consent);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t("ariaLabel")}
      className="fixed bottom-0 inset-x-0 z-[90] bg-dark text-white border-t border-white/10 px-4 py-5"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-[13px] text-white/75 m-0 max-w-2xl leading-relaxed">
          {t.rich("text", {
            link: (chunks) => (
              <Link href="/gizlilik" className="text-gold-light underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => choose("essential-only")}
            className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/70 border border-white/25 px-4 py-2.5 rounded-[var(--radius-sm)] bg-transparent cursor-pointer hover:text-white hover:border-white/50 transition-colors"
          >
            {t("essentialOnly")}
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="text-[11px] font-semibold tracking-[0.15em] uppercase text-dark bg-gold px-4 py-2.5 rounded-[var(--radius-sm)] border-0 cursor-pointer hover:opacity-90 transition-opacity"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
