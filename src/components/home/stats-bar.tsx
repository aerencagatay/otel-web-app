import { useTranslations } from "next-intl";

export default function StatsBar() {
  const t = useTranslations("home.stats");
  const stats = [
    { value: "9.6", label: t("guestScore") },
    { value: "28", label: t("boutiqueRooms") },
    { value: "5 km", label: t("bay") },
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
