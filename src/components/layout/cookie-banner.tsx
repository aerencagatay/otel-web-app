"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "motion/react";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "karadut-cookie-consent";
/** Aynı sekme içinde karar değişimini duyuran olay adı (K3 istifi için). */
const CONSENT_EVENT = "karadut:cookie-consent";

export type CookieConsent = "accepted" | "essential-only";

/* ======================================================================
   K3 — SABİT KATMAN İSTİFİ (tek doğruluk kaynağı)
   ----------------------------------------------------------------------
   390px'de ekranın altı dört ayrı sabit katman tarafından paylaşılıyordu
   ve hepsi üst üste biniyordu. Düzen artık şu: her katmanın TEK bir
   yuvası var, hiçbiri diğerinin dikdörtgenine girmiyor.

     z-1200  Çerez bandı        alt kenar, tam genişlik — EN ÜSTTE
     z-1004  Ses aç/kapa        SOL sütun, satır 1
     z-1003  Yukarı çık         SAĞ sütun, satır 2
     z-1002  WhatsApp           SAĞ sütun, satır 1
     z-1001  Sabit rezervasyon  alt kenar, bottom:0, yükseklik 64px
             (referans: globals.css'teki .topbar 1002 / .header-nav 1000
              üst kenara sabitli — bu istifle alan paylaşmaz.)

   Dikey yuvalar (mobil, --sticky-cta-h = 64px):
     satır 1 → calc(var(--sticky-cta-h) + safe-area + 12px)
     satır 2 → calc(var(--sticky-cta-h) + safe-area + 72px)   (12 + 48 + 12)
   Masaüstünde sabit bar gizli olduğu için satır 1 = 24px, satır 2 = 84px.

   KURAL: Çerez kararı verilene kadar diğer DÖRT katmanın hepsi gizli.
   Karar tek seferlik ve localStorage'a yazılıyor; bu yüzden ilk ekranda
   yalnızca çerez bandı görünür (KVKK + UX).
   ====================================================================== */

/** Reads the stored cookie preference (client-only). Null = not yet chosen. */
export function getStoredCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || value === "essential-only" ? value : null;
  } catch {
    // Gizli sekme / kapalı depolama: karar yok sayılır, bant tekrar gösterilir.
    return null;
  }
}

/**
 * Çerez kararının VERİLMİŞ olup olmadığını izler (hangi karar olduğu değil).
 * K3'teki diğer sabit katmanlar (sabit rezervasyon barı, WhatsApp balonu,
 * yukarı çık, ses düğmesi) bu değere bakarak kendini gizler.
 *
 * İlk render'da her zaman `false` döner — böylece sunucu ve istemci çıktısı
 * aynı olur (hydration uyuşmazlığı yok) ve katmanlar ancak localStorage
 * okunduktan sonra belirir.
 */
export function useCookieConsentResolved(): boolean {
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const sync = () => setResolved(getStoredCookieConsent() != null);
    sync();
    // Aynı sekme: bandın kendi olayı. Diğer sekmeler: storage olayı.
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return resolved;
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
  const reduceMotion = useReducedMotion();
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
    try {
      window.localStorage.setItem(STORAGE_KEY, consent);
    } catch {
      // Depolama yazılamasa bile bandı kapat: oturum içinde tekrar sormayalım.
    }
    // Diğer sabit katmanlar bu olayı dinliyor; karar anında görünür oluyorlar.
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setVisible(false);
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {visible && (
          <m.div
            key="cookie-banner"
            role="dialog"
            aria-label={t("ariaLabel")}
            /* `on-dark`: globals.css'teki iki katmanlı focus halkasını koyu
               zemin için ters çevirir (bulgu Y7). */
            className="on-dark fixed inset-x-0 bottom-0 z-[1200] border-t border-white/15 bg-ink px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] text-white"
            /* Tek, sakin hareket: aşağıdan 16px kayarak belirir. */
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={{
              duration: reduceMotion ? 0 : 0.24,
              ease: [0.2, 0.7, 0.3, 1],
            }}
          >
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-6">
              <p className="m-0 max-w-2xl text-[14px] leading-relaxed text-white/80">
                {t.rich("text", {
                  link: (chunks) => (
                    <Link
                      href="/gizlilik"
                      /* Y4: satır akışını bozmadan dokunma alanını 44px'e
                         çıkarmak için dikey padding (inline elemanda padding
                         satır kutusunu büyütmez, tıklama alanını büyütür). */
                      className="inline-block py-3.5 text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
              <div className="flex w-full shrink-0 gap-3 sm:w-auto">
                <button
                  type="button"
                  onClick={() => choose("essential-only")}
                  className="min-h-[44px] flex-1 cursor-pointer rounded-[2px] border border-white/30 bg-transparent px-5 text-[14px] font-semibold text-white/85 transition-colors hover:border-white/60 hover:text-white sm:flex-none"
                >
                  {t("essentialOnly")}
                </button>
                <button
                  type="button"
                  onClick={() => choose("accepted")}
                  className="min-h-[44px] flex-1 cursor-pointer rounded-[2px] border-0 bg-stone-00 px-5 text-[14px] font-semibold text-ink transition-colors hover:bg-white sm:flex-none"
                >
                  {t("accept")}
                </button>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
