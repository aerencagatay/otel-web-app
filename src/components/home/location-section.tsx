import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin, Navigation } from "lucide-react";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Assos+Karadut+Taş+Otel+Büyükhusun+Ayvacık";

const LOCATION_KEYS = [
  { key: "bay", num: "5" },
  { key: "assos", num: "10" },
  { key: "harbor", num: "10" },
  { key: "town", num: "11" },
  { key: "park", num: "37" },
] as const;

export default function LocationSection() {
  const t = useTranslations("home.location");

  return (
    <section className="section-py bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="eyebrow">{t("eyebrow")}</span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>
              {t("titleLine1")}
              <br />
              {t("titleLine2")}
              <br />
              {t("titleLine3")}
            </h2>
            <div className="divider-gold" />
            <p className="mb-4 text-[15px] text-text">{t("intro")}</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold-dark text-[11px] font-semibold tracking-[0.2em] uppercase no-underline border-b border-gold-dark/40 pb-0.5 hover:border-gold-dark transition-colors mb-6"
            >
              <Navigation size={14} /> {t("directions")}
            </a>
            {LOCATION_KEYS.map((loc) => (
              <div key={loc.key} className="location-item">
                <div className="location-num">{loc.num}</div>
                <div>
                  <h6 className="text-[14px] mb-0.5 font-bold">
                    {t(`items.${loc.key}.title`)}
                  </h6>
                  <p className="text-[12.5px] text-text-light m-0">
                    {t(`items.${loc.key}.desc`)}
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
              aria-label={t("mapAria")}
              className="group relative block overflow-hidden"
            >
              <Image
                src="/img/konum.png"
                alt={t("mapAlt")}
                width={600}
                height={480}
                className="w-full h-[480px] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 bg-dark/0 group-hover:bg-dark/15 transition-colors" />
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 bg-dark/85 text-white text-[11px] tracking-[0.18em] uppercase font-semibold px-4 py-2.5 backdrop-blur-sm whitespace-nowrap">
                <MapPin size={14} /> {t("mapCta")}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
