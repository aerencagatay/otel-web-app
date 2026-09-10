"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Ruler, Users, Waves, Wifi } from "lucide-react";
import {
  LazyMotion,
  domAnimation,
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { getRoomCoverImage, getRoomHoverImage } from "@/lib/config/room-images";
import { getLowestUpcomingPrice } from "@/lib/config/pricing";
import { approxEur } from "@/lib/config/hotel";

/* ---------------------------------------------------------------------------
   K1 (Kritik) çözümü — UI_UX_AUDIT.md §4 / §8.11
   ---------------------------------------------------------------------------
   ESKİ KURULUM: `md:grid-cols-[minmax(0,420px)_1fr] ... items-stretch` +
   video kutusunda `aspect-[3/4]`. `items-stretch` kutuyu satır yüksekliğine
   (~1136px) uzatıyor, `aspect-ratio` ise GENİŞLİĞİ YÜKSEKLİKTEN türetiyordu:
   1136 × 0.75 ≈ 852px. 420px'lik sütunda 852px'lik kutu → video kartların
   altına taşıyor, saydam kartların içinden görünüyor ve 768px'te sayfa
   yatay kaydırma alıyordu (scrollWidth 868 > 768).

   YENİ KURULUM:
   1. "Solda dev video + sağda liste" düzeni tamamen bırakıldı (§8.11):
      ≥1024px 3 eşit sütun · 768–1023px 2 sütun · <768px tek sütun.
   2. Her grid item'da açık `min-w-0` (grid item varsayılanı `min-width:auto`
      olduğu için taşmanın kök nedeni buydu — §8.7 zorunlu kuralı).
   3. Görsel oranı yalnızca GENİŞLİKTEN yüksekliğe hesaplanıyor
      (`w-full aspect-[4/3]`); hiçbir yerde yükseklikten genişlik türetilmiyor.
   4. Kartların AÇIK arka planı var (`bg-white`) — hiçbir koşulda saydam değil.
   5. Gömülü "DETAY SEVENLER İÇİN" yazısı taşıyan `oda-video.mp4` bu modülden
      tamamen çıkarıldı (bulgu K4). Yazısız master gelene kadar geri konmaz.
--------------------------------------------------------------------------- */

/** Eğimin üst sınırı (derece). Hareket sessiz kalmalı — §8.10. */
const TILT_MAX = 6;
const TILT_SPRING = { stiffness: 220, damping: 24, mass: 0.5 };
/** globals.css'teki --ease ile aynı eğri. */
const EASE: [number, number, number, number] = [0.2, 0.7, 0.3, 1];

interface FeaturedRoom {
  roomType: string;
  name: string;
  features: { icon: typeof Ruler; text: string }[];
}

/**
 * Tilt yalnızca gerçek işaretçisi olan cihazlarda açılır. Dokunmatikte
 * `hover: hover` eşleşmez, dolayısıyla kart hiç eğilmez (parmağın altında
 * takılı kalan bir 3B dönüş istenmiyor).
 */
function usePointerFine(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return fine;
}

interface CardProps {
  room: FeaturedRoom;
  index: number;
  priceLabel: string;
  ctaLabel: string;
}

function RoomTiltCard({ room, index, priceLabel, ctaLabel }: CardProps) {
  const reduceMotion = useReducedMotion();
  const pointerFine = usePointerFine();
  const tiltOn = pointerFine && !reduceMotion;

  const cover = getRoomCoverImage(room.roomType);
  const hover = getRoomHoverImage(room.roomType);

  // İşaretçinin kart içindeki bağıl konumu (-0.5 … 0.5) ve "kalkma" miktarı.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const lift = useMotionValue(0);

  const sx = useSpring(px, TILT_SPRING);
  const sy = useSpring(py, TILT_SPRING);
  const sl = useSpring(lift, TILT_SPRING);

  const rotateY = useTransform(sx, [-0.5, 0.5], [-TILT_MAX, TILT_MAX]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [TILT_MAX, -TILT_MAX]);
  // Derinlik: görsel ve gövde farklı hızda hareket etsin (parallaks hissi).
  const mediaZ = useTransform(sl, [0, 1], [0, 36]);
  const bodyZ = useTransform(sl, [0, 1], [0, 14]);

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!tiltOn) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
    lift.set(1);
  }

  /** İşaretçi çıkınca (ya da odak kaybolunca) yay ile yumuşakça düzelir. */
  function handleRest() {
    px.set(0);
    py.set(0);
    lift.set(0);
  }

  return (
    <m.div
      className="min-w-0"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.09, ease: EASE }}
    >
      <div
        className="h-full min-w-0"
        style={{ perspective: "1000px" }}
        onPointerMove={handleMove}
        onPointerLeave={handleRest}
        onPointerCancel={handleRest}
      >
        <Link
          href="/reservation"
          className="group block h-full no-underline"
          onBlur={handleRest}
        >
          <m.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="flex h-full min-w-0 flex-col rounded-[var(--radius-md)] border border-stone-15 bg-white p-3 transition-colors duration-200 group-hover:border-sea"
          >
            <m.div
              style={{ z: mediaZ }}
              className="relative w-full aspect-[4/3] overflow-hidden rounded-[var(--radius-xs)] bg-stone-05"
            >
              <Image
                src={cover.src}
                alt={room.name}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                className="object-cover transition-opacity duration-500 group-hover:opacity-0"
              />
              <Image
                src={hover.src}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </m.div>

            <m.div
              style={{ z: bodyZ }}
              className="flex min-w-0 flex-1 flex-col px-2 pt-5 pb-1"
            >
              <h3 className="m-0 mb-1 font-heading text-[1.3rem] font-semibold text-ink">
                {room.name}
              </h3>
              {/* Fiyat elle yazılmaz: pricing.ts'ten türetilir (§AGENTS.md). */}
              <p className="m-0 mb-3 text-[13px] font-medium text-sea">{priceLabel}</p>

              <ul className="m-0 mb-4 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0 text-[13px] text-stone-55">
                {room.features.map((feature) => (
                  <li key={feature.text} className="flex min-w-0 items-center gap-1.5">
                    <feature.icon size={14} strokeWidth={1.5} className="shrink-0 text-sea" />
                    {feature.text}
                  </li>
                ))}
              </ul>

              <span className="mt-auto inline-flex min-h-[44px] items-center self-start border-b border-stone-15 text-[14px] font-semibold text-ink transition-colors duration-200 group-hover:border-ink">
                {ctaLabel}
              </span>
            </m.div>
          </m.div>
        </Link>
      </div>
    </m.div>
  );
}

