

import Image from "next/image";
import Link from "next/link";

const highlights = [
  "Açık yüzme havuzu",
  "A La Carte Restoran",
  "Kahvaltı dahil seçenek",
  "Ücretsiz açık otopark",
];

export default function AboutSnippet() {
  return (
    <section className="section-py bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <Image
              src="/img/hotel-web.jpg"
              alt="Assos Karadut Taş Otel"
              width={600}
              height={520}
              className="w-full h-[520px] object-cover"
            />
            <div className="about-accent" />
          </div>

          <div className="lg:pl-14">
            <span className="eyebrow">Hakkımızda</span>
            <h2
              className="mb-6 font-normal"
              style={{ fontSize: "clamp(28px, 4.2vw, 52px)", lineHeight: 1.18 }}
            >
              Assos&apos;un Taş
              <br />
              Mirası ile Konfor
            </h2>
            <p className="text-[15px] leading-[1.85] text-text mb-4">
              28 oda kapasitesi ile Büyükhusun Köyü&apos;nde, Assos&apos;un
              eşsiz doğası içinde konumlanan otelimiz; kahvaltı dahil ve yarım
              pansiyon seçenekleriyle misafirlerine hizmet vermektedir.
              Geleneksel taş mimarisinin sıcaklığı, modern konfor anlayışıyla
              buluşuyor.
            </p>
            <p className="text-[15px] leading-[1.85] text-text mb-8">
              Kadırga Koyu&apos;na 5 km, Antik Assos&apos;a dakikalar mesafede
              yer alan otelimiz; denizi, tarihi ve doğayı bir arada yaşamak
              isteyenler için eşsiz bir konaklama üssüdür.
            </p>
            <ul className="list-none p-0 mb-9">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="text-[13.5px] tracking-[0.04em] text-dark py-3 border-b border-border first:border-t first:border-border"
                >
                  {h}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="text-[11px] font-semibold tracking-[0.22em] uppercase text-gold-dark no-underline border-b border-gold-dark/40 pb-1 hover:border-gold-dark transition-colors"
            >
              Daha Fazla Bilgi
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
