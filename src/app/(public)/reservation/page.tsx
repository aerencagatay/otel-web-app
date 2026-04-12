import type { Metadata } from "next";
import Link from "next/link";
import BookingFlow from "@/components/booking/booking-flow";
import {
  Phone,
  Mail,
  Clock,
  CalendarCheck,
  LogIn,
  Ban,
  Baby,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Rezervasyon",
  description:
    "Assos Karadut Taş Otel online rezervasyon. Tarih seçin, müsaitliği kontrol edin ve kolayca rezervasyon yapın.",
};

export default function ReservationPage() {
  return (
    <>
      {/* Hero */}
      <div style={{ paddingTop: "38px" }}>
        <div className="res-hero">
          <div className="max-w-7xl mx-auto px-4">
            <span className="eyebrow text-gold-light">Online Rezervasyon</span>
            <h1
              className="text-white mb-4"
              style={{ fontSize: "clamp(32px, 5vw, 60px)" }}
            >
              Online Rezervasyon Yapın
            </h1>
            <p className="text-white/65 text-[15px] max-w-[520px] mx-auto mb-9">
              Tarih ve oda tipinizi seçin, müsaitliği kontrol edin.
              Kapora ödemenizi tamamlayarak rezervasyonunuzu kesinleştirin.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Flow */}
      <section className="section-py bg-warm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-15">
            <span className="eyebrow">Süreç</span>
            <h2>Nasıl Rezervasyon Yapılır?</h2>
            <div className="divider-gold-center" />
            <p className="text-text-light text-[15px]">
              3 basit adımda rezervasyonunuzu tamamlayın.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {[
              {
                num: 1,
                title: "Tarih & Oda Seçin",
                desc: "Giriş-çıkış tarihinizi ve oda tipini belirleyin. Müsaitliği anında görün.",
              },
              {
                num: 2,
                title: "Bilgilerinizi Girin",
                desc: "Ad, soyad, telefon ve e-posta bilgilerinizi doldurun.",
              },
              {
                num: 3,
                title: "Kapora Ödeyip Onaylayın",
                desc: "IBAN'a kapora ödemesi yapın. Admin onayı ile rezervasyonunuz kesinleşir.",
              },
            ].map((step) => (
              <div key={step.num} className="step-card">
                <div className="step-number">{step.num}</div>
                <h5 className="text-[16px] mb-2.5">{step.title}</h5>
                <p className="text-[13.5px] text-text-light m-0">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Booking form component */}
          <BookingFlow />
        </div>
      </section>

      {/* Conditions + Contact */}
      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <span className="eyebrow">Bilmeniz Gerekenler</span>
              <h2 className="mb-4">
                Rezervasyon
                <br />
                Koşulları
              </h2>
              <div className="info-box">
                <strong>
                  <CalendarCheck className="inline w-4 h-4 mr-2 text-gold" />
                  Erken Rezervasyon
                </strong>
                Yaz sezonunda odalar hızla doluyor. Yerinizi garantilemek için
                önceden rezervasyon yapın.
              </div>
              <div className="info-box">
                <strong>
                  <LogIn className="inline w-4 h-4 mr-2 text-gold" />
                  Giriş / Çıkış Saatleri
                </strong>
                Check-in: 14:00 · Check-out: 12:00
                <br />
                Erken giriş ve geç çıkış için müsaitlik durumuna göre destek
                sağlanır.
              </div>
              <div className="info-box">
                <strong>
                  <Ban className="inline w-4 h-4 mr-2 text-gold" />
                  İptal Politikası
                </strong>
                Kapora ödemesi yapıldıktan sonra iptal ve değişiklik koşulları
                için bizi arayın.
              </div>
              <div className="info-box">
                <strong>
                  <Baby className="inline w-4 h-4 mr-2 text-gold" />
                  Çocuk Politikası
                </strong>
                0-6 yaş arası çocuklar ücretsiz. 7-12 yaş arası için ayrı
                fiyatlandırma uygulanabilir.
              </div>
            </div>

            <div className="bg-dark p-10 md:p-12 text-white">
              <span className="eyebrow text-gold-light">Anında Ulaşın</span>
              <h3 className="text-white mb-5">Sorularınız mı var?</h3>
              <p className="text-white/65 text-[14.5px] mb-8">
                Oda müsaitliği, fiyat bilgisi, otel olanakları veya çevre
                hakkında aklınıza takılan her şeyi sormaktan çekinmeyin.
              </p>

              {[
                {
                  icon: Phone,
                  label: "Telefon",
                  content: (
                    <a
                      href="tel:+905010913417"
                      className="font-heading text-[24px] text-gold no-underline font-bold"
                    >
                      +90 501 091 34 17
                    </a>
                  ),
                },
                {
                  icon: Mail,
                  label: "E-posta",
                  content: (
                    <a
                      href="mailto:karaduttas@gmail.com"
                      className="text-[15px] text-white/80 no-underline"
                    >
                      karaduttas@gmail.com
                    </a>
                  ),
                },
                {
                  icon: Clock,
                  label: "Hizmet Saatleri",
                  content: (
                    <span className="text-[15px] text-white/80">
                      7 gün 24 saat
                    </span>
                  ),
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-4">
                  <div className="w-[52px] h-[52px] bg-gold/15 rounded-full flex items-center justify-center shrink-0">
                    <item.icon size={20} className="text-gold" />
                  </div>
                  <div>
                    <div className="text-[11px] tracking-[2px] uppercase text-white/50 mb-1">
                      {item.label}
                    </div>
                    {item.content}
                  </div>
                </div>
              ))}

              <hr className="border-white/10 my-8" />
              <a
                href="tel:+905010913417"
                className="btn-gold w-full text-center block"
              >
                <Phone className="inline w-4 h-4 mr-2" />
                Şimdi Ara
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-sm bg-warm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-15">
            <span className="eyebrow">SSS</span>
            <h2>Sık Sorulan Sorular</h2>
            <div className="divider-gold-center" />
          </div>
          <div className="max-w-3xl mx-auto">
            <FaqAccordion />
          </div>
        </div>
      </section>
    </>
  );
}

function FaqAccordion() {
  const faqs = [
    {
      q: "Kahvaltı dahil mi?",
      a: "Evet, fiyatlarımıza sabah kahvaltısı dahildir. Her gün taze hazırlanan açık büfe kahvaltımız misafirlerimize sunulmaktadır.",
    },
    {
      q: "Evcil hayvan getirebilir miyim?",
      a: "Evet, otelimiz evcil hayvan dostudur. Ek bilgi için lütfen rezervasyon sırasında belirtin.",
    },
    {
      q: "Otopark ücretsiz mi?",
      a: "Evet, misafirlerimize özel ücretsiz otopark alanımız mevcuttur.",
    },
    {
      q: "Denize/plaja ne kadar yakınsınız?",
      a: "Kadırga Plajı'na yaklaşık 5 dakika, Assos Limanı'na ise 10 dakika mesafedeyiz. Araçla kolayca ulaşabilirsiniz.",
    },
    {
      q: "Kapora ne zaman ödenmeli?",
      a: "Rezervasyon oluşturduktan sonra 24 saat içinde kapora ödemesini IBAN'a yapmanız beklenir. Ödeme onaylandıktan sonra rezervasyonunuz kesinleşir.",
    },
  ];

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <details
          key={i}
          className="border-b border-border group"
        >
          <summary className="cursor-pointer py-4 text-[14px] font-semibold text-dark list-none flex justify-between items-center">
            {faq.q}
            <span className="text-gold ml-4 transition-transform group-open:rotate-45 text-xl">
              +
            </span>
          </summary>
          <div className="pb-4 text-[14px] text-text-light">{faq.a}</div>
        </details>
      ))}
    </div>
  );
}
