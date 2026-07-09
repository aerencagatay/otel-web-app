import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import BookingSuccessView from "@/components/booking/booking-success-view";
import { routing, type Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({
    locale: active,
    namespace: "meta.bookingSuccess",
  });
  return {
    title: t("title"),
    description: t("description"),
    // Kişiye özel onay sayfası — arama sonuçlarında yer almamalı.
    robots: { index: false, follow: false },
  };
}

function SuccessFallback({ label }: { label: string }) {
  return (
    <div style={{ paddingTop: "38px" }} className="section-py min-h-[50vh] flex items-center justify-center bg-[var(--color-ivory)]">
      <p className="text-text-light text-[15px]">{label}</p>
    </div>
  );
}

export default async function BookingSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reservation.process");
  return (
    <Suspense fallback={<SuccessFallback label={t("loading")} />}>
      <BookingSuccessView />
    </Suspense>
  );
}
