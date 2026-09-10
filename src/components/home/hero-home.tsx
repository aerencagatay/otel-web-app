import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone } from "lucide-react";
import { HOTEL } from "@/lib/config/hotel";
import HeroBookingStrip from "./hero-booking-strip";
import HeroVideo from "./hero-video";

/** Telefon numarası tek kaynaktan (AGENTS.md kanonik bilgisi). */
const TEL_HREF = `tel:${HOTEL.phone.replace(/\s/g, "")}`;

export default function HeroHome() {
  const t = useTranslations("home.hero");
  return (
    <section className="hero-home">
      <HeroVideo />
      <div className="hero-home-inner">
        <span className="hero-tag animate-fade-up">{t("tag")}</span>
        <h1
          className="type-display text-white mb-5 animate-fade-up animate-fade-up-delay-1"
          style={{ fontSize: "clamp(2.65rem, 8.5vw, 5.15rem)" }}
        >
          {t("titleLine1")}
          <br />
          <span className="text-white font-normal italic font-heading">
            {t("titleLine2")}
          </span>
        </h1>
        {/* Bulgu K2: rengi text-white/80'den tam beyaza, boyutu 15px'ten
            18px'e çekildi. Genişlik .measure-tight (46ch) ile sınırlandı —
            önceki hâli beş öğeli orta noktalı bir listeydi ve tek satırda
            okunmuyordu. Kontrastı artık .hero-home::before'daki yönlü
            scrim garanti ediyor, video karesi değil. */}
        <p className="measure-tight text-white text-[18px] leading-[1.6] mb-2 font-normal animate-fade-up animate-fade-up-delay-2">
          {t("lede")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mt-10 animate-fade-up animate-fade-up-delay-2 max-w-md sm:max-w-none">
          {/* Koyu hero üzerinde .btn-cta-solid (mürekkep dolgu) scrim'e
              karışıp görünmez oluyordu — birincil aksiyon için kabul
              edilemez. Deniz dolgulu .btn-gold koyu zeminde ayrışıyor. */}
          <Link href="/reservation" className="btn-gold no-underline">
            {t("ctaDates")}
          </Link>
          <Link href="/rooms" className="btn-outline-light no-underline">
            {t("ctaRooms")}
          </Link>
        </div>
        {/* Yüksek niyetli aksiyon: telefon. Dokunma hedefi min 44px (Y4). */}
        <a
          href={TEL_HREF}
          className="inline-flex items-center gap-2 mt-5 min-h-[44px] text-white/85 text-[15px] no-underline hover:text-white transition-colors animate-fade-up animate-fade-up-delay-2"
        >
          <Phone className="w-4 h-4 opacity-80" strokeWidth={1.5} />
          {HOTEL.phone}
        </a>
      </div>

      <HeroBookingStrip />

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-2 flex flex-col items-center gap-1.5 text-white/40 text-[8px] tracking-[0.4em] uppercase pointer-events-none">
        <span>{t("scroll")}</span>
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
