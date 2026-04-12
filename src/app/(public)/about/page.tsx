import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/layout/page-hero";
import {
  Heart,
  Eye,
  Award,
  Waves,
  UtensilsCrossed,
  Wine,
  Coffee,
  Flame,
  CarFront,
  Wifi,
  Umbrella,
  Landmark,
  Ship,
  TreePine,
  Droplets,
  Anchor,
  Star,
  Sparkles,
  MapPin,
  BellRing,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Assos Karadut Taş Otel hakkında bilgi edinin. 34 oda, A La Carte restoran, açık havuz, Kadırga Koyu'na 5 km. 9.6/10 misafir puanı.",
};

const ratingStats = [
  { label: "ZenHotels · Olağanüstü", value: "9.6" },
  { label: "TripAdvisor Puanı", value: "5/5" },
  { label: "Büyükhusun'da Sıralama", value: "#2" },
  { label: "Özenle Tasarlanmış Oda", value: "34" },
];

const reviews = [
  {
    text: '"Odalar gayet güzel, son derece temiz. Asıl önemli olan personelin güleryüzü ve ilgisiydi. Uzun zamandır bir otelden bu kadar güzel hizmet almamıştık."',
    author: "Türk Misafir",
  },
  {
    text: '"Very friendly owners and staff. Delicious breakfast. Amazing place and it was also very clean. The views are consistently beautiful."',
    author: "Yabancı Misafir · Hotels.com",
  },
  {
    text: '"Kahvaltı gerçekten ortalamanın üzerinde, Türk lezzetli. Resepsiyonda her zaman İngilizce bilen, süper yardımsever ve güleryüzlü personel mevcut."',
    author: "Türk Misafir · ZenHotels",
  },
];

const highlightRatings = [
  { icon: Sparkles, label: "Temizlik", score: "9.8" },
  { icon: MapPin, label: "Konum", score: "9.5" },
  { icon: BellRing, label: "Personel", score: "9.9" },
  { icon: Coffee, label: "Kahvaltı", score: "9.7" },
];

const features = [
  { icon: Waves, text: "Açık havuz + çocuk havuzu" },
  { icon: UtensilsCrossed, text: "A La Carte Restoran" },
  { icon: Wine, text: "Havuz başı bar" },
  { icon: Coffee, text: "Ismarlamalı kahvaltı (08:30–10:30)" },
  { icon: Flame, text: "Firepit · açık hava ateş alanı" },
  { icon: CarFront, text: "Ücretsiz açık otopark" },
  { icon: Wifi, text: "Tüm alanlarda ücretsiz Wi-Fi" },
];

const attractions = [
  {
    icon: Umbrella,
    title: "Kadırga Koyu",
    dist: "5 km",
    desc: "Ege'nin berrak sularında yüzme ve güneşlenme. Otelden şezlong ve şemsiye ayrıcalığı.",
  },
  {
    icon: Landmark,
    title: "Antik Assos (Behramkale)",
    dist: "10 dk",
    desc: "Aristo'nun yaşadığı antik kent. Athena Tapınağı ve Ege'ye hâkim akropol.",
  },
  {
    icon: Ship,
    title: "Assos Limanı",
    dist: "10 dk",
    desc: "Tekneler, taze balık restoranları ve Ege manzaralı romantik akşamlar.",
  },
  {
    icon: TreePine,
    title: "Kazdağı Milli Parkı",
    dist: "37 km",
    desc: "Ida Dağı'nda doğa yürüyüşleri, şelale ve ormanlık alanlar.",
  },
  {
    icon: Droplets,
    title: "Adatepe Zeytinyağı Müzesi",
    dist: "",
    desc: "Zeytinyağının tarihini anlatan özgün müze ve bölgenin geleneksel zanaatkârlığı.",
  },
  {
    icon: Anchor,
    title: "Küçükkuyu",
    dist: "",
    desc: "Şirin bir kıyı kasabası; yerel pazarlar, geleneksel Türk restoranları ve gözde plajlar.",
  },
];