export default function FeaturedRooms() {
  const t = useTranslations("home.featured");
  const tp = useTranslations("pricing");
  const tr = useTranslations("roomTypes");
  const locale = useLocale();
  const intlLocale = locale === "en" ? "en-US" : "tr-TR";

  // Fiyat etiketi her zaman pricing.ts'ten türetilir (elle yazılmaz);
  // tanımlı ay yoksa zarif "bize ulaşın" fallback'i. EN tarafında yaklaşık
  // EUR eklenir (hotel.ts EUR_RATE — canlı kur yok).
  function priceLabel(roomType: string): string {
    const price = getLowestUpcomingPrice(roomType);
    if (price == null) return tp("contactForPrice");
    const formatted = price.toLocaleString(intlLocale);
    return locale === "en"
      ? tp("startingFrom", { price: formatted, eur: approxEur(price).toLocaleString(intlLocale) })
      : tp("startingFrom", { price: formatted });
  }

  const rooms: FeaturedRoom[] = [
    {
      roomType: "deluxe_sea_view",
      name: tr("deluxe_sea_view"),
      features: [
        { icon: Ruler, text: t("featSize24") },
        { icon: Users, text: t("feat2guests") },
        { icon: Waves, text: t("featSeaView") },
      ],
    },
    {
      roomType: "traditional_room",
      name: tr("traditional_room"),
      features: [
        { icon: Ruler, text: t("featSize22") },
        { icon: Users, text: t("feat2guests") },
        { icon: Wifi, text: t("featWifi") },
      ],
    },
    {
      roomType: "premium_family",
      name: tr("premium_family"),
      features: [
        { icon: Ruler, text: t("featSize44") },
        { icon: Users, text: t("feat4guests") },
        { icon: Wifi, text: t("featWifi") },
      ],
    },
  ];

  return (
    <section className="section-py bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl md:mb-12">
          <h2 className="type-section-title m-0 mb-4 text-ink">{t("title")}</h2>
          <div className="divider-gold" />
          <p className="type-lede measure m-0">{t("lede")}</p>
        </div>

        {/* K1: eşit sütunlu grid. Tailwind'in grid-cols-* yardımcıları
            repeat(n, minmax(0,1fr)) üretir; ayrıca her karta açık min-w-0
            verildi. Hiçbir sütun içeriğinden geniş olamaz. */}
        <LazyMotion features={domAnimation} strict>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {rooms.map((room, index) => (
              <RoomTiltCard
                key={room.roomType}
                room={room}
                index={index}
                priceLabel={priceLabel(room.roomType)}
                ctaLabel={t("availability")}
              />
            ))}
          </div>
        </LazyMotion>

        <div className="mt-10 flex flex-col items-start gap-4 border-t border-stone-15 pt-10 sm:flex-row sm:items-center md:mt-12">
          <Link href="/rooms" className="btn-dark-sq no-underline">
            {t("allDetails")}
          </Link>
          <Link
            href="/reservation"
            className="inline-flex min-h-[44px] items-center border-b border-sea/40 text-[14px] font-semibold text-sea no-underline transition-colors hover:border-sea"
          >
            {t("pickDates")}
          </Link>
        </div>
      </div>
    </section>
  );
}
