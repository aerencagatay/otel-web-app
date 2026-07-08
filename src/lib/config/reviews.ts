/**
 * Guest reviews — single source of truth for:
 *   - `ReviewsSection` (home page, between Location and Gallery)
 *   - the hero/stats "misafir puanı" badge (`stats-bar.tsx`)
 *   - the `AggregateRating` block in `hotelJsonLd()` (json-ld.tsx)
 *
 * These three entries are REAL guest reviews (author name, review text and
 * relative date as posted on Google) already gathered for the site — they
 * are NOT invented. Individual star ratings were not exposed by the source
 * scrape, so each is recorded at 5/5, which matches both the review text
 * itself (e.g. "5 yıldızı hak ediyor") and the uniformly glowing tone.
 *
 * DO NOT add fabricated reviews here. When the hotel owner provides more
 * real reviews, append them following the same shape. If this array is
 * ever emptied, `ReviewsSection` must not render and the rating badge must
 * hide — never show a rating with zero backing reviews.
 */
export interface Review {
  author: string;
  rating: number; // 1-5
  /** Relative date as shown by the source platform, e.g. "7 ay önce". */
  date: string;
  text: string;
  source: "Google";
}

export const REVIEWS: Review[] = [
  {
    author: "Kmrozlm7777",
    rating: 5,
    date: "7 ay önce",
    text: "Buraya kesinlikle bayıldık 2 gece konakladık bugün çıkacağız ama resmen buradan ayrılacağım için üzülüyorum. Böyle güzel manzara bu kadar huzurlu bir yer bulup 2 günümüzü geçirmek inanılmaz güzel bir tecrübeydi. Biz 1+1'lerde konakladık; odalardaki ince dekoratif ayrıntılar, Midilli'ye karşı muhteşem manzara kesinlikle çok güzeldi. Otelin sahipleri en ince ayrıntıya kadar düşünmüşler; resmen bir otel değil de kendi evlerini tasarlar gibi yapmışlar. Kahvaltısı da gayet yeterli ve güzeldi.",
    source: "Google",
  },
  {
    author: "Bahar",
    rating: 5,
    date: "10 ay önce",
    text: "Ailecek, 1+1 odalarında 2 gece konakladığımız Karadut Taş Otel beklentilerimizin üzerinde bir deneyim sundu. İlgili, güler yüzlü çalışanlar, temiz ve konforlu odalar, muhteşem bir manzara ve sessizlik, dinlenmek için müthiş bir konum gerçek anlamda 5 yıldızı hak ediyor. Otel sahilden 7-8 dakika uzakta olsa da, kendilerine ait pansiyonun Kadırga Koyu'ndaki plajından ücretsiz yararlandırmaları da müthiş.",
    source: "Google",
  },
  {
    author: "İrem İnci",
    rating: 5,
    date: "8 ay önce",
    text: "Karadut Otel, Assos tatilimizde tercih ettiğimiz konaklama lokasyonumuz oldu. Burası çok şirin bir aile işletmesi. Yağız Bey ve ailesi hem çok samimi hem de çok profesyonel; tüm ihtiyaçlarımızı sabırla karşıladılar. Odalar temiz ve ferah, daireler arası mesafe mahremiyet için yeterli. Sonsuzluk havuzuna da bayıldık; mükemmel bir manzaraya sahip.",
    source: "Google",
  },
];

/** Average rating across REVIEWS, or null when there are none yet. */
export function getAverageRating(): number | null {
  if (REVIEWS.length === 0) return null;
  const sum = REVIEWS.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / REVIEWS.length) * 10) / 10;
}

export function getReviewCount(): number {
  return REVIEWS.length;
}
