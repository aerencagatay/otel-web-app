const stats = [
  { value: "9.6", label: "Misafir Puanı / 10" },
  { value: "34", label: "Oda" },
  { value: "5", label: "km. Kadırga Koyu'na" },
  { value: "3.500 ₺", label: "den Başlayan / Gece" },
];

export default function StatsBar() {
  return (
    <div className="bg-dark py-9">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center text-white py-3 px-2.5 border-r border-white/10 last:border-r-0 max-md:border-b max-md:border-r-0 max-md:last:border-b-0"
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
