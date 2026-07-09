import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import PageHero from "@/components/layout/page-hero";
import ContactForm from "@/components/contact-form";
import JsonLd, { contactJsonLd } from "@/components/seo/json-ld";
import { buildAlternates } from "@/i18n/seo";
import { routing, type Locale } from "@/i18n/routing";
import { MapPin, Phone, Mail, Umbrella, Landmark, Ship } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: active, namespace: "meta.contact" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(active, "/contact"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const nearbyPlaces = [
    { icon: Umbrella, key: "beach" },
    { icon: Landmark, key: "assos" },
    { icon: Ship, key: "harbor" },
  ] as const;

  return (
    <>
      <JsonLd data={contactJsonLd(locale as Locale)} />
      <PageHero title={t("hero.title")} breadcrumb={t("hero.breadcrumb")} />

      {/* Contact Cards */}
      <section className="section-sm bg-warm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Address */}
            <div className="contact-info-card">
              <div className="contact-icon">
                <MapPin size={24} className="text-gold transition-colors" />
              </div>
              <h5 className="text-[14px] tracking-wide uppercase mb-2.5">
                {t("cards.addressTitle")}
              </h5>
              <div className="text-[14px] text-text">
                Büyükhusun Köyü Namazgah Mevkii No:26,
                <br />
                Ayvacık, Çanakkale 17860
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-gold no-underline tracking-wide font-semibold"
              >
                {t("cards.addressLink")}
              </a>
            </div>

            {/* Phone */}
            <div className="contact-info-card">
              <div className="contact-icon">
                <Phone size={24} className="text-gold transition-colors" />
              </div>
              <h5 className="text-[14px] tracking-wide uppercase mb-2.5">
                {t("cards.phoneTitle")}
              </h5>
              <div className="text-[14px] text-text">
                <a
                  href="tel:+905010913417"
                  className="font-heading text-[22px] font-bold text-dark no-underline"
                >
                  +90 501 091 34 17
                </a>
              </div>
              <p className="text-[12px] text-text-light -mt-2">{t("cards.phoneSub")}</p>
            </div>

            {/* Email */}
            <div className="contact-info-card">
              <div className="contact-icon">
                <Mail size={24} className="text-gold transition-colors" />
              </div>
              <h5 className="text-[14px] tracking-wide uppercase mb-2.5">
                {t("cards.emailTitle")}
              </h5>
              <div className="text-[14px] text-text">
                <a href="mailto:karaduttas@gmail.com" className="text-dark no-underline">
                  karaduttas@gmail.com
                </a>
              </div>
              <p className="text-[12px] text-text-light -mt-2">{t("cards.emailSub")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
            {/* Form */}
            <div>
              <span className="eyebrow">{t("form.eyebrow")}</span>
              <h2 className="mb-4">{t("form.title")}</h2>
              <p className="text-[14.5px] text-text-light mb-8">{t("form.text")}</p>
              <ContactForm />
            </div>

            {/* Map + Distances */}
            <div>
              <span className="eyebrow">{t("map.eyebrow")}</span>
              <h2 className="mb-4">{t("map.title")}</h2>

              <div className="w-full h-[clamp(260px,32vw,340px)] bg-warm border border-border flex items-center justify-center mb-8">
                <div className="text-center p-6">
                  <MapPin size={28} className="text-gold mx-auto mb-4" />
                  <p className="text-[14px] text-text-light m-0">
                    Büyükhusun Köyü Namazgah Mevkii No:26,
                    <br />
                    Ayvacık, Çanakkale 17860
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold inline-block mt-5 text-[10px] py-2.5 px-5"
                  >
                    {t("map.openMaps")}
                  </a>
                </div>
              </div>

              <div className="location-item">
                <div className="location-num">5&apos;</div>
                <div>
                  <h6 className="text-[14px] font-bold mb-0.5">{t("map.beach")}</h6>
                  <p className="text-[12.5px] text-text-light m-0">{t("map.beachTime")}</p>
                </div>
              </div>
              <div className="location-item">
                <div className="location-num">7&apos;</div>
                <div>
                  <h6 className="text-[14px] font-bold mb-0.5">{t("map.assos")}</h6>
                  <p className="text-[12.5px] text-text-light m-0">{t("map.assosTime")}</p>
                </div>
              </div>
              <div className="location-item">
                <div className="location-num">10&apos;</div>
                <div>
                  <h6 className="text-[14px] font-bold mb-0.5">{t("map.harbor")}</h6>
                  <p className="text-[12.5px] text-text-light m-0">{t("map.harborTime")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby */}
      <section className="section-sm bg-warm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-15">
            <span className="eyebrow">{t("nearby.eyebrow")}</span>
            <h2>{t("nearby.title")}</h2>
            <div className="divider-gold-center" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {nearbyPlaces.map((p, i) => (
              <div key={i} className="amenity-card">
                <div className="amenity-icon">
                  <p.icon size={24} className="text-gold" />
                </div>
                <h5 className="text-[13px] tracking-[1.2px] uppercase mb-2">
                  {t(`nearby.${p.key}.title`)}
                </h5>
                <p className="text-[13px] text-text-light m-0">
                  {t(`nearby.${p.key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
