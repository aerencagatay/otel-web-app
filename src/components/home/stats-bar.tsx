const stats = [
  { value: "9.6", label: "Misafir puanı / 10" },
  { value: "28", label: "Butik oda" },
  { value: "5 km", label: "Kadırga koyu" },
  { value: "7.200 ₺", label: "Gece başlangıç" },
];

export default function StatsBar() {
  return (
    <div className="bg-dark py-10 md:py-11 border-y border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center text-white py-4 px-3 border-b border-white/10 md:border-b-0 md:border-r md:last:border-r-0 last:border-b-0 [&:nth-child(odd)]:max-md:border-r [&:nth-child(odd)]:max-md:border-white/10"
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
