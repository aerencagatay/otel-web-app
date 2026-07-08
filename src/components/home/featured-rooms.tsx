"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Ruler, Users, Waves, Wifi } from "lucide-react";

const rooms = [
  {
    name: "Deluxe Tam Deniz Manzaralı",
    price: "Fiyat için iletişim",
    image:
      "https://cdng.jollytur.com/files/cms/media/hotel/room/5f6475c4-9c9a-4640-a5dc-115fa6ffb7be-600.jpeg",
    features: [
      { icon: Ruler, text: "24 m²" },
      { icon: Users, text: "2 kişi" },
      { icon: Waves, text: "Deniz manzarası" },
    ],
  },
  {
    name: "Traditional Kısmi Deniz Manzaralı",
    price: "Fiyat için iletişim",
    image:
      "https://cdng.jollytur.com/files/cms/media/hotel/room/2e20db12-6c15-49eb-8b30-5cbd53389e78-600.jpeg",
    features: [
      { icon: Ruler, text: "22 m²" },
      { icon: Users, text: "2 kişi" },
      { icon: Wifi, text: "Wi-Fi" },
    ],
  },
  {
    name: "Aile Suit Deniz Manzaralı",
    price: "Fiyat için iletişim",
    image:
      "https://cdng.jollytur.com/files/cms/media/hotel/room/e21e4d3b-f71b-43ce-9dfd-a6b7bb92f9cc-600.jpeg",
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

        {/* Sol: oda videosu (3:4) — Sağ: 3 eşit yükseklikte oda kartı.
            items-stretch + sağ sütunun grid-rows-3 h-full olması, video ile
            kart sütununu piksel düzeyinde eşitler (1440px'te doğrulanmalı). */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,420px)_1fr] gap-10 md:gap-14 items-stretch">
          <div className="rounded-[var(--radius-md)] overflow-hidden border border-border aspect-video md:aspect-auto">
            <video
              ref={videoRef}
              className="w-full h-full object-cover block motion-reduce:hidden"
              src="/img/oda-video.mp4"
              muted
              loop
              playsInline
              preload="metadata"
              poster="/img/aile_odası.webp"
              aria-hidden="true"
            />
            <Image
              src="/img/aile_odası.webp"
              alt="Assos Karadut Taş Otel odaları"
              width={720}
              height={960}
              className="w-full h-full object-cover hidden motion-reduce:block"
            />
          </div>

          <div className="grid grid-rows-3 gap-5 md:gap-4">
            {rooms.map((room) => (
              <Link
                key={room.name}
                href="/reservation"
                className="group flex flex-col sm:flex-row gap-5 sm:items-center no-underline border border-border rounded-[var(--radius-md)] p-4 sm:p-5 transition-[border-color,box-shadow,transform] duration-300 hover:border-gold hover:shadow-[var(--shadow-lift)] hover:-translate-y-0.5"
              >
                <div className="overflow-hidden rounded-[var(--radius-sm)] sm:w-[42%] shrink-0">
                  <Image
                    src={room.image}
                    alt={room.name}
                    width={600}
                    height={450}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-[400ms] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
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
                    {room.price}
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
            ))}
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
