import { useLocale, useTranslations } from "next-intl";
import { getAverageRating, getRatedReviewCount } from "@/lib/config/reviews";
import { HOTEL } from "@/lib/config/hotel";

/**
 * Bulgu D2: bant yalnızca iki etkisiz sayıdan (28 oda / 5 km) ibaretti.
 * Üçüncü, anlamlı bir veri olarak AGENTS.md'deki kanonik giriş saati
 * eklendi — uydurma bir istatistik değil, misafirin arama öncesi merak
 * ettiği gerçek bir operasyonel bilgi. Etiketi zaten var olan
 * `home.bookingStrip.checkIn` çeviri anahtarından ("Giriş") geliyor; yeni
 * bir metin eklenmedi.
 *
 * Kolon sayısı KASITLI olarak her zaman üçte sabitlenir (misafir puanı
 * geldiğinde giriş saatinin yerini alır, üste eklenmez): `.stat-number`
 * sabit 40px punto kullanıyor (globals.css, bu dosyadan değiştirilemez) —
 * dört dar kolonda "14:00" gibi bir değer 390px'te taşabilir/sarabilir.
 * Üç kolon, denenmiş ve güvenli genişlik.
 */
export default function StatsBar() {
  const t = useTranslations("home.stats");
  const tBooking = useTranslations("home.bookingStrip");
  const locale = useLocale();
  const intlLocale = locale === "en" ? "en-US" : "tr-TR";

  // Null while no review carries a CONFIRMED star rating (inferred values
  // are never stored in reviews.ts) — the badge is hidden entirely then.
  const average = getAverageRating();
  const reviewCount = getRatedReviewCount();

  const ratingStat =
    average != null
      ? {
          value: `${average.toLocaleString(intlLocale)}/5`,
          label: t("guestRating", { count: reviewCount }),
        }
      : null;

  const stats = ratingStat
    ? [ratingStat, { value: String(HOTEL.totalRooms), label: t("boutiqueRooms") }, { value: "5 km", label: t("bay") }]
    : [
        { value: String(HOTEL.totalRooms), label: t("boutiqueRooms") },
        { value: "5 km", label: t("bay") },
        { value: HOTEL.checkIn, label: tBooking("checkIn") },
      ];

  return (
    <div className="bg-ivory py-10 md:py-11 border-y border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center text-dark py-4 px-3 border-r border-border last:border-r-0"
            >
              <span className="stat-number">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
