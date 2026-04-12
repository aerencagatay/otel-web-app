import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/layout/page-hero";
import {
  Ruler,
  Users,
  Waves,
  Snowflake,
  Wifi,
  Tv,
  Wine,
  Wind,
  Sofa,
  Armchair,
  Phone,
  LogIn,
  LogOut,
  BedDouble,
  Bath,
  Shirt,
  Shield,
  Droplets,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Odalarımız",
  description:
    "Assos Karadut Taş Otel oda tipleri: Deluxe Deniz Manzaralı, Deluxe Kısmi Deniz Manzaralı ve Aile Odası. Tüm odalarda klima, TV, Wi-Fi, minibar.",
};

const rooms = [
  {
    name: "Deluxe Oda Deniz Manzaralı",
    price: "3.500 ₺'den",
    priceSub: "/ Gece · Kahvaltı Dahil",
    desc: "Ege'nin muhteşem mavisine açılan pencereleriyle sabahları deniz manzarasıyla uyanacağınız odamız. 24 m² alanda modern konfor anlayışıyla tasarlanmış, klima ile tüm mevsimlerde konforlu bir konaklama sunmaktadır.",
    mainImage:
      "https://cdng.jollytur.com/files/cms/media/hotel/room/5f6475c4-9c9a-4640-a5dc-115fa6ffb7be-600.jpeg",
    galleryImages: [
      "https://cdng.jollytur.com/files/cms/media/hotel/room/5f6475c4-9c9a-4640-a5dc-115fa6ffb7be-600.jpeg",
      "https://cdng.jollytur.com/files/cms/media/hotel/room/2dc440f7-fe20-42bc-98c7-e796e41ea0a6-600.jpeg",
    ],
    features: [
      { icon: Ruler, text: "24 m²" },
      { icon: Users, text: "2 Kişi" },
      { icon: Waves, text: "Tam Deniz Manzarası" },
      { icon: Snowflake, text: "Klima" },
      { icon: Wifi, text: "Wi-Fi" },
      { icon: Tv, text: "TV" },
      { icon: Wine, text: "Minibar" },
      { icon: Wind, text: "Saç Kurutma Makinesi" },
    ],
    bg: "bg-white",
    layout: "image-left",
  },
  {
    name: "Deluxe Oda Kısmi Deniz Manzaralı",
    price: "Fiyat için arayın",
    priceSub: "/ Gece · Kahvaltı Dahil",
    desc: "22 m² alana sahip bu odamız, kısmen Ege manzarası sunarken tüm standart konfor olanaklarına sahiptir. Klima, TV ve minibarıyla rahat bir konaklama arayan misafirlerimiz için ideal bir seçimdir.",
    mainImage:
      "https://cdng.jollytur.com/files/cms/media/hotel/room/2e20db12-6c15-49eb-8b30-5cbd53389e78-600.jpeg",
    galleryImages: [
      "https://cdng.jollytur.com/files/cms/media/hotel/room/2e20db12-6c15-49eb-8b30-5cbd53389e78-600.jpeg",
      "https://cdng.jollytur.com/files/cms/media/hotel/room/e95a6f29-0b97-4617-9ede-37e2d0ed9f00-300.jpeg",
    ],
    features: [
      { icon: Ruler, text: "22 m²" },
      { icon: Users, text: "2 Kişi" },
      { icon: Waves, text: "Kısmi Deniz Manzarası" },
      { icon: Snowflake, text: "Klima" },
      { icon: Wifi, text: "Wi-Fi" },
      { icon: Tv, text: "TV" },
      { icon: Wine, text: "Minibar" },
      { icon: Wind, text: "Saç Kurutma Makinesi" },
    ],
    bg: "bg-warm",
    layout: "image-right",
  },
  {
    name: "Aile Odası",
    price: "Fiyat için arayın",
    priceSub: "/ Gece · Kahvaltı Dahil",
    desc: "44 m² ile otelimizin en geniş odası. Ailenizle birlikte geniş ve rahat bir tatil için tasarlanan bu odamız, 4 kişiye kadar konaklama kapasitesine sahiptir. Ayrı oturma alanı ve açık havada yemek masasıyla tam bir aile tatili konforunu sunar.",
    mainImage:
      "https://cdng.jollytur.com/files/cms/media/hotel/room/e21e4d3b-f71b-43ce-9dfd-a6b7bb92f9cc-600.jpeg",
    galleryImages: [
      "https://cdng.jollytur.com/files/cms/media/hotel/room/e21e4d3b-f71b-43ce-9dfd-a6b7bb92f9cc-600.jpeg",
      "https://cdng.jollytur.com/files/cms/media/hotel/room/412c6b53-32d0-428a-aecb-089d4da3cd45-600.jpeg",
    ],
    features: [
      { icon: Ruler, text: "44 m²" },
      { icon: Users, text: "4 Kişiye Kadar" },
      { icon: Sofa, text: "Oturma Alanı" },
      { icon: Snowflake, text: "Klima" },
      { icon: Wifi, text: "Wi-Fi" },
      { icon: Tv, text: "TV" },
      { icon: Wine, text: "Minibar" },
      { icon: Armchair, text: "Açık Hava Yemek Masası" },
    ],
    bg: "bg-white",
    layout: "image-left",
  },
];

const allAmenities = [
  { icon: Snowflake, text: "Klima" },
  { icon: Wifi, text: "Ücretsiz Wi-Fi" },
  { icon: Tv, text: "TV" },
  { icon: Wine, text: "Minibar" },
  { icon: Wind, text: "Saç Kurutma Makinesi" },
  { icon: Bath, text: "Banyo & Duş" },
  { icon: Shirt, text: "Gardırop" },
  { icon: Sofa, text: "Oturma Grubu" },
  { icon: Shield, text: "Sivrisinek Teli" },
  { icon: Droplets, text: "Buklet Seti" },
  { icon: Waves, text: "Havlu Seti" },
  { icon: Armchair, text: "Açık Hava Yemek Masası" },
];

