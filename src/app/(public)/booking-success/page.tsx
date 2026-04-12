import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Phone, Mail, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Rezervasyon Başarılı",
  description: "Rezervasyonunuz başarıyla oluşturuldu.",
};

export default function BookingSuccessPage() {
  return (
    <div style={{ paddingTop: "38px" }}>
      <section className="section-py bg-warm min-h-[70vh] flex items-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>

          <h1 className="mb-4" style={{ fontSize: "clamp(26px, 4vw, 42px)" }}>
            Rezervasyonunuz Alındı!
          </h1>

          <p className="text-[16px] text-text leading-relaxed mb-8">
            Rezervasyon detaylarınız e-posta adresinize gönderilmiştir.
            <br />
            <strong className="text-dark">
              Kapora ödemesini 24 saat içinde
            </strong>{" "}
            aşağıdaki IBAN&apos;a yapmanız gerekmektedir. Ödeme onaylandıktan
            sonra rezervasyonunuz kesinleşecektir.
          </p>

          <div className="bg-white border border-border p-8 mb-8 text-left">
            <h3 className="text-[18px] mb-4">Kapora Bilgileri</h3>
            <div className="space-y-3 text-[14px]">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-text-light">Banka</span>
                <span className="font-semibold text-dark">
                  (Otel tarafından belirlenecek)
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-text-light">IBAN</span>
                <span className="font-semibold text-dark font-mono">
                  TR__ ____ ____ ____ ____ ____ __
                </span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-text-light">Alıcı</span>
                <span className="font-semibold text-dark">
                  (Otel tarafından belirlenecek)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-light">Açıklama</span>
                <span className="font-semibold text-gold">
                  Rezervasyon No&apos;nuz
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gold/10 border border-gold/25 p-5 mb-8 text-[14px] text-left">
            <strong className="text-dark block mb-1">Önemli:</strong>
            Havale açıklamasına mutlaka rezervasyon numaranızı yazınız.
            Ödeme onayı e-posta ile bildirilecektir.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/" className="btn-gold">
              <ArrowLeft className="inline w-4 h-4 mr-2" />
              Anasayfaya Dön
            </Link>
            <a href="tel:+905010913417" className="btn-dark-sq">
              <Phone className="inline w-4 h-4 mr-2" />
              Bizi Arayın
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
