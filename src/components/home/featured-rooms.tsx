"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Ruler, Users, Waves, Wifi } from "lucide-react";
import { getRoomImages } from "@/lib/config/room-images";
import { getStartingPriceLabel } from "@/lib/config/pricing";

const rooms = [
  {
    roomType: "deluxe_sea_view",
    name: "Deluxe Tam Deniz Manzaralı",
    features: [
      { icon: Ruler, text: "24 m²" },
      { icon: Users, text: "2 kişi" },
      { icon: Waves, text: "Deniz manzarası" },
    ],
  },
  {
    roomType: "traditional_room",
    name: "Traditional Kısmi Deniz Manzaralı",
    features: [
      { icon: Ruler, text: "22 m²" },
      { icon: Users, text: "2 kişi" },
      { icon: Wifi, text: "Wi-Fi" },
    ],
  },
  {
    roomType: "premium_family",
    name: "Aile Suit Deniz Manzaralı",
    features: [
      { icon: Ruler, text: "44 m²" },
      { icon: Users, text: "4 kişiye kadar" },
      { icon: Wifi, text: "Wi-Fi" },
    ],
  },
];

export default function FeaturedRooms() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Bant genişliğini korumak için video yalnızca görünür alana girince
  // oynatılır (autoplay yerine IntersectionObserver ile tetiklenir).
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-py bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-2xl mb-10 md:mb-12">
          <span className="eyebrow">Konaklama</span>
          <h2 className="type-section-title text-dark m-0 mb-4">Odalar</h2>
          <div className="divider-gold" />
          <p className="type-lede m-0">
            Taş mimarisi, geniş pencereler ve Ege ışığı. Her oda sessiz lüks ve sakinlik için
            düşünüldü.
          </p>
        </div>

        {/* Sol: oda videosu (masaüstünde sabit 3:4) — Sağ: 3 eşit yükseklikte
            oda kartı. Video hücresi kendi aspect-ratio'suyla satırın "auto"
            yüksekliğini belirler (en büyük içerik); sağ sütun grid-rows-3 +
            h-full ile bu yüksekliğe stretch olur — CSS Grid'in standart
            "iki sütunu eşitleme" kalıbı (1440px'te doğrulanmalı). */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,420px)_1fr] gap-10 md:gap-14 items-stretch">
          <div className="rounded-[var(--radius-md)] overflow-hidden border border-border aspect-video md:aspect-[3/4]">
            <video
              ref={videoRef}
              className="w-full h-full object-cover block motion-reduce:hidden"
              src="/img/oda-video.mp4"
              muted
              loop
              playsInline
              preload="none"
              poster="/img/oda-video-poster.jpg"
              aria-hidden="true"
            />
            <Image
              src="/img/aile-suit.webp"
              alt="Assos Karadut Taş Otel odaları"
              width={720}
              height={960}
              className="w-full h-full object-cover hidden motion-reduce:block"
            />
          </div>

          <div className="grid grid-rows-3 gap-5 md:gap-4 h-full">
            {rooms.map((room) => {
              const images = getRoomImages(room.roomType);
              const hoverImage = images.gallery[1] ?? images.cover;
              const priceLabel = getStartingPriceLabel(room.roomType);
              return (
                <Link
                  key={room.name}
                  href="/reservation"
                  className="group flex flex-col sm:flex-row gap-5 sm:items-center no-underline border border-border rounded-[var(--radius-md)] p-4 sm:p-5 transition-[border-color,box-shadow,transform] duration-300 hover:border-gold hover:shadow-[var(--shadow-lift)] hover:-translate-y-0.5"
                >
                  <div className="relative overflow-hidden rounded-[var(--radius-sm)] sm:w-[42%] shrink-0 aspect-[4/3]">
                    <Image
                      src={images.cover.src}
                      alt={images.cover.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                    />
                    <Image
                      src={hoverImage.src}
                      alt={hoverImage.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3
                      className="font-heading font-semibold text-dark m-0 mb-1"
                      style={{ fontSize: "clamp(1.1rem, 1.4vw, 1.3rem)" }}
                    >
                      {room.name}
                    </h3>
                    <p className="text-gold-dark text-[11px] font-semibold tracking-[0.15em] uppercase m-0 mb-2">
                      {priceLabel}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-text-light mb-3">
                      {room.features.map((f, j) => (
                        <span key={j} className="flex items-center gap-1.5">
                          <f.icon size={14} strokeWidth={1.5} className="text-gold-dark/70" />
                          {f.text}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-2 self-start text-[11px] font-semibold tracking-[0.22em] uppercase text-dark border-b border-dark/30 pb-1 group-hover:border-dark transition-colors">
                      Müsaitlik &amp; rezervasyon
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-start items-start sm:items-center mt-10 md:mt-12 pt-10 border-t border-border">
          <Link href="/rooms" className="btn-dark-sq no-underline">
            Tüm detaylar
          </Link>
          <Link
            href="/reservation"
            className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-dark no-underline border-b border-gold-dark/40 pb-0.5 hover:border-gold-dark transition-colors"
          >
            Hemen tarih seç →
          </Link>
        </div>
      </div>
    </section>
  );
}
