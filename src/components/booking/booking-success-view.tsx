"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, Phone, ArrowLeft, Mail, Clock } from "lucide-react";
import { HOTEL } from "@/lib/config/hotel";

export default function BookingSuccessView() {
  const t = useTranslations("bookingSuccess");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div style={{ paddingTop: "38px" }}>
      <section className="section-py min-h-[72vh] flex items-center bg-[var(--color-ivory)]">
        <div className="max-w-lg mx-auto px-4 w-full">
          <div className="premium-trip-card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark/5 mb-6">
              <CheckCircle2 size={34} className="text-gold-dark" strokeWidth={1.25} />
            </div>

            <span className="inline-block text-[10px] tracking-[0.28em] uppercase font-semibold text-gold-dark mb-3">
              {t("badge")}
            </span>
            <h1
              className="font-heading font-semibold text-dark mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.35rem)" }}
            >
              {t("title")}
            </h1>

            {id && (
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-border bg-warm rounded-[var(--radius-sm)]">
                <Clock size={16} className="text-gold-dark" />
                <span className="text-[11px] tracking-[0.12em] uppercase text-text-light">
                  {t("reservationNo")}
                </span>
                <span className="font-mono text-[15px] font-semibold text-dark">{id}</span>
              </div>
            )}

            <div className="text-left border border-amber-900/15 bg-amber-50/80 px-5 py-4 rounded-[var(--radius-sm)] mb-6">
              <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-amber-900/80 m-0 mb-2">
                {t("confirmPendingLabel")}
              </p>
              <p className="text-[14px] text-text m-0 leading-relaxed">
                {t.rich("confirmPendingText", {
                  strong: (chunks) => <strong className="text-dark">{chunks}</strong>,
                })}
              </p>
            </div>

            <p className="text-[15px] text-text leading-relaxed mb-8 text-left">
              {t("instructions1")} {t("instructions2")}
            </p>

            <div className="text-left border border-border bg-white/80 p-6 mb-6 rounded-[var(--radius-sm)]">
              <h3 className="font-heading text-lg font-semibold text-dark m-0 mb-4">
                {t("contactTitle")}
              </h3>
              <div className="space-y-3 text-[14px]">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-border pb-2">
                  <span className="text-text-light">{t("phoneLabel")}</span>
                  <a
                    href={`tel:${HOTEL.phone.replace(/\s/g, "")}`}
                    className="font-medium text-dark"
                  >
                    {HOTEL.phone}
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-text-light">{t("emailLabel")}</span>
                  <a href={`mailto:${HOTEL.email}`} className="font-medium text-dark">
                    {HOTEL.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <Link href="/" className="btn-gold text-center no-underline inline-flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t("home")}
              </Link>
              <a
                href="tel:+905010913417"
                className="btn-dark-sq text-center no-underline inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                {t("callUs")}
              </a>
            </div>

            <p className="text-[12px] text-text-light mt-8 mb-0 flex items-center justify-center gap-2">
              <Mail size={14} />
              {t("checkEmail")}
            </p>

            <p className="text-[12px] text-text-light mt-3 mb-0">
              <Link href="/rezervasyon-sorgula" className="text-gold-dark underline underline-offset-4">
                {t("lookupLink")}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
