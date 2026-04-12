import Link from "next/link";
import Image from "next/image";
import { Ruler, Users, Waves, Wifi } from "lucide-react";

const rooms = [
  {
    name: "Deluxe Deniz Manzaralı",
    price: "3.500 ₺'den / gece",
    image:
      "https://cdng.jollytur.com/files/cms/media/hotel/room/5f6475c4-9c9a-4640-a5dc-115fa6ffb7be-600.jpeg",
    features: [
      { icon: Ruler, text: "24 m²" },
      { icon: Users, text: "2 kişi" },
      { icon: Waves, text: "Deniz manzarası" },
    ],
    wide: true,
  },
  {
    name: "Deluxe Kısmi Deniz Manzaralı",
    price: "Fiyat için iletişim",
    image:
      "https://cdng.jollytur.com/files/cms/media/hotel/room/2e20db12-6c15-49eb-8b30-5cbd53389e78-600.jpeg",
    features: [
      { icon: Ruler, text: "22 m²" },
      { icon: Users, text: "2 kişi" },
      { icon: Wifi, text: "Wi-Fi" },
    ],
    wide: false,
  },
  {
    name: "Aile Odası",
    price: "Fiyat için iletişim",
    image:
      "https://cdng.jollytur.com/files/cms/media/hotel/room/e21e4d3b-f71b-43ce-9dfd-a6b7bb92f9cc-600.jpeg",
    features: [
      { icon: Ruler, text: "44 m²" },
      { icon: Users, text: "4 kişiye kadar" },
      { icon: Wifi, text: "Wi-Fi" },
    ],
    wide: false,
  },
];

export default function FeaturedRooms() {
  return (
    <section className="section-py bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-2xl mb-12 md:mb-16">
          <span className="eyebrow">Konaklama</span>
          <h2 className="type-section-title text-dark m-0 mb-4">Odalar</h2>
          <div className="divider-gold" />
          <p className="type-lede m-0">
            Taş mimarisi, geniş pencereler ve Ege ışığı. Her oda sessiz lüks ve sakinlik için
            düşünüldü.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          {rooms.map((room, i) => (
            <Link
              key={i}
              href="/reservation"
              className={`room-card group block ${room.wide ? "lg:col-span-7" : "lg:col-span-5"}`}
              style={{ height: room.wide ? "min(520px, 70vh)" : "min(440px, 58vh)" }}
            >
              <Image
                src={room.image}
                alt={room.name}
                width={800}
                height={560}
                className="w-full h-full object-cover"
              />
              <div className="room-overlay" />
              <div className="room-info text-left">
                <div className="font-heading text-[clamp(1.25rem,2.2vw,1.65rem)] text-white mb-1 font-semibold">
                  {room.name}
                </div>
                <div className="text-gold-light/95 text-[12px] font-semibold tracking-[0.15em] uppercase mb-3">
                  {room.price}
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-white/75 mb-5">
                  {room.features.map((f, j) => (
                    <span key={j} className="flex items-center gap-1.5">
                      <f.icon size={13} strokeWidth={1.5} />
                      {f.text}
                    </span>
                  ))}
                </div>
                <span className="room-btn inline-block btn-gold text-[10px] py-2.5 px-6 tracking-[0.2em]">
                  Müsaitlik & rezervasyon
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-start items-start sm:items-center mt-12">
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
