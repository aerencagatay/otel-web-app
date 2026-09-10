"use client";

import { useTranslations } from "next-intl";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "motion/react";
import { CalendarPlus } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useCookieConsentResolved } from "@/components/layout/cookie-banner";

const HIDE_ON = new Set([
  "/reservation",
  "/admin",
  "/admin/login",
  "/booking-success",
]);

/**
 * Mobil birincil CTA — ekranın alt kenarına sabit bar.
 *
 * K3 (kritik) düzeltmesi:
 * - Yuva: `bottom: 0`, yükseklik tam olarak `--sticky-cta-h` (64px) +
 *   güvenli alan. WhatsApp/yukarı çık/ses düğmeleri bu yüksekliğe göre
 *   konumlandığı için bar ile hiçbiri çakışmaz.
 * - z-index 1001 — istifin en altı (bkz. cookie-banner.tsx içindeki tablo).
 * - Çerez kararı verilene kadar HİÇ render edilmez; böylece çerez bandının
 *   üstüne binmesi mümkün değil.
 * - Yalnızca <1024px'te görünür (masaüstünde navbar CTA'sı var).
 */
export default function StickyBookingCta() {
  const t = useTranslations("stickyCta");
  const pathname = usePathname();
  const consentResolved = useCookieConsentResolved();
  const reduceMotion = useReducedMotion();

  const routeAllows =
    !!pathname && !pathname.startsWith("/admin") && !HIDE_ON.has(pathname);
  const show = routeAllows && consentResolved;

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {show && (
          <m.div
            key="sticky-booking-cta"
            className="fixed inset-x-0 bottom-0 z-[1001] flex h-[calc(var(--sticky-cta-h)+env(safe-area-inset-bottom,0px))] items-center justify-center border-t border-stone-15 bg-stone-00 px-4 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_28px_rgba(20,18,14,0.10)] lg:hidden"
            /* Yumuşak giriş/çıkış: bar kendi yüksekliği kadar kayar.
               Mobilde CTA'nın erişilebilir kalması öncelikli olduğu için
               süre kısa ve tek yönlü — dikkat çalmaz. */
            initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            transition={{
              duration: reduceMotion ? 0 : 0.24,
              ease: [0.2, 0.7, 0.3, 1],
            }}
          >
            <Link
              href="/reservation"
              /* .btn-gold: deniz dolgu, radius 2px, mobilde min-height 56px —
                 64px'lik barın içine 4px boşlukla oturur. */
              className="btn-gold w-full max-w-sm no-underline"
            >
              <CalendarPlus size={18} strokeWidth={1.75} aria-hidden="true" />
              {t("label")}
            </Link>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
