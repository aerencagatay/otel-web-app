import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
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
  const t = await getTranslations({ locale: active, namespace: "meta.gizlilik" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(active, "/gizlilik"),
  };
}

export default async function GizlilikPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.gizlilik");

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
                hotelName: HOTEL.name,
                kvkkLink: (chunks) => (
                  <Link href="/kvkk" className="text-gold-dark underline">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>

          <div>
            <h2 className="mb-3">{t("s2.h")}</h2>
            <p>{t("s2.p")}</p>
          </div>

          <div>
            <h2 className="mb-3">{t("s3.h")}</h2>
            <p>{t("s3.p")}</p>
          </div>

          <div>
            <h2 className="mb-3">{t("s4.h")}</h2>
            <p>{t("s4.p")}</p>
          </div>

          <div>
            <h2 className="mb-3">{t("s5.h")}</h2>
            <p>{t("s5.p")}</p>
          </div>

          <div>
            <h2 className="mb-3">{t("s6.h")}</h2>
            <p>{t("s6.p", { email: HOTEL.email })}</p>
          </div>
        </div>
      </section>
    </>
  );
}
