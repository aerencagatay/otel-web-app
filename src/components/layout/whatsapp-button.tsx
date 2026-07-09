"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/config/whatsapp";
import { trackEvent } from "@/lib/analytics";

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
 * flow has dates/room in the URL (deep-link prefill or an in-progress
 * search), the pre-filled message is parameterized with that context so the
 * hotel gets a useful lead instead of a blank "hi" message.
 *
 * Position/behavior notes (Task 05):
 * - Sits bottom-right, clear of `back-to-top` (which only appears after
 *   scrolling and sits lower) and, on mobile, lifted above the sticky
 *   reserve CTA bar.
 * - On mobile it hides while the user is actively scrolling down (the
 *   sticky reserve bar is the primary CTA in that direction) and reappears
 *   on scroll-up or near the top, so the two floating CTAs never visually
 *   compete for the same swipe gesture.
 */
export default function WhatsAppButton() {
  const t = useTranslations("whatsapp");
  const roomTypes = useTranslations("roomTypes");
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    function handleScroll() {
      const y = window.scrollY;
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        setHidden(y > lastY.current && y > 120);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const roomType = searchParams.get("roomType");

  let message = t("genericMessage");
  if (checkIn && checkOut) {
    const dates = `${formatDateShort(checkIn, locale)} – ${formatDateShort(checkOut, locale)}`;
    const roomLabel =
      roomType && ROOM_TYPE_LABEL_KEY[roomType] ? roomTypes(ROOM_TYPE_LABEL_KEY[roomType]) : null;
    message = roomLabel
      ? t("contextMessageWithRoom", { dates, room: roomLabel })
      : t("contextMessage", { dates });
  }

  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`whatsapp-fab ${hidden ? "whatsapp-fab--hidden" : ""}`}
      aria-label={t("ariaLabel")}
      onClick={() => trackEvent("whatsapp_click", { path: pathname || "/" })}
    >
      <MessageCircle size={26} strokeWidth={1.75} />
    </a>
  );
}
