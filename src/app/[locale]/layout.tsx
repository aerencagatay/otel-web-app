import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import JsonLd, { hotelJsonLd } from "@/components/seo/json-ld";
import CookieBanner from "@/components/layout/cookie-banner";
import { fontVariables } from "@/lib/fonts";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const OG_LOCALE: Record<Locale, string> = { tr: "tr_TR", en: "en_US" };
const OG_ALTERNATE: Record<Locale, string> = { tr: "en_US", en: "tr_TR" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: activeLocale, namespace: "meta" });

  // TR kök URL'de önek yok; EN /en altında. canonical + hreflang alternates.
  const path = activeLocale === "tr" ? "/" : "/en";

  return {
    title: {
      default: t("home.title"),
      template: t("titleTemplate"),
    },
    description: t("home.description"),
    alternates: {
      canonical: path,
      languages: {
        tr: "/",
        en: "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[activeLocale],
      alternateLocale: OG_ALTERNATE[activeLocale],
      siteName: "Assos Karadut Taş Otel",
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og.jpg"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Statik render için aktif locale'i bu istek bağlamına sabitle.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={fontVariables}>
      <body>
        <JsonLd data={hotelJsonLd(locale)} />
        <NextIntlClientProvider>
          {children}
          <CookieBanner />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
