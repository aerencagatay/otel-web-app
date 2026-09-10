"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "motion/react";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/config/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { useCookieConsentResolved } from "@/components/layout/cookie-banner";
import {
  getBookingContext,
  getServerBookingContext,
  subscribeBookingContext,
} from "@/lib/booking-context";

const ROOM_TYPE_LABEL_KEY: Record<string, string> = {
  deluxe_sea_view: "deluxe_sea_view",
  traditional_room: "traditional_room",
  premium_family: "premium_family",
};

function formatDateShort(iso: string, locale: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === "en" ? "en-US" : "tr-TR", {
    day: "2-digit",
    month: "short",
  });
}

/**
 * Floating WhatsApp CTA, present on every public page. When the reservation
 * flow is at step 2-3 (booking-context store, normal in-page flow) or the
 * URL carries dates/room (deep-link prefill), the pre-filled message is
 * parameterized with that context so the hotel gets a useful lead instead
 * of a blank "hi" message. Store wins over URL (it reflects the user's most
 * recent in-flow selection).
 *
 * Konum / davranış (bulgu K3 + O6):
 * - Yuva: SAĞ sütun, satır 1 — mobilde sabit rezervasyon barının 12px
 *   ÜSTÜNDE (`calc(var(--sticky-cta-h) + safe-area + 12px)`), masaüstünde
 *   24px. Bar, "yukarı çık" düğmesi ve hero'daki hızlı arama kartı ile
 *   çakışmaz. z-index 1002.
 * - Çerez kararı verilene kadar render edilmez (çerez bandı en üstte kalır).
 * - O6: WhatsApp marka yeşili (#25D366) kaldırıldı — dolgu `--color-ink`,
 *   ikon beyaz, boyut 54px → 48px. Sayfadaki en parlak öğe artık üçüncü
 *   taraf marka rengi değil.
 * - Mobilde aşağı kaydırırken gizlenir (o yönde birincil CTA sabit bardır),
 *   yukarı kaydırmada veya sayfa başında geri gelir.
 */
export default function WhatsAppButton() {
  const t = useTranslations("whatsapp");
  const roomTypes = useTranslations("roomTypes");
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const consentResolved = useCookieConsentResolved();
  const reduceMotion = useReducedMotion();

  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const lastY = useRef(0);

  // Rezervasyon akışının canlı bağlamı (adım 2-3'te dolu, aksi halde null).
  const bookingCtx = useSyncExternalStore(
    subscribeBookingContext,
    getBookingContext,
    getServerBookingContext
  );

  useEffect(() => {
    lastY.current = window.scrollY;
    function handleScroll() {
      const y = window.scrollY;
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        setHiddenByScroll(y > lastY.current && y > 120);
      } else {
        setHiddenByScroll(false);
      }
      lastY.current = y;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Öncelik: akış içi store (normal kullanım) → URL query (deep-link).
  const checkIn = bookingCtx?.checkIn ?? searchParams.get("checkIn");
  const checkOut = bookingCtx?.checkOut ?? searchParams.get("checkOut");
  const roomType = bookingCtx
    ? (bookingCtx.roomType ?? null)
    : searchParams.get("roomType");

  let message = t("genericMessage");
  if (checkIn && checkOut) {
    const dates = `${formatDateShort(checkIn, locale)} – ${formatDateShort(checkOut, locale)}`;
    const roomLabel =
      roomType && ROOM_TYPE_LABEL_KEY[roomType] ? roomTypes(ROOM_TYPE_LABEL_KEY[roomType]) : null;
    message = roomLabel
      ? t("contextMessageWithRoom", { dates, room: roomLabel })
      : t("contextMessage", { dates });
  }

  const show =
    !pathname?.startsWith("/admin") && consentResolved && !hiddenByScroll;

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {show && (
          <m.a
            key="whatsapp-fab"
            href={whatsappUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("ariaLabel")}
            onClick={() => trackEvent("whatsapp_click", { path: pathname || "/" })}
            /* K3 sağ sütun satır 1 — bar yüksekliği + güvenli alan + 12px. */
            className="fixed right-4 bottom-[calc(var(--sticky-cta-h)+env(safe-area-inset-bottom,0px)+12px)] z-[1002] grid h-12 w-12 place-items-center rounded-[3px] bg-ink text-white no-underline shadow-[var(--shadow-lift)] transition-colors hover:bg-sea hover:text-white lg:right-6 lg:bottom-6"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{
              duration: reduceMotion ? 0 : 0.18,
              ease: [0.2, 0.7, 0.3, 1],
            }}
          >
            <MessageCircle size={22} strokeWidth={1.75} aria-hidden="true" />
          </m.a>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
