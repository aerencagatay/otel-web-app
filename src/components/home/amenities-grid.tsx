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

// Bulgu O2: 11 olanak tek düz iki sütunlu listeydi, satın alma kararını
// etkileyen dört özellik (havuz, restoran, kahvaltı, otopark) bir tablo
// satırından farksızdı. Bu dört öğe artık ikonlu, öne çıkan kartlarda;
// geri kalan yedisi altında sade — ama başlığı gövde metni seviyesinde,
// artık gövdeden küçük değil — bir listede duruyor.
const PRIMARY_KEYS = [
  { key: "pool", icon: Waves },
  { key: "restaurant", icon: UtensilsCrossed },
  { key: "breakfast", icon: Coffee },
  { key: "parking", icon: CarFront },
] as const;

const SECONDARY_KEYS = [
  { key: "kidsPool", icon: PersonStanding },
  { key: "bar", icon: Wine },
  { key: "firepit", icon: Flame },
  { key: "wifi", icon: Wifi },
  { key: "garden", icon: Leaf },
  { key: "luggage", icon: Briefcase },
  { key: "reception", icon: BellRing },
] as const;

export default function AmenitiesGrid() {
  const t = useTranslations("home.amenities");

  return (
    <section className="section-py bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-15">
          <h2 className="type-section-title mx-auto">{t("title")}</h2>
          <div className="divider-gold-center" />
          <p className="text-[15.5px] text-text-light max-w-[580px] mx-auto">
            {t("lede")}
          </p>
        </div>

        {/* Dört ana olanak — görsel/ikonlu, taranabilir */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12">
          {PRIMARY_KEYS.map(({ key, icon: Icon }) => (
            <div key={key} className="amenity-card">
              <div className="amenity-icon">
                <Icon size={28} strokeWidth={1.5} className="text-dark" />
              </div>
              <h3 className="text-[16px] md:text-[17px] font-semibold text-dark m-0 mb-1.5">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-[13px] text-text-light m-0 leading-[1.5]">
                {t(`items.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* Kalan olanaklar — sade liste, ikon + başlık gövde seviyesinde */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 max-w-4xl mx-auto">
          {SECONDARY_KEYS.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="flex items-start gap-3 py-3.5 border-b border-border"
            >
              <Icon size={18} strokeWidth={1.5} className="text-stone-55 mt-0.5 shrink-0" />
              <div className="flex-1 flex items-baseline justify-between gap-4 min-w-0">
                <h3 className="text-[15px] text-dark m-0 font-semibold">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="text-[13px] text-text-light m-0 text-right">
                  {t(`items.${key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
