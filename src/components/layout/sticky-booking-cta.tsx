"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { CalendarPlus } from "lucide-react";

const HIDE_ON = new Set([
  "/reservation",
  "/admin",
  "/admin/login",
  "/booking-success",
]);

export default function StickyBookingCta() {
  const t = useTranslations("stickyCta");
  const pathname = usePathname();
  if (!pathname || pathname.startsWith("/admin")) return null;
  if (HIDE_ON.has(pathname)) return null;

  return (
    <div className="sticky-book-cta items-center justify-center">
      <Link
        href="/reservation"
        className="sticky-book-cta__btn no-underline"
      >
        <CalendarPlus size={17} strokeWidth={1.75} />
        {t("label")}
      </Link>
    </div>
  );
}
