import type { Metadata } from "next";
import PageHero from "@/components/layout/page-hero";
import { HOTEL } from "@/lib/config/hotel";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "Assos Karadut Taş Otel KVKK Aydınlatma Metni — kişisel verilerin işlenmesi, amaç, saklama süresi ve ilgili kişi hakları.",
  alternates: { canonical: "/kvkk" },
};

export default function KvkkPage() {
  return (
    <>
      <PageHero title="KVKK Aydınlatma Metni" breadcrumb="KVKK" />

      <section className="section-py bg-white">
        <div className="max-w-3xl mx-auto px-4 text-[14.5px] text-text leading-[1.9] space-y-8">
          <p className="text-text-light text-[13px]">
            Son güncelleme: [OTEL SAHİBİ ONAYLAYACAK]
          </p>

          <div>
            <h2 className="mb-3">1. Veri Sorumlusu</h2>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca,
              kişisel verileriniz veri sorumlusu sıfatıyla{" "}
              <strong>{HOTEL.name}</strong> (&quot;Otel&quot;) tarafından aşağıda
              açıklanan kapsamda işlenebilecektir.
            </p>
            <p>
              Adres: {HOTEL.address}
              <br />
              E-posta: {HOTEL.email}
              <br />
              Telefon: {HOTEL.phone}
              <br />
              Mersis / Vergi No: [OTEL SAHİBİ ONAYLAYACAK]
            </p>
          </div>

          <div>
            <h2 className="mb-3">2. İşlenen Kişisel Veriler</h2>
            <p>
              Rezervasyon, iletişim formu ve konaklama süreçleriniz kapsamında;
              ad-soyad, telefon numarası, e-posta adresi, konaklama tarihleri,
              misafir sayısı ve talep/şikayet içerikleriniz gibi kişisel
              verileriniz işlenmektedir.
            </p>
          </div>

          <div>
            <h2 className="mb-3">3. Kişisel Verilerin İşlenme Amacı</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Rezervasyon taleplerinin oluşturulması ve yönetilmesi</li>
              <li>Kapora/ödeme süreçlerinin takibi</li>
              <li>İletişim formu ve talepler üzerinden geri dönüş yapılması</li>
              <li>Yasal yükümlülüklerin (konaklama vergisi, resmi bildirimler vb.) yerine getirilmesi</li>
              <li>Hizmet kalitesinin ölçülmesi ve iyileştirilmesi</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3">4. Kişisel Verilerin Aktarılması</h2>
            <p>
              Kişisel verileriniz, yasal yükümlülüklerimiz gereği yetkili kamu
              kurum ve kuruluşları ile; rezervasyon ve e-posta altyapımızı
              sağlayan hizmet sağlayıcılarımıza (sunucu/e-posta/ödeme altyapı
              sağlayıcıları) yalnızca hizmetin ifası amacıyla sınırlı olarak
              aktarılabilir. Verileriniz yurt dışına aktarılmaz; aktarım
              gerektiren bir altyapı kullanılması hâlinde bu metin
              güncellenecektir. [OTEL SAHİBİ ONAYLAYACAK]
            </p>
          </div>

          <div>
            <h2 className="mb-3">5. Saklama Süresi</h2>
            <p>
              Kişisel verileriniz, ilgili mevzuatta öngörülen süreler
              (örn. vergi ve muhasebe mevzuatı kapsamında konaklama
              kayıtları) boyunca veya işleme amacının gerektirdiği süre
              boyunca saklanır. Kesin saklama süreleri:{" "}
              <strong>[OTEL SAHİBİ ONAYLAYACAK]</strong>.
            </p>
          </div>

          <div>
            <h2 className="mb-3">6. KVKK Kapsamındaki Haklarınız</h2>
            <p>KVKK&apos;nın 11. maddesi uyarınca herkes, veri sorumlusuna başvurarak kendisiyle ilgili;</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Kişisel veri işlenip işlenmediğini öğrenme,</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li>Yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
              <li>Eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
              <li>KVKK&apos;nın 7. maddesindeki şartlar çerçevesinde silinmesini/yok edilmesini isteme,</li>
              <li>Düzeltme/silme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme,</li>
              <li>İşlenen verilerin münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhine bir sonucun ortaya çıkmasına itiraz etme,</li>
              <li>Kanuna aykırı işleme nedeniyle zarara uğraması hâlinde zararın giderilmesini talep etme haklarına sahiptir.</li>
            </ul>
            <p>
              Bu haklarınızı kullanmak için taleplerinizi {HOTEL.email} adresine
              veya yukarıdaki posta adresine iletebilirsiniz.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
