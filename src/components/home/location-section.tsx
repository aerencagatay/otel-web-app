import Image from "next/image";

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
            <Image
              src="/img/konum.png"
              alt="Otel konumu - Harita"
              width={600}
              height={480}
              className="w-full h-[480px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
