import Link from "next/link";
import Image from "next/image";
import { Ruler, Users, Waves, Wifi } from "lucide-react";

const rooms = [
  {
    name: "Deluxe Deniz Manzaralı",
    price: "3.500 ₺'den / Gece",
    image:
      "https://cdng.jollytur.com/files/cms/media/hotel/room/5f6475c4-9c9a-4640-a5dc-115fa6ffb7be-600.jpeg",
    features: [
      { icon: Ruler, text: "24 m²" },
      { icon: Users, text: "2 Kişi" },
      { icon: Waves, text: "Deniz Manzarası" },
    ],
  },
  {
    name: "Deluxe Kısmi Deniz Manzaralı",
    price: "Fiyat için arayın",
    image:
      "https://cdng.jollytur.com/files/cms/media/hotel/room/2e20db12-6c15-49eb-8b30-5cbd53389e78-600.jpeg",
    features: [
      { icon: Ruler, text: "22 m²" },
      { icon: Users, text: "2 Kişi" },
      { icon: Wifi, text: "Wi-Fi" },
    ],
  },
  {
    name: "Aile Odası",
    price: "Fiyat için arayın",
    image:
      "https://cdng.jollytur.com/files/cms/media/hotel/room/e21e4d3b-f71b-43ce-9dfd-a6b7bb92f9cc-600.jpeg",
    features: [
      { icon: Ruler, text: "44 m²" },
      { icon: Users, text: "4 Kişiye Kadar" },
      { icon: Wifi, text: "Wi-Fi" },
    ],
  },
];

export default function FeaturedRooms() {
  return (
    <section className="section-py bg-warm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-15">
          <span className="eyebrow">Konfor &amp; Şıklık</span>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>Odalarımız</h2>
          <div className="divider-gold-center" />
          <p className="text-[15.5px] text-text-light max-w-[580px] mx-auto">
            Her oda, Ege&apos;nin ruhunu yansıtacak şekilde özene tasarlandı.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {rooms.map((room, i) => (
            <Link key={i} href="/rooms" className="room-card">
              <Image
                src={room.image}
                alt={room.name}
                width={600}
                height={420}
                className="w-full h-full object-cover"
              />
              <div className="room-overlay" />
              <div className="room-info">
                <div className="font-heading text-[22px] text-white mb-1">
                  {room.name}
                </div>
                <div className="text-gold-light text-[13.5px] font-bold tracking-wide mb-2.5">
                  {room.price}
                </div>
                <div className="flex gap-4.5 text-[12.5px] opacity-75 mb-4.5">
                  {room.features.map((f, j) => (
                    <span key={j} className="flex items-center gap-1">
                      <f.icon size={12} />
                      {f.text}
                    </span>
                  ))}
                </div>
                <span className="room-btn btn-gold text-[10px] py-2.5 px-5">
                  İncele
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/rooms" className="btn-dark-sq">
            Tüm Odaları Gör
          </Link>
        </div>
      </div>
    </section>
  );
}
