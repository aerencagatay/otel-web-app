import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import PageHero from "@/components/layout/page-hero";
import JsonLd, { roomsJsonLd } from "@/components/seo/json-ld";
import { buildAlternates } from "@/i18n/seo";
import { routing, type Locale } from "@/i18n/routing";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: active, namespace: "meta.rooms" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(active, "/rooms"),
  };
}

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rooms");
  const tr = await getTranslations("roomTypes");

  const priceSub = t("priceSub");
  const rooms = [
    {
      name: tr("deluxe_sea_view"),
      desc: t("list.deluxe.desc"),
      mainImage:
        "https://cdng.jollytur.com/files/cms/media/hotel/room/5f6475c4-9c9a-4640-a5dc-115fa6ffb7be-600.jpeg",
      galleryImages: [
        "https://cdng.jollytur.com/files/cms/media/hotel/room/5f6475c4-9c9a-4640-a5dc-115fa6ffb7be-600.jpeg",
        "https://cdng.jollytur.com/files/cms/media/hotel/room/2dc440f7-fe20-42bc-98c7-e796e41ea0a6-600.jpeg",
      ],
      features: [
        { icon: Ruler, text: t("feat.size24") },
        { icon: Users, text: t("feat.guests2") },
        { icon: Waves, text: t("feat.fullSeaView") },
        { icon: Snowflake, text: t("feat.ac") },
        { icon: Wifi, text: t("feat.wifi") },
        { icon: Tv, text: t("feat.tv") },
        { icon: Wine, text: t("feat.minibar") },
        { icon: Wind, text: t("feat.hairdryer") },
      ],
      bg: "bg-white",
      layout: "image-left",
    },
    {
      name: tr("traditional_room"),
      desc: t("list.traditional.desc"),
      mainImage:
        "https://cdng.jollytur.com/files/cms/media/hotel/room/2e20db12-6c15-49eb-8b30-5cbd53389e78-600.jpeg",
      galleryImages: [
        "https://cdng.jollytur.com/files/cms/media/hotel/room/2e20db12-6c15-49eb-8b30-5cbd53389e78-600.jpeg",
        "https://cdng.jollytur.com/files/cms/media/hotel/room/e95a6f29-0b97-4617-9ede-37e2d0ed9f00-300.jpeg",
      ],
      features: [
        { icon: Ruler, text: t("feat.size22") },
        { icon: Users, text: t("feat.guests2") },
        { icon: Waves, text: t("feat.partialSeaView") },
        { icon: Snowflake, text: t("feat.ac") },
        { icon: Wifi, text: t("feat.wifi") },
        { icon: Tv, text: t("feat.tv") },
        { icon: Wine, text: t("feat.minibar") },
        { icon: Wind, text: t("feat.hairdryer") },
      ],
      bg: "bg-warm",
      layout: "image-right",
    },
    {
      name: tr("premium_family"),
      desc: t("list.family.desc"),
      mainImage:
        "https://cdng.jollytur.com/files/cms/media/hotel/room/e21e4d3b-f71b-43ce-9dfd-a6b7bb92f9cc-600.jpeg",
      galleryImages: [
        "https://cdng.jollytur.com/files/cms/media/hotel/room/e21e4d3b-f71b-43ce-9dfd-a6b7bb92f9cc-600.jpeg",
        "https://cdng.jollytur.com/files/cms/media/hotel/room/412c6b53-32d0-428a-aecb-089d4da3cd45-600.jpeg",
      ],
      features: [
        { icon: Ruler, text: t("feat.size44") },
        { icon: Users, text: t("feat.guests4") },
        { icon: Sofa, text: t("feat.sitting") },
        { icon: Snowflake, text: t("feat.ac") },
        { icon: Wifi, text: t("feat.wifi") },
        { icon: Tv, text: t("feat.tv") },
        { icon: Wine, text: t("feat.minibar") },
        { icon: Armchair, text: t("feat.outdoorTable") },
      ],
      bg: "bg-white",
      layout: "image-left",
    },
  ];

  const allAmenities = [
    { icon: Snowflake, text: t("amenities.items.ac") },
    { icon: Wifi, text: t("amenities.items.wifi") },
    { icon: Tv, text: t("amenities.items.tv") },
    { icon: Wine, text: t("amenities.items.minibar") },
    { icon: Wind, text: t("amenities.items.hairdryer") },
    { icon: Bath, text: t("amenities.items.bath") },
    { icon: Shirt, text: t("amenities.items.wardrobe") },
    { icon: Sofa, text: t("amenities.items.seating") },
    { icon: Shield, text: t("amenities.items.mosquitoNet") },
    { icon: Droplets, text: t("amenities.items.amenityKit") },
    { icon: Waves, text: t("amenities.items.towels") },
    { icon: Armchair, text: t("amenities.items.outdoorTable") },
  ];

  return (
    <>
      <JsonLd data={roomsJsonLd(locale as Locale)} />
      <PageHero
        title={t("hero.title")}
        breadcrumb={t("hero.breadcrumb")}
        backgroundImage="https://cdng.jollytur.com/files/cms/media/hotel/fa46d2cc-7aa8-45b3-95bf-d179020cf7a8-600.jpeg"
      />

      {/* Intro */}
      <section className="section-sm bg-warm">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="eyebrow">{t("intro.eyebrow")}</span>
          <h2>{t("intro.title")}</h2>
          <div className="divider-gold-center" />
          <p className="max-w-[640px] mx-auto text-[15px] text-text-light">
            {t("intro.text")}
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
                  <div className="text-gold-dark text-[11px] font-semibold tracking-[0.15em] uppercase mb-4">
                    {t("priceContact")}{" "}
                    <span className="text-text-light font-normal normal-case tracking-normal">
                      {priceSub}
                    </span>
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
                      {t("bookCta")}
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
            <span className="eyebrow">{t("amenities.eyebrow")}</span>
            <h2>{t("amenities.title")}</h2>
            <div className="divider-gold-center" />
            <p className="text-text-light text-[15px]">{t("amenities.text")}</p>
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
              { label: t("checkinBanner.checkIn"), value: "14:00" },
              { label: t("checkinBanner.checkOut"), value: "12:00" },
              { label: t("checkinBanner.totalRooms"), value: "28" },
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
              <span className="stat-label mt-2">{t("checkinBanner.reservation")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="cta-banner">
        <div className="max-w-7xl mx-auto px-4 relative z-2">
          <span className="eyebrow text-gold-light">{t("cta.eyebrow")}</span>
          <h2 className="text-white">
            {t("cta.titleLine1")}
            <br />
            {t("cta.titleLine2")}
          </h2>
          <p className="text-white/70 text-[15px]">{t("cta.text")}</p>
          <a href="tel:+905010913417" className="phone-display">
            +90 501 091 34 17
          </a>
          <br />
          <Link href="/reservation" className="btn-outline-light mt-2">
            {t("cta.button")}
          </Link>
        </div>
      </section>
    </>
  );
}
