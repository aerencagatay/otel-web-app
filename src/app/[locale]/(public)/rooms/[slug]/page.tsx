import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import PageHero from "@/components/layout/page-hero";
import JsonLd, { roomDetailJsonLd } from "@/components/seo/json-ld";
import RoomGalleryLightbox from "@/components/rooms/room-gallery-lightbox";
import RoomDetailBookingCta from "@/components/rooms/room-detail-booking-cta";
import { getRoomImages } from "@/lib/config/room-images";
import { ROOM_TYPE_MAP, getRoomTypeBySlug } from "@/lib/config/room-types";
import { ROOM_PRICING } from "@/lib/config/pricing";
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
} from "lucide-react";

/** Static per-room content that isn't already covered by messages/*.json. */
const ROOM_DETAIL_META: Record<
  string,
  { size: number; viewFeatKey: string; extraFeatKey: string; extraFeatIcon: typeof Sofa }
> = {
  deluxe_sea_view: { size: 24, viewFeatKey: "fullSeaView", extraFeatKey: "minibar", extraFeatIcon: Wine },
  traditional_room: { size: 22, viewFeatKey: "partialSeaView", extraFeatKey: "minibar", extraFeatIcon: Wine },
  premium_family: { size: 44, viewFeatKey: "sitting", extraFeatKey: "outdoorTable", extraFeatIcon: Armchair },
};

const DESC_KEY: Record<string, string> = {
  deluxe_sea_view: "list.deluxe.desc",
  traditional_room: "list.traditional.desc",
  premium_family: "list.family.desc",
};

export function generateStaticParams() {
  return Object.values(ROOM_TYPE_MAP).map((config) => ({ slug: config.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const active: Locale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const roomType = getRoomTypeBySlug(slug);
  if (!roomType) return {};

  const config = ROOM_TYPE_MAP[roomType];
  const t = await getTranslations({ locale: active, namespace: "rooms" });
  const tr = await getTranslations({ locale: active, namespace: "roomTypes" });
  const name = tr(roomType);
  const description = t(DESC_KEY[roomType] as Parameters<typeof t>[0]);
  const image = getRoomImages(roomType).cover;

  return {
    title: name,
    description,
    alternates: buildAlternates(active, `/rooms/${config.slug}`),
    openGraph: {
      images: [{ url: image.src, alt: image.alt }],
    },
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const roomType = getRoomTypeBySlug(slug);
  if (!roomType) notFound();

  const config = ROOM_TYPE_MAP[roomType];
  const meta = ROOM_DETAIL_META[roomType];
  const activeLocale: Locale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const intlLocale = activeLocale === "en" ? "en-US" : "tr-TR";

  const t = await getTranslations("rooms");
  const td = await getTranslations("roomDetail");
  const tr = await getTranslations("roomTypes");

  const name = tr(roomType);
  const images = getRoomImages(roomType);
  const jsonLd = roomDetailJsonLd(roomType, activeLocale);

  const features = [
    { icon: Ruler, text: `${meta.size} m²` },
    { icon: Users, text: t("feat." + (config.maxGuests > 2 ? "guests4" : "guests2")) },
    { icon: Waves, text: t("feat." + meta.viewFeatKey) },
    { icon: Snowflake, text: t("feat.ac") },
    { icon: Wifi, text: t("feat.wifi") },
    { icon: Tv, text: t("feat.tv") },
    { icon: meta.extraFeatIcon, text: t("feat." + meta.extraFeatKey) },
    { icon: Wind, text: t("feat.hairdryer") },
  ];

  const priceTable = ROOM_PRICING[roomType] ?? {};
  const priceRows = Object.entries(priceTable).sort(([a], [b]) => a.localeCompare(b));

  const similarRooms = Object.entries(ROOM_TYPE_MAP).filter(([type]) => type !== roomType);

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <PageHero title={name} breadcrumb={name} />

      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-4">
            <Link href="/rooms" className="text-gold-dark text-[11px] font-semibold tracking-[0.2em] uppercase hover:underline underline-offset-4">
              {td("backToRooms")}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-[var(--radius-md)] mb-6" style={{ aspectRatio: "16/10" }}>
                <Image
                  src={images.cover.src}
                  alt={images.cover.alt}
                  width={960}
                  height={600}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="mb-4">{name}</h2>
              <p className="text-[15px] text-text leading-[1.8] mb-6">
                {t(DESC_KEY[roomType] as Parameters<typeof t>[0])}
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-3 mb-10 pt-6 border-t border-border">
                {features.map((f, i) => (
                  <span key={i} className="text-[13px] text-text flex items-center gap-2">
                    <f.icon size={16} strokeWidth={1.5} className="text-gold-dark/70" />
                    {f.text}
                  </span>
                ))}
              </div>

              {priceRows.length > 0 && (
                <div className="mb-10">
                  <h3 className="font-heading text-xl font-semibold text-dark mb-4">
                    {td("seasonPriceTitle")}
                  </h3>
                  <div className="border border-border rounded-[var(--radius-sm)] overflow-hidden">
                    {priceRows.map(([month, price]) => (
                      <div
                        key={month}
                        className="flex items-center justify-between px-5 py-3 border-b border-border last:border-b-0 text-[14px]"
                      >
                        <span className="text-text-light capitalize">
                          {new Date(`${month}-01T00:00:00`).toLocaleDateString(intlLocale, {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="font-semibold text-dark">
                          {price.toLocaleString(intlLocale)} ₺{" "}
                          <span className="text-text-light font-normal text-[12px]">
                            {td("perNight")}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="booking-card sticky top-24">
                <RoomDetailBookingCta roomType={roomType} />
                <a
                  href="tel:+905010913417"
                  className="btn-dark-sq w-full justify-center mt-3 inline-flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {t("bookCta")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div>
        <h3 className="font-heading text-xl font-semibold text-dark text-center mt-2 mb-6">
          {td("galleryTitle")}
        </h3>
        <RoomGalleryLightbox images={images.gallery} roomName={name} />
      </div>

      <section className="section-sm bg-warm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="eyebrow">{td("similarRoomsEyebrow")}</span>
            <h2>{td("similarRoomsTitle")}</h2>
            <div className="divider-gold-center" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {similarRooms.map(([type, cfg]) => {
              const img = getRoomImages(type).cover;
              return (
                <Link
                  key={type}
                  href={`/rooms/${cfg.slug}`}
                  className="similar-room-card no-underline"
                >
                  <div className="overflow-hidden" style={{ aspectRatio: "16/10" }}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={480}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="font-heading text-lg font-semibold text-dark m-0 mb-1">
                      {tr(type)}
                    </h4>
                    <span className="text-gold-dark text-[11px] font-semibold tracking-[0.15em] uppercase">
                      {td("viewDetails")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
