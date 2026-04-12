import Link from "next/link";
import { Phone } from "lucide-react";

export default function HeroHome() {
  return (
    <section className="hero-home">
      <div className="relative z-2 text-white max-w-[820px] px-5">
        <span className="hero-tag">Assos · Çanakkale · Türkiye</span>
        <h1
          className="text-white leading-[1.1] mb-5 font-bold"
          style={{ fontSize: "clamp(38px, 6.5vw, 84px)" }}
        >
          Taşın Kalbinde
          <br />
          Huzurun Adresi
        </h1>
        <p
          className="font-light opacity-90 mb-11 tracking-wide"
          style={{ fontSize: "clamp(13px, 1.8vw, 17px)" }}
        >
          Tarihi Assos&apos;un eşsiz doğasında,
          <br />
          geleneksel taş mimarisiyle buluşan lüks konaklama deneyimi.
        </p>
        <div className="flex gap-3.5 justify-center flex-wrap">
          <Link href="/rooms" className="btn-gold">
            Odalarımızı Keşfet
          </Link>
          <a href="tel:+905010913417" className="btn-outline-light">
            <Phone className="inline w-4 h-4 mr-2" />
            Rezervasyon Hattı
          </a>
        </div>
      </div>
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-2 flex flex-col items-center gap-1.5 text-white/65 text-[10px] tracking-[3px] uppercase">
        <span>Kaydır</span>
        <div
          className="w-px h-[50px]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.7), transparent)",
            animation: "scrollPulse 2s infinite",
          }}
        />
      </div>
    </section>
  );
}
