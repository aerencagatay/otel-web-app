import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Image
              src="/img/hotel.JPG"
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
              className="mb-4"
              style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}
            >
              Assos&apos;un Taş
              <br />
              Mirası ile Konfor
            </h2>
            <div className="divider-gold" />
            <p className="text-[15px] leading-[1.85] text-text mb-4">
              34 oda kapasitesi ile Büyükhusun Köyü&apos;nde, Assos&apos;un
              eşsiz doğası içinde konumlanan otelimiz; kahvaltı dahil ve yarım
              pansiyon seçenekleriyle misafirlerine hizmet vermektedir.
              Geleneksel taş mimarisinin sıcaklığı, modern konfor anlayışıyla
              buluşuyor.
            </p>
            <p className="text-[15px] leading-[1.85] text-text mb-4">
              Kadırga Koyu&apos;na 5 km, Antik Assos&apos;a dakikalar mesafede
              yer alan otelimiz; denizi, tarihi ve doğayı bir arada yaşamak
              isteyenler için eşsiz bir konaklama üssüdür.
            </p>
            <ul className="list-none p-0 my-6 mb-8 space-y-0">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-center gap-2.5 text-[14px] text-dark py-2 border-b border-border font-medium"
                >
                  <CheckCircle size={15} className="text-gold" />
                  {h}
                </li>
              ))}
            </ul>
            <Link href="/about" className="btn-gold">
              Daha Fazla Bilgi
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
