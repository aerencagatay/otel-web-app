import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/page-hero";
import { HOTEL } from "@/lib/config/hotel";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "Assos Karadut Taş Otel gizlilik politikası — web sitesi çerez kullanımı, veri güvenliği ve üçüncü taraf hizmetler hakkında bilgi.",
  alternates: { canonical: "/gizlilik" },
};

export default function GizlilikPage() {
  return (
    <>
      <PageHero title="Gizlilik Politikası" breadcrumb="Gizlilik" />

      <section className="section-py bg-white">
        <div className="max-w-3xl mx-auto px-4 text-[14.5px] text-text leading-[1.9] space-y-8">
          <p className="text-text-light text-[13px]">
            Son güncelleme: [OTEL SAHİBİ ONAYLAYACAK]
          </p>

          <div>
            <h2 className="mb-3">1. Genel</h2>
            <p>
              Bu gizlilik politikası, {HOTEL.name} web sitesini
              (&quot;Site&quot;) kullanımınız sırasında toplanan bilgilerin nasıl
              işlendiğini açıklar. Kişisel verilerin işlenmesine ilişkin
              detaylı bilgi için{" "}
              <Link href="/kvkk" className="text-gold-dark underline">
                KVKK Aydınlatma Metni&apos;ne
              </Link>{" "}
              bakınız.
            </p>
          </div>

          <div>
            <h2 className="mb-3">2. Çerezler</h2>
            <p>
              Site, temel işlevsellik için zorunlu çerezler kullanabilir.
              Analitik/pazarlama amaçlı çerezler yalnızca sayfanın alt
              kısmındaki çerez bandından onay verdiğiniz takdirde
              etkinleştirilir. Tercihinizi tarayıcınızda saklanan
              yerel depolama (localStorage) aracılığıyla değiştirebilirsiniz.
            </p>
          </div>

          <div>
            <h2 className="mb-3">3. Toplanan Bilgiler</h2>
            <p>
              Rezervasyon ve iletişim formları aracılığıyla gönderdiğiniz ad,
              e-posta, telefon ve mesaj içerikleri; ayrıca sayfa
              görüntülemeleri gibi anonim kullanım istatistikleri (analitik
              etkinse) toplanabilir.
            </p>
          </div>

          <div>
            <h2 className="mb-3">4. Veri Güvenliği</h2>
            <p>
              Verileriniz, yetkisiz erişime karşı makul teknik ve idari
              tedbirlerle korunur. İletişim formu ve rezervasyon sistemi
              güvenlik doğrulaması (Cloudflare Turnstile) ve istek sınırlama
              (rate limiting) ile spam ve kötüye kullanıma karşı korunur.
            </p>
          </div>

          <div>
            <h2 className="mb-3">5. Üçüncü Taraf Hizmetler</h2>
            <p>
              E-posta gönderimi ve rezervasyon altyapısı için üçüncü taraf
              hizmet sağlayıcılar kullanılmaktadır. Bu sağlayıcılar
              verilerinizi yalnızca hizmetin ifası amacıyla işler.
              [OTEL SAHİBİ ONAYLAYACAK — kullanılan sağlayıcıların güncel listesi]
            </p>
          </div>

          <div>
            <h2 className="mb-3">6. İletişim</h2>
            <p>
              Bu politika hakkında sorularınız için {HOTEL.email} adresinden
              bize ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
