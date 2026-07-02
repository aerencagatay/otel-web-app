const stats = [
  { value: "9.6", label: "Misafir puanı / 10" },
  { value: "28", label: "Butik oda" },
  { value: "5 km", label: "Kadırga koyu" },
  { value: "7.200 ₺", label: "Gece başlangıç" },
];

export default function StatsBar() {
  return (
    <div className="bg-ivory py-10 md:py-11 border-y border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center text-dark py-4 px-3 border-b border-border md:border-b-0 md:border-r md:last:border-r-0 last:border-b-0 [&:nth-child(odd)]:max-md:border-r [&:nth-child(odd)]:max-md:border-border"
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