export default function RoomsPage() {
  return (
    <>
      <PageHero
        title="Odalarımız"
        breadcrumb="Odalarımız"
        backgroundImage="https://cdng.jollytur.com/files/cms/media/hotel/fa46d2cc-7aa8-45b3-95bf-d179020cf7a8-600.jpeg"
      />

      {/* Intro */}
      <section className="section-sm bg-warm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="eyebrow">34 Oda · 3 Tip</span>
          <h2>Konforun Taştaki Adresi</h2>
          <div className="divider-gold-center" />
          <p className="max-w-[640px] mx-auto text-[15px] text-text-light">
            Otelimizde 3 farklı oda tipimiz bulunmakta olup tüm odalar; klima,
            TV, Wi-Fi, minibar, gardırop ve özel banyoyla donatılmıştır. Deniz
            manzarası seçeneklerimizle Ege&apos;yi odanızdan seyredin.
          </p>
        </div>
      </section>

      {/* Room Cards */}
      {rooms.map((room, i) => (
        <div key={i}>
          <section className={`section-py ${room.bg}`}>
            <div className="max-w-7xl mx-auto px-4">
              <div
                className="room-list-card"
                style={{
                  gridTemplateColumns:
                    room.layout === "image-left" ? "480px 1fr" : "1fr 480px",
                }}
              >
                <div
                  className="overflow-hidden min-h-[380px]"
                  style={{ order: room.layout === "image-right" ? 2 : 0 }}
                >
                  <Image
                    src={room.mainImage}
                    alt={room.name}
                    width={480}
                    height={380}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="p-8 md:px-9 flex flex-col justify-center"
                  style={{ order: room.layout === "image-right" ? 1 : 0 }}
                >
                  <h3
                    className="mb-2"
                    style={{ fontSize: "clamp(20px, 2.5vw, 26px)" }}
                  >
                    {room.name}
                  </h3>
                  <div className="text-gold text-[20px] font-bold mb-4 tracking-wide">
                    {room.price}{" "}
                    <span className="text-[13px] text-text-light font-normal">
                      {room.priceSub}
                    </span>
                  </div>
                  <p className="text-[14px] text-text leading-[1.8] mb-5">
                    {room.desc}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2.5 mb-6">
                    {room.features.map((f, j) => (
                      <span
                        key={j}
                        className="text-[12.5px] text-text-light flex items-center gap-1.5"
                      >
                        <f.icon size={14} className="text-gold" />
                        {f.text}
                      </span>
                    ))}
                  </div>
                  <div>
                    <Link href="/reservation" className="btn-gold">
                      <Phone className="inline w-3.5 h-3.5 mr-2" />
                      Online Rezervasyon
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery */}
          <div className="grid grid-cols-2 gap-1 max-w-[960px] mx-auto mb-20">
            {room.galleryImages.map((img, j) => (
              <div key={j} className="gallery-item" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={img}
                  alt={room.name}
                  width={480}
                  height={270}
                  className="w-full h-full object-cover"
                />
                <div className="gallery-overlay">
                  <div className="text-white text-center p-5">
                    <h5 className="font-heading text-white text-[18px]">
                      {room.name}
                    </h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* All Room Amenities */}
      <section className="section-sm bg-warm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-15">
            <span className="eyebrow">Standart Özellikler</span>
            <h2>Tüm Odalarımızda</h2>
            <div className="divider-gold-center" />
            <p className="text-text-light text-[15px]">
              Aşağıdaki özellikler ekstra ücret olmaksızın tüm odalarımızda
              mevcuttur.
            </p>
          </div>
          <div className="text-center">
            {allAmenities.map((a, i) => (
              <span key={i} className="amenity-tag">
                <a.icon size={14} className="text-gold" />
                {a.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Check-in/out banner */}
      <section className="section-sm bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: LogIn, label: "Giriş Saati", value: "14:00" },
              { icon: LogOut, label: "Çıkış Saati", value: "12:00" },
              { icon: BedDouble, label: "Toplam Oda", value: "34" },
            ].map((item, i) => (
              <div key={i} className="p-8 border border-border">
                <item.icon size={24} className="text-gold mx-auto mb-3" />
                <h6 className="text-[11px] tracking-[2px] uppercase text-text-light">
                  {item.label}
                </h6>
                <p className="font-heading text-[32px] text-dark font-bold m-0">
                  {item.value}
                </p>
              </div>
            ))}
            <div className="p-8 bg-gold border border-gold">
              <Phone size={24} className="text-white mx-auto mb-3" />
              <h6 className="text-[11px] tracking-[2px] uppercase text-white/75">
                Rezervasyon
              </h6>
              <a
                href="tel:+905010913417"
                className="font-heading text-[18px] text-white no-underline font-bold block"
              >
                +90 501 091 34 17
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="max-w-7xl mx-auto px-4 relative z-2">
          <span className="eyebrow text-gold-light">Rezervasyon</span>
          <h2 className="text-white">
            Odanızı Ayırtmak İçin
            <br />
            Bizi Arayın
          </h2>
          <p className="text-white/70 text-[15px]">
            7/24 resepsiyon hizmetimizle her zaman yanınızdayız.
          </p>
          <a href="tel:+905010913417" className="phone-display">
            +90 501 091 34 17
          </a>
          <br />
          <Link href="/reservation" className="btn-outline-light mt-2">
            Rezervasyon Nasıl Yapılır?
          </Link>
        </div>
      </section>
    </>
  );
}
