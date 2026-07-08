import { useTranslations } from "next-intl";
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

const AMENITY_KEYS = [
  { key: "pool", icon: Waves },
  { key: "kidsPool", icon: PersonStanding },
  { key: "restaurant", icon: UtensilsCrossed },
  { key: "breakfast", icon: Coffee },
  { key: "bar", icon: Wine },
  { key: "firepit", icon: Flame },
  { key: "wifi", icon: Wifi },
  { key: "parking", icon: CarFront },
  { key: "garden", icon: Leaf },
  { key: "luggage", icon: Briefcase },
  { key: "reception", icon: BellRing },
] as const;

export default function AmenitiesGrid() {
  const t = useTranslations("home.amenities");

  return (
    <section className="section-py bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-15">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}>{t("title")}</h2>
          <div className="divider-gold-center" />
          <p className="text-[15.5px] text-text-light max-w-[580px] mx-auto">
            {t("lede")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          {AMENITY_KEYS.map(({ key }) => (
            <div
              key={key}
              className="flex items-baseline justify-between gap-6 py-4 border-b border-border"
            >
              <h5 className="text-[13px] tracking-[1.2px] uppercase text-dark m-0 font-semibold">
                {t(`items.${key}.title`)}
              </h5>
              <p className="text-[13px] text-text-light m-0 text-right">
                {t(`items.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
