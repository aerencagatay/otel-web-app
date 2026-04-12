import Image from "next/image";

const items = [
  {
    src: "/img/hotel-2.JPG",
    alt: "Odalarımız",
    title: "Odalarımız",
    desc: "Taş mimarisi ile konfor",
  },
  {
    src: "/img/aile_odası.webp",
    alt: "Aile Odası",
    title: "Aile Odası",
    desc: "Geniş ve ferah",
  },
  {
    src: "/img/hero.JPG",
    alt: "Manzara",
    title: "Manzara",
    desc: "Ege'nin güzelliği",
  },
  {
    src: "/img/havuz.webp",
    alt: "Havuz",
    title: "Havuz",
    desc: "Serinleme ve keyif",
  },
];

export default function GalleryStrip() {
  return (
    <div className="grid grid-cols-4 gap-[5px] gallery-grid-4">
      {items.map((item, i) => (
        <div key={i} className="gallery-item">
          <Image
            src={item.src}
            alt={item.alt}
            width={400}
            height={400}
            className="w-full h-full object-cover"
          />
          <div className="gallery-overlay">
            <div className="text-white text-center p-5">
              <h5 className="font-heading text-white text-[18px] mb-1">
                {item.title}
              </h5>
              <p className="text-[12px] opacity-90 m-0">{item.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
