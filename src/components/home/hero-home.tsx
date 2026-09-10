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
        <span className="hero-tag">{t("tag")}</span>
        {/* Sahnedeki TEK hareket (§8.10): iki satır 400ms arayla belirir,
            scrim aynı anda açılır, 900ms'de sahne durur. Inline `fontSize`
            kaldırıldı — 42→82px veriyordu, sabit 40→76px olmalı; ölçü artık
            `.type-display` token'ından geliyor. */}
        <h1 className="type-display text-white mb-5">
          <span className="hero-line hero-line-1">{t("titleLine1")}</span>
          {/* İtalik ikinci satır §8.4'e göre iki satırlık bir kompozisyon
              olarak izinli (tek kelime vurgusu değil). Ağırlık 400 değil
              500: 76px'te 600 roman ile 400 italik arasındaki kırılma
              gözle görülüyordu, satırlar tek blok okunmuyordu. */}
          <span className="hero-line hero-line-2 text-white italic font-heading font-medium">
            {t("titleLine2")}
          </span>
        </h1>
        {/* Bulgu K2: rengi text-white/80'den tam beyaza, boyutu 15px'ten
            18px'e çekildi. Genişlik .measure-tight (46ch) ile sınırlandı —
            önceki hâli beş öğeli orta noktalı bir listeydi ve tek satırda
            okunmuyordu. Kontrastı artık .hero-home::before'daki yönlü
            scrim garanti ediyor, video karesi değil. */}
        <p className="measure-tight text-white text-[18px] leading-[1.6] mb-2 font-normal">
          {t("lede")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mt-10 max-w-md sm:max-w-none">
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
          className="inline-flex items-center gap-2 mt-5 min-h-[44px] text-white/85 text-[15px] no-underline hover:text-white transition-colors"
        >
          <Phone className="w-4 h-4 opacity-80" strokeWidth={1.5} />
          {HOTEL.phone}
        </a>
      </div>

      <HeroBookingStrip />
      {/* Scroll göstergesi kaldırıldı: sonsuz `scrollPulse` döngüsü §8.10'un
          yasak listesindeydi, metin sola alındığı hâlde ortada duruyordu ve
          8px / 0.4em BÜYÜK HARF beyaz/40 ile ~1.9:1 kontrasttaydı (hem
          okunmuyor hem Y5'in kalıbı). Kaydırma daveti artık yapısal:
          mobilde 88svh sonraki bölümü gösteriyor, masaüstünde arama kartı
          hero'nun alt kenarına biniyor. */}
    </section>
  );
}