const galleryImages = [
  {
    src: "https://cdng.jollytur.com/files/cms/media/hotel/room/5f6475c4-9c9a-4640-a5dc-115fa6ffb7be-600.jpeg",
    label: "Deluxe Deniz Manzaralı",
  },
  {
    src: "https://cdng.jollytur.com/files/cms/media/hotel/room/2dc440f7-fe20-42bc-98c7-e796e41ea0a6-600.jpeg",
    label: "Oda Detay",
  },
  {
    src: "https://cdng.jollytur.com/files/cms/media/hotel/room/2e20db12-6c15-49eb-8b30-5cbd53389e78-600.jpeg",
    label: "Kısmi Deniz Manzaralı",
  },
  {
    src: "https://cdng.jollytur.com/files/cms/media/hotel/room/e21e4d3b-f71b-43ce-9dfd-a6b7bb92f9cc-600.jpeg",
    label: "Aile Odası",
  },
  {
    src: "https://cdng.jollytur.com/files/cms/media/hotel/d022dfb6-a865-48e2-b1d6-00b90c094170-300.jpeg",
    label: "Otel Genel",
  },
  {
    src: "https://cdng.jollytur.com/files/cms/media/hotel/18566b59-f980-4010-8909-24f21d811b3c-300.jpeg",
    label: "Açık Havuz",
  },
  {
    src: "https://cdng.jollytur.com/files/cms/media/hotel/room/e95a6f29-0b97-4617-9ede-37e2d0ed9f00-300.jpeg",
    label: "Oda İçi",
  },
  {
    src: "https://cdng.jollytur.com/files/cms/media/hotel/room/412c6b53-32d0-428a-aecb-089d4da3cd45-600.jpeg",
    label: "Aile Odası",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Hakkımızda"
        breadcrumb="Hakkımızda"
        backgroundImage="https://cdng.jollytur.com/files/cms/media/hotel/fa46d2cc-7aa8-45b3-95bf-d179020cf7a8-600.jpeg"
      />

      {/* Rating Banner */}
      <div className="bg-dark py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {ratingStats.map((s, i) => (
              <div key={i}>
                <div className="font-heading text-[42px] text-gold font-bold leading-none">
                  {s.value}
                </div>
                <div className="text-[11px] tracking-[2px] uppercase text-white/55 mt-1.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hotel Intro */}
      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="eyebrow">Hikayemiz</span>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
                Assos&apos;un Ruhunu
                <br />
                Taşıyan Bir Otel
              </h2>
              <div className="divider-gold" />
              <p className="text-[15px] leading-[1.9]">
                Assos Karadut Taş Otel, Büyükhusun Köyü&apos;nün sessiz
                güzelliğinde, Ege&apos;nin mavisine açılan eşsiz bir konumda
                yükseliyor. 34 odası ile kahvaltı dahil ve yarım pansiyon
                seçenekleri sunan otelimiz, geleneksel taş mimarisini modern
                konfor anlayışıyla harmanlıyor.
              </p>
              <p className="text-[15px] leading-[1.9]">
                Kadırga Koyu&apos;na 5 km mesafede, Antik Assos ve Assos
                Limanı&apos;na dakikalar uzaklıkta konumlanan otelimiz;
                Ege&apos;nin tarihini, doğasını ve denizini tek bir tatilde bir
                araya getirmek isteyenler için biçilmiş bir kaftandır.
              </p>
              <p className="text-[15px] leading-[1.9]">
                Misafirlerimizin ZenHotels&apos;te verdiği{" "}
                <strong>9.6/10</strong> ve TripAdvisor&apos;daki{" "}
                <strong>5/5</strong> puanı, sunduğumuz hizmetin ve mekânın en
                güzel yansımasıdır.
              </p>
              <div className="bg-warm border-l-[3px] border-gold px-5 py-4 mt-5 text-[13.5px]">
                <strong className="text-dark">Sezonluk Otel:</strong> Nisan –
                Ekim ayları arasında hizmet vermekteyiz.
              </div>
            </div>
            <div>
              <Image
                src="https://cdng.jollytur.com/files/cms/media/hotel/d022dfb6-a865-48e2-b1d6-00b90c094170-300.jpeg"
                alt="Assos Karadut Taş Otel"
                width={600}
                height={480}
                className="w-full h-[480px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section-sm bg-warm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Heart,
                title: "Misyonumuz",
                desc: "Misafirlerimize evlerinden uzakta ev sıcaklığı hissettirmek; Ege'nin doğasını ve Assos'un tarihini en iyi şekilde deneyimlemelerini sağlamak.",
              },
              {
                icon: Eye,
                title: "Vizyonumuz",
                desc: "Assos bölgesinin en seçkin butik oteli olmak; geleneksel taş mimarisini yaşatarak sürdürülebilir turizme öncülük etmek.",
              },
              {
                icon: Award,
                title: "Kültür Bakanlığı Belgeli",
                desc: "T.C. Kültür ve Turizm Bakanlığı Turizm İşletme Belgesi'ne (No: 24921) sahip onaylı bir konaklama tesisiyiz.",
              },
            ].map((item, i) => (
              <div key={i} className="amenity-card bg-white h-full">
                <div className="amenity-icon">
                  <item.icon size={26} className="text-gold" />
                </div>
                <h5 className="text-[13px] tracking-[1.2px] uppercase mb-2">
                  {item.title}
                </h5>
                <p className="text-[13px] text-text-light m-0">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="eyebrow">Olanaklar</span>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
                Her Detayda
                <br />
                Özen
              </h2>
              <div className="divider-gold" />
              <p className="text-[15px] leading-[1.9]">
                Deniz manzaralı açık yüzme havuzumuz ve ayrı çocuk havuzumuz
                ile tüm yaş gruplarına hitap ediyoruz. Havuz başındaki bar,
                sizi serinletirken keyfini de artırıyor.
              </p>
              <p className="text-[15px] leading-[1.9]">
                A La Carte restoranımızda taze yerel malzemelerle hazırlanan
                Ege lezzetleri ve ısmarlamalı kahvaltı servisi (08:30–10:30)
                sunulmaktadır.
              </p>
              <ul className="list-none p-0 mt-3 space-y-0">
                {features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-[14px] text-dark py-2 border-b border-border font-medium"
                  >
                    <f.icon size={15} className="text-gold" />
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <Image
                src="https://cdng.jollytur.com/files/cms/media/hotel/18566b59-f980-4010-8909-24f21d811b3c-300.jpeg"
                alt="Otel Havuzu"
                width={600}
                height={480}
                className="w-full h-[480px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-py bg-dark">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-15">
            <span className="eyebrow text-gold-light">Misafir Yorumları</span>
            <h2 className="text-white">Misafirlerimiz Ne Diyor?</h2>
            <div className="divider-gold-center" />
          </div>

          <div className="text-center mb-12">
            <div className="rating-badge inline-flex">
              <div>
                <div className="rating-score">9.6</div>
                <div className="text-[12px] tracking-wide text-text-light">
                  / 10
                </div>
              </div>
              <div className="text-left">
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <div className="text-[14px] text-text-light">
                  Birden fazla platform
                </div>
                <div className="text-[13px] font-bold text-gold">
                  Olağanüstü
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-7 h-full"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={12}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-white/80 text-[14px] leading-[1.8] italic">
                  {r.text}
                </p>
                <div className="mt-4 text-[12px] text-white/45 tracking-wide uppercase">
                  — {r.author}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 text-center">
            {highlightRatings.map((h, i) => (
              <div
                key={i}
                className="bg-gold/10 border border-gold/25 py-5 px-3"
              >
                <h.icon size={24} className="text-gold mx-auto mb-2" />
                <div className="text-[12px] tracking-[1.5px] uppercase text-white/70">
                  {h.label}
                </div>
                <div className="font-heading text-[28px] text-gold font-bold">
                  {h.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <Image
                src="/img/chairperson.JPG"
                alt="Otel Yönetimi"
                width={500}
                height={480}
                className="w-full h-[480px] object-cover"
              />
            </div>
            <div className="lg:col-span-7">
              <span className="eyebrow">Ekibimiz</span>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
                Kişisel İlgi,
                <br />
                Güleryüzlü Hizmet
              </h2>
              <div className="divider-gold" />
              <p className="text-[15px] leading-[1.9]">
                Assos Karadut Taş Otel&apos;de hizmet anlayışımız, kurumsal
                soğukluğun ötesindedir. Sahipleri ve ekibi, her misafiriyle
                birebir ilgilenerek onların ihtiyaçlarını önceden sezmeye
                çalışır.
              </p>
              <p className="text-[15px] leading-[1.9]">
                Bölgeyi iyi tanıyan ekibimiz; Assos çevresindeki gizli
                koyları, yürüyüş rotalarını ve en taze deniz ürünleri sunan
                restoranları sizinle paylaşmaktan mutluluk duyar.
              </p>
              <Link href="/contact" className="btn-gold mt-2">
                Bize Ulaşın
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-sm bg-warm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-15">
            <span className="eyebrow">Fotoğraf Galerisi</span>
            <h2>Otelimizden Kareler</h2>
            <div className="divider-gold-center" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[5px]">
            {galleryImages.map((img, i) => (
              <div key={i} className="gallery-item">
                <Image
                  src={img.src}
                  alt={img.label}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
                <div className="gallery-overlay">
                  <div className="text-white text-center p-5">
                    <h5 className="font-heading text-white text-[18px]">
                      {img.label}
                    </h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby */}
      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-15">
            <span className="eyebrow">Çevrede Keşfedilecekler</span>
            <h2>Assos&apos;un Hazineleri</h2>
            <div className="divider-gold-center" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {attractions.map((a, i) => (
              <div key={i} className="amenity-card bg-warm h-full">
                <div className="amenity-icon">
                  <a.icon size={26} className="text-gold" />
                </div>
                <h5 className="text-[13px] tracking-[1.2px] uppercase mb-2">
                  {a.title}
                </h5>
                <p className="text-[13px] text-text-light m-0">
                  {a.dist && (
                    <strong className="text-gold">{a.dist}</strong>
                  )}{" "}
                  {a.dist && "· "}
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="max-w-7xl mx-auto px-4 relative z-2">
          <span className="eyebrow text-gold-light">Rezervasyon</span>
          <h2 className="text-white">Sizi Aramızda Görmek İstiyoruz</h2>
          <p className="text-white/70 text-[15px]">
            Nisan – Ekim sezonu için yerinizi şimdiden ayırtın.
          </p>
          <a href="tel:+905010913417" className="phone-display">
            +90 501 091 34 17
          </a>
          <br />
          <Link href="/reservation" className="btn-outline-light mt-2">
            Rezervasyon Bilgisi
          </Link>
        </div>
      </section>
    </>
  );
}
