import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import PageHero from "@/components/layout/page-hero";
import ReservationLookupForm from "@/components/reservations/reservation-lookup-form";
import { buildAlternates } from "@/i18n/seo";
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
  const t = await getTranslations({ locale: active, namespace: "meta.reservationLookup" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(active, "/rezervasyon-sorgula"),
    // Misafire özel bir sorgu sayfası — arama sonuçlarında yer almamalı.
    robots: { index: false, follow: false },
  };
}

export default async function ReservationLookupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reservationLookup");

  return (
    <>
      <PageHero title={t("hero.title")} breadcrumb={t("hero.eyebrow")} />
      <section className="section-py bg-warm">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-center text-text-light text-[15px] mb-10 max-w-xl mx-auto">
            {t("hero.text")}
          </p>
          <ReservationLookupForm />
        </div>
      </section>
    </>
  );
}
