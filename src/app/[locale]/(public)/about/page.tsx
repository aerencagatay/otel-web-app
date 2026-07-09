import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PageHero from "@/components/layout/page-hero";
import { buildAlternates } from "@/i18n/seo";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: active, namespace: "meta.about" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(active, "/about"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const ratingStats = [
    { label: t("ratings.google"), value: "4.9" },
    { label: t("ratings.tripadvisor"), value: "5/5" },
    { label: t("ratings.rank"), value: "#2" },
    { label: t("ratings.designedRooms"), value: "28" },
  ];

  const reviews = [
    { text: t("reviews.review1"), author: "Kmrozlm7777", meta: t("reviews.review1meta") },
    { text: t("reviews.review2"), author: "Bahar", meta: t("reviews.review2meta") },
    { text: t("reviews.review3"), author: "İrem İnci", meta: t("reviews.review3meta") },
  ];

  const highlightRatings = [
    { icon: Sparkles, label: t("reviews.highlightCleanliness"), score: "9.8" },
    { icon: MapPin, label: t("reviews.highlightLocation"), score: "9.5" },
    { icon: BellRing, label: t("reviews.highlightStaff"), score: "9.9" },
    { icon: Coffee, label: t("reviews.highlightBreakfast"), score: "9.7" },
  ];

  const features = [
    { icon: Waves, text: t("features.list.pool") },
    { icon: UtensilsCrossed, text: t("features.list.restaurant") },
    { icon: Wine, text: t("features.list.bar") },
    { icon: Coffee, text: t("features.list.breakfast") },
    { icon: Flame, text: t("features.list.firepit") },
    { icon: CarFront, text: t("features.list.parking") },
    { icon: Wifi, text: t("features.list.wifi") },
  ];

  const attractions = [
    { icon: Umbrella, key: "bay" },
    { icon: Landmark, key: "assos" },
    { icon: Ship, key: "harbor" },
    { icon: TreePine, key: "park" },
    { icon: Droplets, key: "museum" },
    { icon: Anchor, key: "kucukkuyu" },
  ] as const;

  const galleryImages = [
    { src: "/img/dis-cephe-web.jpg", label: t("gallery.disCephe") },
    { src: "/img/balkon-web.jpg", label: t("gallery.balkon") },
    { src: "/img/bahce.webp", label: t("gallery.bahce") },
    { src: "/img/havuz.webp", label: t("gallery.havuz") },
    { src: "/img/hero-poster.jpg", label: t("gallery.seaView") },
    { src: "/img/hotel-web.jpg", label: t("gallery.otel") },
    { src: "/img/hotel-2-web.jpg", label: t("gallery.tasMimari") },
    { src: "/img/aile-suit.webp", label: t("gallery.aileSuit") },
  ];

  const values = [
    { icon: Heart, title: t("values.mission.title"), desc: t("values.mission.desc") },
    { icon: Eye, title: t("values.vision.title"), desc: t("values.vision.desc") },
    { icon: Award, title: t("values.certified.title"), desc: t("values.certified.desc") },
  ];

  return (
    <>
      {/* Task 03: Jollytur hotlink kaldırıldı — PageHero varsayılan yerel görseli kullanır. */}
      <PageHero title={t("hero.title")} breadcrumb={t("hero.breadcrumb")} />

      {/* Rating Banner */}
      <div className="bg-dark py-9">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
            {ratingStats.map((s, i) => (
              <div
                key={i}
                className="text-center px-3 md:border-l md:border-white/10 md:first:border-l-0"
              >
                <div className="font-heading text-[42px] text-gold font-bold leading-none">
                  {s.value}
                </div>
                <div className="text-[11px] tracking-[2px] uppercase text-white/55 mt-2">
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
              <span className="eyebrow">{t("story.eyebrow")}</span>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
                {t("story.titleLine1")}
                <br />
                {t("story.titleLine2")}
              </h2>
              <div className="divider-gold" />
              <p className="text-[15px] leading-[1.9] mb-4">{t("story.p1")}</p>
              <p className="text-[15px] leading-[1.9] mb-4">{t("story.p2")}</p>
              <p className="text-[15px] leading-[1.9]">
                {t("story.p3Prefix")} <strong>9.6/10</strong> {t("story.p3Mid")}{" "}
                <strong>5/5</strong> {t("story.p3Suffix")}
              </p>
              <div className="bg-warm border-l-[3px] border-gold px-5 py-4 mt-5 text-[13.5px]">
                <strong className="text-dark">{t("story.seasonalLabel")}</strong>{" "}
                {t("story.seasonalText")}
              </div>
            </div>
            <div>
              <video
                className="w-full h-[480px] object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster="/img/otel-video-poster.jpg"
                aria-label={t("story.videoAria")}
              >
                <source src="/img/otel-video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section-sm bg-warm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map((item, i) => (
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
              <span className="eyebrow">{t("features.eyebrow")}</span>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
                {t("features.titleLine1")}
                <br />
                {t("features.titleLine2")}
              </h2>
              <div className="divider-gold" />
              <p className="text-[15px] leading-[1.9] mb-4">{t("features.p1")}</p>
              <p className="text-[15px] leading-[1.9] mb-4">{t("features.p2")}</p>
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
              <video
                className="w-full h-[480px] object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster="/img/havuz-video-poster.jpg"
                aria-label={t("features.videoAria")}
              >
                <source src="/img/havuz-video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-py bg-dark">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-15">
            <span className="eyebrow text-gold-light">{t("reviews.eyebrow")}</span>
            <h2 className="text-white">{t("reviews.title")}</h2>
            <div className="divider-gold-center" />
          </div>

          <div className="text-center mb-12">
            <div className="rating-badge inline-flex">
              <div>
                <div className="rating-score">4.9</div>
                <div className="text-[12px] tracking-wide text-text-light">
                  {t("reviews.outOf")}
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
                  {t("reviews.count")}
                </div>
                <div className="text-[13px] font-bold text-gold">
                  {t("reviews.exceptional")}
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
                <div className="mt-4 text-[12px] text-white/55 tracking-wide uppercase font-semibold">
                  — {r.author}
                </div>
                {r.meta && (
                  <div className="text-[11px] text-white/35 mt-1">{r.meta}</div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 mt-10 text-center">
            {highlightRatings.map((h, i) => (
              <div
                key={i}
                className="py-2 px-3 md:border-l md:border-white/10 md:first:border-l-0"
              >
                <div className="text-[11px] tracking-[0.2em] uppercase text-white/55 mb-2">
                  {h.label}
                </div>
                <div className="font-heading text-[30px] text-gold font-semibold">
                  {h.score}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Assos+Karadut+Taş+Otel+Büyükhusun+Ayvacık"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold no-underline inline-flex items-center justify-center gap-2"
            >
              <Star size={15} className="fill-current" />
              {t("reviews.seeAll")}
            </a>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <Image
                src="/img/chairperson-web.jpg"
                alt={t("team.photoCaption")}
                width={500}
                height={480}
                className="w-full h-[480px] object-cover"
              />
              <p className="text-center text-[11px] tracking-[0.25em] uppercase text-gold-dark font-semibold mt-3">
                {t("team.photoCaption")}
              </p>
            </div>
            <div className="lg:col-span-7">
              <span className="eyebrow">{t("team.eyebrow")}</span>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
                {t("team.titleLine1")}
                <br />
                {t("team.titleLine2")}
              </h2>
              <div className="divider-gold" />
              <p className="text-[15px] leading-[1.9] mb-4">{t("team.p1")}</p>
              <p className="text-[15px] leading-[1.9] mb-2">{t("team.p2")}</p>
              <Link href="/contact" className="btn-gold mt-2">
                {t("team.cta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-sm bg-warm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-15">
            <span className="eyebrow">{t("gallery.eyebrow")}</span>
            <h2>{t("gallery.title")}</h2>
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
            <span className="eyebrow">{t("nearby.eyebrow")}</span>
            <h2>{t("nearby.title")}</h2>
            <div className="divider-gold-center" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {attractions.map((a, i) => {
              const dist = t(`nearby.items.${a.key}.dist`);
              return (
                <div key={i} className="amenity-card bg-warm h-full">
                  <div className="amenity-icon">
                    <a.icon size={26} className="text-gold" />
                  </div>
                  <h5 className="text-[13px] tracking-[1.2px] uppercase mb-2">
                    {t(`nearby.items.${a.key}.title`)}
                  </h5>
                  <p className="text-[13px] text-text-light m-0">
                    {dist && <strong className="text-gold">{dist}</strong>}{" "}
                    {dist && "· "}
                    {t(`nearby.items.${a.key}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="max-w-7xl mx-auto px-4 relative z-2">
          <span className="eyebrow text-gold-light">{t("cta.eyebrow")}</span>
          <h2 className="text-white">{t("cta.title")}</h2>
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
