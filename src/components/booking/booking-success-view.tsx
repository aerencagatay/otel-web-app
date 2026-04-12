"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Phone, ArrowLeft, Mail, Clock } from "lucide-react";

export default function BookingSuccessView() {
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
              Talep alındı
            </span>
            <h1
              className="font-heading font-semibold text-dark mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.35rem)" }}
            >
              Rezervasyonunuz oluşturuldu
            </h1>

            {id && (
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-border bg-warm rounded-sm">
                <Clock size={16} className="text-gold-dark" />
                <span className="text-[11px] tracking-[0.12em] uppercase text-text-light">
                  No
                </span>
                <span className="font-mono text-[15px] font-semibold text-dark">{id}</span>
              </div>
            )}

            <div className="text-left border border-amber-900/15 bg-amber-50/80 px-5 py-4 rounded-sm mb-6">
              <p className="text-[11px] tracking-[0.2em] uppercase font-semibold text-amber-900/80 m-0 mb-2">
                Kapora bekleniyor
              </p>
              <p className="text-[14px] text-text m-0 leading-relaxed">
                Rezervasyonunuz <strong className="text-dark">kapora ödemesi onaylanana kadar</strong>{" "}
                kesin değildir. Ödeme onaylandığında e-posta ile bilgilendirileceksiniz.
              </p>
            </div>

            <p className="text-[15px] text-text leading-relaxed mb-8 text-left">
              Özet ve talimatlar e-posta adresinize gönderilmiştir.{" "}
              <strong className="text-dark">24 saat içinde</strong> aşağıdaki IBAN&apos;a kapora
              göndermeniz gerekir. Havale açıklamasına rezervasyon numaranızı yazın.
            </p>

            <div className="text-left border border-border bg-white/80 p-6 mb-6 rounded-sm">
              <h3 className="font-heading text-lg font-semibold text-dark m-0 mb-4">
                Kapora bilgileri
              </h3>
              <div className="space-y-3 text-[14px]">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-border pb-2">
                  <span className="text-text-light">Banka</span>
                  <span className="font-medium text-dark">(Otel tarafından güncellenecek)</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-border pb-2">
                  <span className="text-text-light">IBAN</span>
                  <span className="font-mono font-medium text-dark text-[13px]">
                    TR__ ____ ____ ____ ____ ____ __
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-border pb-2">
                  <span className="text-text-light">Alıcı</span>
                  <span className="font-medium text-dark">(Otel tarafından güncellenecek)</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-text-light">Açıklama</span>
                  <span className="font-semibold text-gold-dark">Rezervasyon numaranız</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <Link href="/" className="btn-gold text-center no-underline inline-flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Anasayfa
              </Link>
              <a
                href="tel:+905010913417"
                className="btn-dark-sq text-center no-underline inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Bizi arayın
              </a>
            </div>

            <p className="text-[12px] text-text-light mt-8 mb-0 flex items-center justify-center gap-2">
              <Mail size={14} />
              E-postanızı kontrol edin; göremiyorsanız spam klasörüne bakın.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
