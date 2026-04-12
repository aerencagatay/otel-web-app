const stats = [
  { value: "9.6", label: "Misafir puanı / 10" },
  { value: "34", label: "Butik oda" },
  { value: "5 km", label: "Kadırga koyu" },
  { value: "3.500 ₺", label: "Gece başlangıç" },
];

export default function StatsBar() {
  return (
    <div className="bg-dark py-10 md:py-11 border-y border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center text-white py-4 px-3 md:border-r md:border-white/10 md:last:border-r-0 [&:nth-child(2)]:max-md:border-r-0"
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
