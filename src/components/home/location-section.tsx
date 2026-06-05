import Image from "next/image";
import { MapPin, Navigation } from "lucide-react";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Assos+Karadut+Taş+Otel+Büyükhusun+Ayvacık";

const locations = [
  {
    num: "5",
    title: "Kadırga Koyu",
    desc: "km · Berrak Ege sularında serinleme",
  },
  {
    num: "10",
    title: "Antik Assos (Behramkale)",
    desc: "dk · Aristo'nun kenti, Athena Tapınağı",
  },
  {
    num: "10",
    title: "Assos Limanı",
    desc: "dk · Balık restoranları ve tekneler",
  },
  {
    num: "11",
    title: "Ayvacık Merkez",
    desc: "km · En yakın ilçe merkezi",
  },
  {
    num: "37",
    title: "Kazdağı Milli Parkı",
    desc: "km · Ida Dağı doğa yürüyüşleri",
  },
];

export default function LocationSection() {
  return (
    <section className="section-py bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="eyebrow">Konum</span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
              Her Şeye
              <br />
              Yakın, Gürültüden
              <br />
              Uzak
            </h2>
            <div className="divider-gold" />
            <p className="mb-4 text-[15px] text-text">
              Büyükhusun Köyü&apos;nün sakin atmosferinde, Ege&apos;nin en
              gözde noktalarına dakikalar mesafedeyiz.
            </p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold-dark text-[11px] font-semibold tracking-[0.2em] uppercase no-underline border-b border-gold-dark/40 pb-0.5 hover:border-gold-dark transition-colors mb-6"
            >
              <Navigation size={14} /> Yol tarifi al
            </a>
            {locations.map((loc, i) => (
              <div key={i} className="location-item">
                <div className="location-num">{loc.num}</div>
                <div>
                  <h6 className="text-[14px] mb-0.5 font-bold">{loc.title}</h6>
                  <p className="text-[12.5px] text-text-light m-0">
                    {loc.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Haritalar'da konumu aç"
              className="group relative block overflow-hidden"
            >
              <Image
                src="/img/konum.png"
                alt="Otel konumu - Harita"
                width={600}
                height={480}
                className="w-full h-[480px] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 bg-dark/0 group-hover:bg-dark/15 transition-colors" />
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 bg-dark/85 text-white text-[11px] tracking-[0.18em] uppercase font-semibold px-4 py-2.5 backdrop-blur-sm whitespace-nowrap">
                <MapPin size={14} /> Google Haritalar&apos;da Aç
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
