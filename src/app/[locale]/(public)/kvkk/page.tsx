import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import PageHero from "@/components/layout/page-hero";
import { HOTEL } from "@/lib/config/hotel";
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
  const t = await getTranslations({ locale: active, namespace: "meta.kvkk" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(active, "/kvkk"),
  };
}

export default async function KvkkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.kvkk");

  const purposeItems = [1, 2, 3, 4, 5] as const;
  const rightsItems = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

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
              })}
            </p>
            <p>
              {t("s1.address")}: {HOTEL.address}
              <br />
              {t("s1.email")}: {HOTEL.email}
              <br />
              {t("s1.phone")}: {HOTEL.phone}
              <br />
              {t("s1.mersis")}
            </p>
          </div>

          <div>
            <h2 className="mb-3">{t("s2.h")}</h2>
            <p>{t("s2.p")}</p>
          </div>

          <div>
            <h2 className="mb-3">{t("s3.h")}</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              {purposeItems.map((i) => (
                <li key={i}>{t(`s3.items.${i}`)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3">{t("s4.h")}</h2>
            <p>{t("s4.p")}</p>
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
            <p>{t("s6.intro")}</p>
            <ul className="list-disc pl-5 space-y-1.5">
              {rightsItems.map((i) => (
                <li key={i}>{t(`s6.items.${i}`)}</li>
              ))}
            </ul>
            <p>{t("s6.outro", { email: HOTEL.email })}</p>
          </div>
        </div>
      </section>
    </>
  );
}
