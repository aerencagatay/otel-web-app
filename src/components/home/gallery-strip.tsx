import Image from "next/image";
import { useTranslations } from "next-intl";

const ITEMS = [
  { key: "venue", src: "/img/hotel-2-web.jpg", mosaicClass: "gallery-mosaic__hero" },
  { key: "family", src: "/img/aile-suit.webp", mosaicClass: "gallery-mosaic__a" },
  { key: "view", src: "/img/hero-web.jpg", mosaicClass: "gallery-mosaic__b" },
  { key: "pool", src: "/img/havuz.webp", mosaicClass: "gallery-mosaic__c" },
] as const;

export default function GalleryStrip() {
  const t = useTranslations("home.gallery");

  return (
    <section className="gallery-section">
      <div className="max-w-7xl mx-auto px-4 mb-10 md:mb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="text-[10px] tracking-[0.35em] uppercase text-gold-light font-semibold">
              {t("eyebrow")}
            </span>
            <h2
              className="font-heading font-semibold text-white mt-2 mb-0 tracking-tight"
              style={{ fontSize: "clamp(1.85rem, 3.5vw, 2.65rem)" }}
            >
              {t("title")}
            </h2>
            <div
              className="w-12 h-px mt-4"
              style={{
                background: "rgba(255,255,255,0.35)",
              }}
            />
          </div>
          <p className="text-white/55 text-[14px] max-w-sm m-0 leading-relaxed md:text-right">
            {t("lede")}
          </p>
        </div>
      </div>

      <div className="px-2 sm:px-4">
        <div className="gallery-mosaic">
          {ITEMS.map((item) => (
            <div
              key={item.mosaicClass}
              className={`gallery-item relative ${item.mosaicClass}`}
            >
              <Image
                src={item.src}
                alt={t(`items.${item.key}.alt`)}
                fill
                sizes="(max-width: 991px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="gallery-overlay">
                <div>
                  <h3 className="gallery-overlay__title">
                    {t(`items.${item.key}.title`)}
                  </h3>
                  <p className="gallery-overlay__desc">
                    {t(`items.${item.key}.desc`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
