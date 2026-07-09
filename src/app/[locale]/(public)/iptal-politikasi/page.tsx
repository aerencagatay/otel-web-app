import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import PageHero from "@/components/layout/page-hero";
import { HOTEL, RESERVATION_HOLD_HOURS } from "@/lib/config/hotel";
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
  const t = await getTranslations({ locale: active, namespace: "meta.iptal" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(active, "/iptal-politikasi"),
  };
}

export default async function IptalPolitikasiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.iptal");

  return (
    <>
      <PageHero title={t("heroTitle")} breadcrumb={t("breadcrumb")} />

      <section className="section-py bg-white">
        <div className="max-w-3xl mx-auto px-4 text-[14.5px] text-text leading-[1.9] space-y-8">
          <p className="text-text-light text-[13px]">{t("lastUpdated")}</p>

          <div>
            <h2 className="mb-3">{t("s1.h")}</h2>
            <p>
              {t.rich("s1.p", {
                strong: (chunks) => <strong>{chunks}</strong>,
                hotelName: HOTEL.name,
                hours: RESERVATION_HOLD_HOURS,
              })}
            </p>
          </div>

          <div>
            <h2 className="mb-3">{t("s2.h")}</h2>
            <p>{t("s2.intro")}</p>
            <ul className="list-disc pl-5 space-y-1.5">
              {([1, 2, 3] as const).map((i) => (
                <li key={i}>
                  {t.rich(`s2.items.${i}`, {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3">{t("s3.h")}</h2>
            <p>{t("s3.p")}</p>
          </div>

          <div>
            <h2 className="mb-3">{t("s4.h")}</h2>
            <p>
              {t.rich("s4.p", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>

          <div>
            <h2 className="mb-3">{t("s5.h")}</h2>
            <p>
              {t.rich("s5.p", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>

          <div>
            <h2 className="mb-3">{t("s6.h")}</h2>
            <p>
              {t.rich("s6.p", {
                email: HOTEL.email,
                phoneLink: (chunks) => (
                  <a
                    href={`tel:${HOTEL.phone.replace(/\s/g, "")}`}
                    className="text-gold-dark underline"
                  >
                    {chunks}
                  </a>
                ),
                phone: HOTEL.phone,
              })}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
