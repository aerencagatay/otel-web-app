import {
  Waves,
  PersonStanding,
  UtensilsCrossed,
  Coffee,
  Wine,
  Flame,
  Wifi,
  CarFront,
  Leaf,
  Briefcase,
  BellRing,
} from "lucide-react";

const amenities = [
  { icon: Waves, title: "Açık Havuz", desc: "Deniz manzaralı yüzme havuzu" },
  {
    icon: PersonStanding,
    title: "Çocuk Havuzu",
    desc: "Küçük misafirlerimiz için ayrı havuz",
  },
  {
    icon: UtensilsCrossed,
    title: "A La Carte Restoran",
    desc: "Deniz manzaralı özgün Ege mutfağı",
  },
  {
    icon: Coffee,
    title: "Kahvaltı Dahil",
    desc: "08:30–10:30 ısmarlamalı servis",
  },
  { icon: Wine, title: "Bar", desc: "Havuz başı ve lounge bar" },
  {
    icon: Flame,
    title: "Firepit Alanı",
    desc: "Deniz manzaralı açık hava ateş köşesi",
  },
  {
    icon: Wifi,
    title: "Ücretsiz Wi-Fi",
    desc: "Tüm alanlarda kesintisiz internet",
  },
  {
    icon: CarFront,
    title: "Ücretsiz Otopark",
    desc: "Geniş açık otopark alanı",
  },
  { icon: Leaf, title: "Bahçe", desc: "Huzurlu peyzajlı bahçe alanı" },
  {
    icon: Briefcase,
    title: "Bagaj Muhafazası",
    desc: "Erken/geç çıkışlar için emanet",
  },
  {
    icon: BellRing,
    title: "7/24 Resepsiyon",
    desc: "Her an yanınızdayız",
  },
];

export default function AmenitiesGrid() {
  return (
    <section className="section-py bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-15">
          <span className="eyebrow">Olanaklar</span>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
            Otel Özellikleri
          </h2>
          <div className="divider-gold-center" />
          <p className="text-[15.5px] text-text-light max-w-[580px] mx-auto">
            Size en iyi konaklama deneyimini sunmak için tasarlanmış
            olanaklarımız.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {amenities.map((a, i) => (
            <div key={i} className="amenity-card">
              <div className="amenity-icon">
                <a.icon size={26} className="text-gold transition-colors" />
              </div>
              <h5 className="text-[13px] tracking-[1.2px] uppercase mb-2">
                {a.title}
              </h5>
              <p className="text-[13px] text-text-light m-0">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
