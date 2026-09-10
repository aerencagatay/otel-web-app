import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import PageHero from "@/components/layout/page-hero";
import JsonLd, { roomsJsonLd } from "@/components/seo/json-ld";
import RoomGalleryLightbox from "@/components/rooms/room-gallery-lightbox";
import { getRoomImages } from "@/lib/config/room-images";
import { getLowestUpcomingPrice } from "@/lib/config/pricing";
import { approxEur, HOTEL } from "@/lib/config/hotel";
import { ROOM_TYPE_MAP } from "@/lib/config/room-types";
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

/** tel: bağlantısı için boşluksuz numara — tek doğruluk kaynağı hotel.ts. */
const TEL_HREF = `tel:${HOTEL.phone.replace(/\s/g, "")}`;

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
  const tp = await getTranslations("pricing");
  const td = await getTranslations("roomDetail");
  const tr = await getTranslations("roomTypes");
  const activeLocale: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const intlLocale = activeLocale === "en" ? "en-US" : "tr-TR";

  // Fiyat etiketi her zaman pricing.ts'ten türetilir; tanımlı ay yoksa
  // zarif fallback. EN tarafında yaklaşık EUR eklenir (EUR_RATE sabiti).
  function priceLabel(roomType: string): string {
    const price = getLowestUpcomingPrice(roomType);
    if (price == null) return tp("contactForPrice");
    const formatted = price.toLocaleString(intlLocale);
    return activeLocale === "en"
      ? tp("startingFrom", {
          price: formatted,
          eur: approxEur(price).toLocaleString(intlLocale),
        })
      : tp("startingFrom", { price: formatted });
  }

  const rooms = [
    {
      roomType: "deluxe_sea_view",
      name: tr("deluxe_sea_view"),
      desc: t("list.deluxe.desc"),
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
    },
    {
      roomType: "traditional_room",
      name: tr("traditional_room"),
      desc: t("list.traditional.desc"),
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
    },
    {
      roomType: "premium_family",
      name: tr("premium_family"),
      desc: t("list.family.desc"),
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
      <JsonLd data={roomsJsonLd(activeLocale)} />
      <PageHero title={t("hero.title")} breadcrumb={t("hero.breadcrumb")} />

      {/* Giriş — §8.7: paragraflar ortalanmaz, sola hizalı ve 68ch sınırlı. */}
      <section className="section-sm bg-stone-05">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="type-section-title m-0 mb-4 text-ink">{t("intro.title")}</h2>
          <div className="divider-gold" />
          <p className="measure m-0 text-stone-80">{t("intro.text")}</p>
        </div>
      </section>

      {/* Oda listesi — dönüşümlü (görsel sol / sağ) editoryal satırlar.
          K1 ile aynı kural burada da geçerli: oran GENİŞLİKTEN yüksekliğe
          hesaplanır, her grid item min-w-0'dır ve kartın açık zemini vardır.
          Eski `.room-list-card` + inline "480px 1fr" sabit sütunu kaldırıldı;
          o kurulum <1024px'te sabit 480px'lik görsel sütunuyla taşma
          üretiyordu (mobil için stack kuralı da yoktu). */}
      {rooms.map((room, i) => {
        const images = getRoomImages(room.roomType);
        const detailHref = `/rooms/${ROOM_TYPE_MAP[room.roomType].slug}`;
        const imageRight = i % 2 === 1;
        return (
          <div key={room.roomType}>
            <section className={`section-py ${imageRight ? "bg-stone-05" : "bg-white"}`}>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <article className="grid min-w-0 grid-cols-1 overflow-hidden rounded-[var(--radius-md)] border border-stone-15 bg-white lg:grid-cols-2">
                  <Link
                    href={detailHref}
                    aria-label={room.name}
                    className={`relative block min-w-0 aspect-[4/3] lg:aspect-auto lg:min-h-[460px] ${
                      imageRight ? "lg:order-2" : ""
                    }`}
                  >
                    <Image
                      src={images.cover.src}
                      alt={images.cover.alt}
                      fill
                      sizes="(max-width: 1023px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-col justify-center p-6 md:p-10">
                    <h3 className="m-0 mb-2 font-heading text-[clamp(1.35rem,2.4vw,1.75rem)] font-semibold">
                      <Link
                        href={detailHref}
                        className="text-ink no-underline transition-colors hover:text-sea"
                      >
                        {room.name}
                      </Link>
                    </h3>
                    {/* Fiyat pricing.ts'ten; elle yazılmaz. */}
                    <p className="m-0 mb-5 text-[14px] font-medium text-sea">
                      {priceLabel(room.roomType)}
                    </p>
                    {/* O3: gövde metni 68ch ile sınırlı. */}
                    <p className="measure m-0 mb-6 text-stone-80">{room.desc}</p>

                    <ul className="m-0 mb-7 grid list-none grid-cols-1 gap-x-6 gap-y-2.5 border-t border-stone-15 p-0 pt-5 sm:grid-cols-2">
                      {room.features.map((feature) => (
                        <li
                          key={feature.text}
                          className="flex min-w-0 items-center gap-2 text-[14px] text-stone-55"
                        >
                          <feature.icon
                            size={15}
                            strokeWidth={1.5}
                            className="shrink-0 text-sea"
                          />
                          {feature.text}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      <Link href="/reservation" className="btn-gold no-underline">
                        <Phone className="h-4 w-4" strokeWidth={1.8} />
                        {t("bookCta")}
                      </Link>
                      <Link
                        href={detailHref}
                        className="inline-flex min-h-[44px] items-center border-b border-sea/40 text-[14px] font-semibold text-sea no-underline transition-colors hover:border-sea"
                      >
                        {td("viewDetails")}
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            {/* Mini galeri (lightbox'lı) */}
            <RoomGalleryLightbox images={images.gallery} roomName={room.name} />
          </div>
        );
      })}

      {/* Tüm odalarda standart özellikler */}
      <section className="section-sm bg-stone-05">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="type-section-title m-0 mb-4 text-ink">{t("amenities.title")}</h2>
            <div className="divider-gold" />
            <p className="measure m-0 text-stone-80">{t("amenities.text")}</p>
          </div>
          <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {allAmenities.map((amenity) => (
              <li
                key={amenity.text}
                className="flex min-w-0 items-center gap-2.5 border-b border-stone-15 py-3 text-[15px] text-stone-80"
              >
                <amenity.icon size={16} strokeWidth={1.5} className="shrink-0 text-sea" />
                {amenity.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Giriş / çıkış bandı */}
      <div className="border-y border-stone-15 bg-stone-00 py-10 md:py-11">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { label: t("checkinBanner.checkIn"), value: HOTEL.checkIn },
              { label: t("checkinBanner.checkOut"), value: HOTEL.checkOut },
              { label: t("checkinBanner.totalRooms"), value: String(HOTEL.totalRooms) },
            ].map((item) => (
              <div
                key={item.label}
                className="min-w-0 border-r border-stone-15 px-3 py-4 text-center last:border-r-0"
              >
                <span className="stat-number">{item.value}</span>
                <span className="stat-label">{item.label}</span>
              </div>
            ))}
            <div className="min-w-0 px-3 py-4 text-center">
              <a
                href={TEL_HREF}
                className="block font-heading text-[22px] font-semibold leading-none text-sea no-underline transition-opacity hover:opacity-80"
              >
                {HOTEL.phone}
              </a>
              <span className="stat-label mt-2">{t("checkinBanner.reservation")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kapanış CTA'sı */}
      <section className="cta-banner">
        <div className="relative z-2 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-white">
            {t("cta.titleLine1")}
            <br />
            {t("cta.titleLine2")}
          </h2>
          <p className="measure-tight mx-auto text-white/70">{t("cta.text")}</p>
          <a href={TEL_HREF} className="phone-display">
            {HOTEL.phone}
          </a>
          <br />
          <Link href="/reservation" className="btn-outline-light mt-2 no-underline">
            {t("cta.button")}
          </Link>
        </div>
      </section>
    </>
  );
}
