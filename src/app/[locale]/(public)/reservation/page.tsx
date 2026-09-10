import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import BookingFlow from "@/components/booking/booking-flow";
import { RESERVATION_HOLD_HOURS } from "@/lib/config/hotel";
import { buildAlternates } from "@/i18n/seo";
import { routing, type Locale } from "@/i18n/routing";
import { Phone, Mail, Clock, CalendarCheck, LogIn, Ban, Baby } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: active, namespace: "meta.reservation" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(active, "/reservation"),
  };
}

export default async function ReservationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reservation");

  /* `steps` dizisi kaldırıldı: onu render eden açıklama kartları bloğu
     O7 gereği çıkarıldı (BookingFlow zaten fonksiyonel adım göstergesi
     çiziyor). İlgili çeviri anahtarları messages/*.json içinde duruyor;
     ileride süreç anlatımı geri istenirse hazır. */

  return (
    <>
      {/* Hero */}
      <div>
        <div className="res-hero relative z-[1]">
          <div className="max-w-7xl mx-auto px-4">
            <h1
              className="text-white mb-4 font-heading font-semibold tracking-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
            >
              {t("hero.titleLine1")}
              <br className="hidden sm:block" />
              <span className="text-white/85 font-normal italic"> {t("hero.titleLine2")}</span>
            </h1>
            <p className="text-white/70 text-[15px] max-w-[540px] mx-auto mb-2 leading-relaxed">
              {t("hero.lede")}
            </p>
          </div>
        </div>
      </div>

      {/* Booking Flow */}
      <section className="section-py bg-warm">
        <div className="max-w-7xl mx-auto px-4">
          {/* BULGU O7: Buradaki 3 numaralı açıklama kartı bloğu KALDIRILDI.
              Hemen altındaki BookingFlow zaten kendi fonksiyonel adım
              göstergesini (1. Tarih & misafir / 2. Oda seçimi / 3. Bilgiler
              & onay) çiziyordu; aynı üç adım arka arkaya iki kez
              anlatılıyor ve asıl aksiyon (tarih formu) 1440px'de ~630px
              derinliğe itiliyordu. Fonksiyonel gösterge kaldı çünkü
              kullanıcının nerede olduğunu söylüyor — yani bilgi taşıyor;
              açıklayıcı kartlar taşımıyordu. Süreç anlatımı SSS
              bölümündeki "Rezervasyonum ne zaman kesinleşir?" maddesinde
              zaten mevcut. */}
          <div className="measure mb-10">
            <h2 className="mb-3">{t("process.title")}</h2>
            <p className="type-lede m-0">{t("process.text")}</p>
          </div>

          <Suspense
            fallback={
              <div className="state-surface state-surface--muted py-20">
                <p className="text-text-light m-0">{t("process.loading")}</p>
              </div>
            }
          >
            <BookingFlow />
          </Suspense>
        </div>
      </section>

      {/* Conditions + Contact */}
      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <h2 className="mb-4">
                {t("conditions.titleLine1")}
                <br />
                {t("conditions.titleLine2")}
              </h2>
              <div className="info-box">
                <strong>
                  <CalendarCheck className="inline w-4 h-4 mr-2 text-gold" />
                  {t("conditions.earlyTitle")}
                </strong>
                {t("conditions.earlyText")}
              </div>
              <div className="info-box whitespace-pre-line">
                <strong>
                  <LogIn className="inline w-4 h-4 mr-2 text-gold" />
                  {t("conditions.hoursTitle")}
                </strong>
                {t("conditions.hoursText")}
              </div>
              <div className="info-box">
                <strong>
                  <Ban className="inline w-4 h-4 mr-2 text-gold" />
                  {t("conditions.cancelTitle")}
                </strong>
                {t("conditions.cancelText")}
              </div>
              <div className="info-box">
                <strong>
                  <Baby className="inline w-4 h-4 mr-2 text-gold" />
                  {t("conditions.childTitle")}
                </strong>
                {t("conditions.childText")}
              </div>
            </div>

            <div className="bg-dark p-10 md:p-12 text-white">
              <span className="eyebrow text-gold-light">{t("contactBox.eyebrow")}</span>
              <h3 className="text-white mb-5">{t("contactBox.title")}</h3>
              <p className="text-white/65 text-[14.5px] mb-8">{t("contactBox.text")}</p>

              <div className="flex items-center gap-4 py-4 border-b border-white/10">
                <Phone size={18} className="text-gold-light shrink-0" />
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-white/45 mb-1">
                    {t("contactBox.phone")}
                  </div>
                  <a
                    href="tel:+905010913417"
                    className="font-heading text-[24px] text-gold no-underline font-bold"
                  >
                    +90 501 091 34 17
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 py-4 border-b border-white/10">
                <Mail size={18} className="text-gold-light shrink-0" />
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-white/45 mb-1">
                    {t("contactBox.email")}
                  </div>
                  <a
                    href="mailto:karaduttas@gmail.com"
                    className="text-[15px] text-white/80 no-underline"
                  >
                    karaduttas@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 py-4">
                <Clock size={18} className="text-gold-light shrink-0" />
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-white/45 mb-1">
                    {t("contactBox.hours")}
                  </div>
                  <span className="text-[15px] text-white/80">
                    {t("contactBox.hoursValue")}
                  </span>
                </div>
              </div>

              <hr className="border-white/10 mt-8 mb-8" />
              <a
                href="tel:+905010913417"
                className="btn-gold w-full text-center block"
              >
                <Phone className="inline w-4 h-4 mr-2" />
                {t("contactBox.callNow")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-sm bg-warm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-15">
            <h2>{t("faq.title")}</h2>
            <div className="divider-gold-center" />
          </div>
          <div className="max-w-3xl mx-auto">
            <FaqAccordion
              faqs={[
                { q: t("faq.q1"), a: t("faq.a1") },
                { q: t("faq.q2"), a: t("faq.a2") },
                { q: t("faq.q3"), a: t("faq.a3") },
                { q: t("faq.q4"), a: t("faq.a4", { hours: RESERVATION_HOLD_HOURS }) },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <details key={i} className="border-b border-border group">
          <summary className="cursor-pointer py-5 text-[14px] font-semibold text-dark list-none flex justify-between items-center gap-4">
            {faq.q}
            <span className="text-gold ml-4 transition-transform group-open:rotate-45 text-xl shrink-0">
              +
            </span>
          </summary>
          <div className="pb-5 text-[14px] text-text-light leading-relaxed">{faq.a}</div>
        </details>
      ))}
    </div>
  );
}
