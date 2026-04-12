import Link from "next/link";
import { Phone } from "lucide-react";
import HeroBookingStrip from "./hero-booking-strip";

export default function HeroHome() {
  return (
    <section className="hero-home">
      <div className="hero-home-inner">
        <span className="hero-tag animate-fade-up">Assos · Çanakkale</span>
        <h1
          className="type-display text-white mb-5 animate-fade-up animate-fade-up-delay-1"
          style={{ fontSize: "clamp(2.65rem, 8.5vw, 5.15rem)" }}
        >
          Taşın kalbinde,
          <br />
          <span className="text-white/[0.88] font-normal italic font-heading">
            Ege&apos;nin üstünde.
          </span>
        </h1>
        <p
          className="type-lede text-white/80 max-w-[34rem] mx-auto mb-2 font-normal animate-fade-up animate-fade-up-delay-2"
        >
          Butik konaklama · 34 oda · havuz · A La Carte · Kadırga&apos;ya dakikalar
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center mt-10 animate-fade-up animate-fade-up-delay-2 max-w-md sm:max-w-none mx-auto">
          <Link href="/reservation" className="btn-cta-solid no-underline text-center">
            Tarih seç &amp; müsaitlik
          </Link>
          <Link href="/rooms" className="btn-outline-light no-underline text-center">
            Odaları incele
          </Link>
        </div>
        <a
          href="tel:+905010913417"
          className="inline-flex items-center justify-center gap-2 mt-6 text-white/70 text-[12px] tracking-wide no-underline hover:text-white transition-colors animate-fade-up animate-fade-up-delay-2"
        >
          <Phone className="w-4 h-4 opacity-80" strokeWidth={1.5} />
          +90 501 091 34 17
        </a>
      </div>

      <HeroBookingStrip />

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-2 flex flex-col items-center gap-1.5 text-white/40 text-[8px] tracking-[0.4em] uppercase pointer-events-none">
        <span>Kaydır</span>
        <div
          className="w-px h-9"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.45), transparent)",
            animation: "scrollPulse 2s infinite",
          }}
        />
      </div>
    </section>
  );
}
