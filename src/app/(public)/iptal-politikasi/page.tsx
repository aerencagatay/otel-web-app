import type { Metadata } from "next";
import PageHero from "@/components/layout/page-hero";
import { HOTEL, RESERVATION_HOLD_HOURS } from "@/lib/config/hotel";

export const metadata: Metadata = {
  title: "İptal ve İade Politikası",
  description:
    "Assos Karadut Taş Otel iptal ve iade politikası — kapora, iptal süreleri ve mesafeli satış koşulları.",
  alternates: { canonical: "/iptal-politikasi" },
};

export default function IptalPolitikasiPage() {
  return (
    <>
      <PageHero title="İptal ve İade Politikası" breadcrumb="İptal Politikası" />

      <section className="section-py bg-white">
        <div className="max-w-3xl mx-auto px-4 text-[14.5px] text-text leading-[1.9] space-y-8">
          <p className="text-text-light text-[13px]">
            Son güncelleme: [OTEL SAHİBİ ONAYLAYACAK]
          </p>

          <div>
            <h2 className="mb-3">1. Rezervasyon ve Kapora Modeli</h2>
            <p>
              {HOTEL.name} rezervasyonları, web sitesi üzerinden oluşturulan
              bir talep ve ardından yapılan kapora ödemesi ile kesinleşir.
              Rezervasyon talebiniz oluşturulduktan sonra{" "}
              <strong>{RESERVATION_HOLD_HOURS} saat</strong> içinde kapora
              ödemesi yapılmazsa talebiniz otomatik olarak iptal edilir ve
              seçtiğiniz tarihler yeniden müsait hale gelir.
            </p>
          </div>

          <div>
            <h2 className="mb-3">2. İptal Koşulları</h2>
            <p>
              Kaporası ödenerek kesinleşmiş bir rezervasyonun misafir
              tarafından iptal edilmesi durumunda uygulanan koşullar
              aşağıdaki gibidir:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Giriş tarihinden <strong>[OTEL SAHİBİ ONAYLAYACAK] gün önce</strong>{" "}
                yapılan iptallerde kapora tam olarak iade edilir.
              </li>
              <li>
                Bu süreden sonra yapılan iptallerde kapora
                <strong> [OTEL SAHİBİ ONAYLAYACAK]</strong> koşuluna göre kısmen
                veya tamamen iade edilmez.
              </li>
              <li>
                No-show (bildirim yapılmadan gelinmemesi) durumunda kapora
                iade edilmez.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3">3. Otel Kaynaklı İptaller</h2>
            <p>
              Mücbir sebep veya öngörülemeyen bir durum nedeniyle otelin
              rezervasyonu iptal etmesi hâlinde, ödenen kaporanın tamamı
              misafire iade edilir veya misafirin talebi doğrultusunda
              alternatif bir tarihe aktarılır.
            </p>
          </div>

          <div>
            <h2 className="mb-3">4. Mesafeli Satış Sözleşmesi Kapsamında Cayma Hakkı</h2>
            <p>
              6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
              Sözleşmeler Yönetmeliği uyarınca; konaklama hizmetleri belirli
              bir tarihte ifa edilmek üzere sunulan hizmetler kapsamında
              değerlendirilebileceğinden, cayma hakkının kullanım koşulları
              için lütfen ilgili mevzuatı inceleyiniz veya bizimle iletişime
              geçiniz. Kesin koşullar: <strong>[OTEL SAHİBİ ONAYLAYACAK]</strong>.
            </p>
          </div>

          <div>
            <h2 className="mb-3">5. İade Süreci</h2>
            <p>
              Onaylanan iadeler, bildirim tarihinden itibaren
              <strong> [OTEL SAHİBİ ONAYLAYACAK] iş günü</strong> içinde
              kaporanın ödendiği hesaba yapılır.
            </p>
          </div>

          <div>
            <h2 className="mb-3">6. İletişim</h2>
            <p>
              İptal, değişiklik ve iade talepleriniz için lütfen bizi
              telefonla arayın: <a href={`tel:${HOTEL.phone.replace(/\s/g, "")}`} className="text-gold-dark underline">{HOTEL.phone}</a>{" "}
              veya {HOTEL.email} adresine e-posta gönderin.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
