import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/layout/page-hero";
import JsonLd, { roomsJsonLd } from "@/components/seo/json-ld";
import RoomGalleryLightbox from "@/components/rooms/room-gallery-lightbox";
import { getRoomImages } from "@/lib/config/room-images";
import { getStartingPriceLabel } from "@/lib/config/pricing";
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
  Bath,
  Shirt,
  Shield,
  Droplets,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Odalarımız",
  description:
    "Assos Karadut Taş Otel oda tipleri: Deluxe Tam Deniz Manzaralı, Traditional Kısmi Deniz Manzaralı ve Aile Suit Deniz Manzaralı. Tüm odalarda klima, TV, Wi-Fi, minibar.",
  alternates: { canonical: "/rooms" },
};

const rooms = [
  {
    roomType: "deluxe_sea_view",
    name: "Deluxe Tam Deniz Manzaralı",
    priceSub: "/ Gece · Kahvaltı Dahil",
    desc: "Ege'nin muhteşem mavisine açılan pencereleriyle sabahları deniz manzarasıyla uyanacağınız odamız. 24 m² alanda modern konfor anlayışıyla tasarlanmış, klima ile tüm mevsimlerde konforlu bir konaklama sunmaktadır.",
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
    roomType: "traditional_room",
    name: "Traditional Kısmi Deniz Manzaralı",
    priceSub: "/ Gece · Kahvaltı Dahil",
    desc: "22 m² alana sahip bu odamız, kısmen Ege manzarası sunarken tüm standart konfor olanaklarına sahiptir. Klima, TV ve minibarıyla rahat bir konaklama arayan misafirlerimiz için ideal bir seçimdir.",
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
    roomType: "premium_family",
    name: "Aile Suit Deniz Manzaralı",
    priceSub: "/ Gece · Kahvaltı Dahil",
    desc: "44 m² ile otelimizin en geniş odası. Ailenizle birlikte geniş ve rahat bir tatil için tasarlanan bu odamız, 4 kişiye kadar konaklama kapasitesine sahiptir. Ayrı oturma alanı ve açık havada yemek masasıyla tam bir aile tatili konforunu sunar.",
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
      <JsonLd data={roomsJsonLd()} />
      <PageHero title="Odalarımız" breadcrumb="Odalarımız" />

      {/* Intro */}
      <section className="section-sm bg-warm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="eyebrow">28 Oda · 3 Tip</span>
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
      {rooms.map((room, i) => {
        const images = getRoomImages(room.roomType);
        const priceLabel = getStartingPriceLabel(room.roomType);
        return (
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
                      src={images.cover.src}
                      alt={images.cover.alt}
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
                    <div className="text-gold-dark text-[11px] font-semibold tracking-[0.15em] uppercase mb-4">
                      {priceLabel}
                    </div>
                    <p className="text-[14px] text-text leading-[1.8] mb-6">
                      {room.desc}
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2.5 mb-7 pt-5 border-t border-border">
                      {room.features.map((f, j) => (
                        <span
                          key={j}
                          className="text-[12.5px] text-text-light flex items-center gap-1.5"
                        >
                          <f.icon size={14} strokeWidth={1.5} className="text-gold-dark/70" />
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

            {/* Mini galeri (lightbox'lı) */}
            <RoomGalleryLightbox images={images.gallery} roomName={room.name} />
          </div>
        );
      })}

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
      <div className="bg-ivory border-y border-border py-10 md:py-11">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { label: "Giriş Saati", value: "14:00" },
              { label: "Çıkış Saati", value: "12:00" },
              { label: "Toplam Oda", value: "28" },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center py-4 px-3 border-r border-border last:border-r-0"
              >
                <span className="stat-number">{item.value}</span>
                <span className="stat-label">{item.label}</span>
              </div>
            ))}
            <div className="text-center py-4 px-3">
              <a
                href="tel:+905010913417"
                className="font-heading text-[24px] text-gold no-underline font-semibold tracking-wide block leading-none hover:opacity-80 transition-opacity"
              >
                +90 501 091 34 17
              </a>
              <span className="stat-label mt-2">Rezervasyon</span>
            </div>
          </div>
        </div>
      </div>

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
