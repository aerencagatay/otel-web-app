"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin, Navigation } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Assos+Karadut+Taş+Otel+Büyükhusun+Ayvacık";

const LOCATION_KEYS = [
  { key: "bay", num: "5" },
  { key: "assos", num: "10" },
  { key: "harbor", num: "10" },
  { key: "town", num: "11" },
  { key: "park", num: "37" },
] as const;

/**
 * Bulgu Y5 + "Yenilikçi katman": statik 5 satırlık mesafe listesi yerine
 * seçilebilir sekmeler + tek bir büyük detay paneli. Sekme değiştiğinde
 * hem sol taraftaki mesafe kartı hem de sağdaki harita üzerindeki rozet
 * aynı anda güncellenir — "harita ile bağlantılı" etkileşim burada. Sayı
 * ve mesafe birimleri (km/dk) AGENTS.md ve mevcut çeviri anahtarlarından
 * geliyor, hiçbir değer türetilmedi/uydurulmadı.
 */
export default function LocationSection() {
  const t = useTranslations("home.location");
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeLoc = LOCATION_KEYS[active];

  return (
    <section className="section-py bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="type-section-title mb-0">
              {t("titleLine1")}
              <br />
              {t("titleLine2")}
              <br />
              {t("titleLine3")}
            </h2>
            <div className="divider-gold" />
            <p className="mb-6 text-[15px] text-text measure-tight">{t("intro")}</p>

            {/* Mesafe seçici — tıklanan/dokunulan konum aşağıda büyütülür. */}
            <div
              className="flex flex-wrap gap-2 mb-6"
              role="tablist"
              aria-label={t("titleLine1")}
            >
              {LOCATION_KEYS.map((loc, i) => (
                <button
                  key={loc.key}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => setActive(i)}
                  className={`inline-flex items-center min-h-[44px] px-4 rounded-[var(--radius-sm)] border text-[12.5px] font-semibold tracking-[0.01em] transition-colors ${
                    active === i
                      ? "bg-dark border-dark text-white"
                      : "bg-transparent border-border text-dark hover:border-gold"
                  }`}
                >
                  {t(`items.${loc.key}.title`)}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeLoc.key}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.2, 0.7, 0.3, 1] }}
                className="flex items-center gap-4 mb-7 min-h-[64px]"
              >
                <div className="location-num">{activeLoc.num}</div>
                <div>
                  <h6 className="text-[14px] mb-0.5 font-bold">
                    {t(`items.${activeLoc.key}.title`)}
                  </h6>
                  <p className="text-[12.5px] text-text-light m-0">
                    {t(`items.${activeLoc.key}.desc`)}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold-dark text-[11px] font-semibold tracking-[0.2em] uppercase no-underline border-b border-gold-dark/40 pb-0.5 hover:border-gold-dark transition-colors"
            >
              <Navigation size={14} /> {t("directions")}
            </a>
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

              {/* Seçili mesafeyi haritaya bağlayan rozet — sekme değiştikçe günceller. */}
              <div className="absolute top-4 left-4">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeLoc.key}
                    initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: [0.2, 0.7, 0.3, 1] }}
                    className="inline-flex items-center gap-1.5 bg-white/95 text-dark text-[11px] font-semibold tracking-[0.04em] px-3 py-2 rounded-[var(--radius-xs)] shadow-[var(--shadow-soft)]"
                  >
                    <MapPin size={13} className="text-gold-dark" />
                    {t(`items.${activeLoc.key}.title`)}
                  </motion.span>
                </AnimatePresence>
              </div>

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
