import Image from "next/image";

const items = [
  {
    src: "/img/hotel-2.JPG",
    alt: "Otel ve çevre",
    title: "Mekân",
    desc: "Taş ve Ege ışığı",
    mosaicClass: "gallery-mosaic__hero",
  },
  {
    src: "/img/aile_odası.webp",
    alt: "Aile odası",
    title: "Aile odası",
    desc: "Geniş alan",
    mosaicClass: "gallery-mosaic__a",
  },
  {
    src: "/img/hero.JPG",
    alt: "Manzara",
    title: "Manzara",
    desc: "Deniz ve gökyüzü",
    mosaicClass: "gallery-mosaic__b",
  },
  {
    src: "/img/havuz.webp",
    alt: "Havuz",
    title: "Havuz",
    desc: "Serinlik",
    mosaicClass: "gallery-mosaic__c",
  },
];

export default function GalleryStrip() {
  return (
    <section className="gallery-section">
      <div className="max-w-7xl mx-auto px-4 mb-10 md:mb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="text-[10px] tracking-[0.35em] uppercase text-gold-light font-semibold">
              Galeri
            </span>
            <h2
              className="font-heading font-semibold text-white mt-2 mb-0 tracking-tight"
              style={{ fontSize: "clamp(1.85rem, 3.5vw, 2.65rem)" }}
            >
              Kareler
            </h2>
            <div
              className="w-12 h-px mt-4"
              style={{
                background: "linear-gradient(90deg, rgba(196,176,138,0.9), transparent)",
              }}
            />
          </div>
          <p className="text-white/55 text-[14px] max-w-sm m-0 leading-relaxed md:text-right">
            Otelden ve çevreden seçilmiş kareler — odalar, manzara ve havuz.
          </p>
        </div>
      </div>

      <div className="px-2 sm:px-4">
        <div className="gallery-mosaic">
          {items.map((item) => (
            <div
              key={item.mosaicClass}
              className={`gallery-item relative min-h-[200px] h-full ${item.mosaicClass}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 991px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="gallery-overlay">
                <div>
                  <h3 className="gallery-overlay__title">{item.title}</h3>
                  <p className="gallery-overlay__desc">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
