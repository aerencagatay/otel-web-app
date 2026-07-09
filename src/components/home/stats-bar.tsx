import { useLocale, useTranslations } from "next-intl";
import { getAverageRating, getRatedReviewCount } from "@/lib/config/reviews";
import { HOTEL } from "@/lib/config/hotel";

export default function StatsBar() {
  const t = useTranslations("home.stats");
  const locale = useLocale();
  const intlLocale = locale === "en" ? "en-US" : "tr-TR";

  // Null while no review carries a CONFIRMED star rating (inferred values
  // are never stored in reviews.ts) — the badge is hidden entirely then.
  const average = getAverageRating();
  const reviewCount = getRatedReviewCount();

  // Only ever show a rating stat when it is backed by real rated reviews
  // (src/lib/config/reviews.ts) — never a hardcoded/unsubstantiated number.
  const stats = [
    ...(average != null
      ? [
          {
            value: `${average.toLocaleString(intlLocale)}/5`,
            label: t("guestRating", { count: reviewCount }),
          },
        ]
      : []),
    { value: String(HOTEL.totalRooms), label: t("boutiqueRooms") },
    { value: "5 km", label: t("bay") },
  ];

  return (
    <div className="bg-ivory py-10 md:py-11 border-y border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className={`grid ${stats.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
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
