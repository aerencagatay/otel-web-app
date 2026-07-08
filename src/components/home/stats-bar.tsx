import { getAverageRating, getReviewCount } from "@/lib/config/reviews";
import { HOTEL } from "@/lib/config/hotel";

export default function StatsBar() {
  const average = getAverageRating();
  const reviewCount = getReviewCount();

  // Only ever show a rating stat when it is backed by real reviews
  // (src/lib/config/reviews.ts) — never a hardcoded/unsubstantiated number.
  const stats = [
    ...(average != null
      ? [{ value: `${average.toLocaleString("tr-TR")}/5`, label: `Misafir puanı · ${reviewCount} yorum` }]
      : []),
    { value: String(HOTEL.totalRooms), label: "Butik oda" },
    { value: "5 km", label: "Kadırga koyu" },
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
