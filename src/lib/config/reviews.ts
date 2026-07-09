/**
 * Guest reviews — single source of truth for:
 *   - `ReviewsSection` (home page, between Location and Gallery)
 *   - the hero/stats "misafir puanı" badge (`stats-bar.tsx`)
 *   - the `AggregateRating` block in `hotelJsonLd()` (json-ld.tsx)
 *
 * These three entries are REAL guest reviews (author name, review text and
 * relative date as posted on Google) already gathered for the site — the
 * texts are kept VERBATIM and must never be shortened or paraphrased in
 * this data layer (truncate visually in the UI if needed).
 *
 * `rating` is OPTIONAL and currently unset for all three reviews: the
 * source scrape did not expose per-review star values, and an inferred
 * number must never feed AggregateRating (Google penalizes unsupported
 * ratings). While no review carries a rating, the aggregate badge and the
 * AggregateRating JSON-LD are suppressed automatically.
 *
 * DO NOT add fabricated reviews or ratings here. When the hotel owner
 * provides more real reviews (or confirms the star values below), append/
 * fill them following the same shape. If this array is ever emptied,
 * `ReviewsSection` must not render — never show social proof with zero
 * backing reviews.
 */
export interface Review {
  author: string;
  /**
   * 1-5 yıldız. PLACEHOLDER — otel sahibi gerçek puanları onaylayınca
   * doldurun; onaysız/çıkarımsal değer YAZMAYIN.
   */
  rating?: number;
  /** Relative date as shown by the source platform, e.g. "7 ay önce". */
  date: string;
  text: string;
  source: "Google";
}

export const REVIEWS: Review[] = [
  {
    author: "Kmrozlm7777",
    date: "7 ay önce",
    text: "Buraya kesinlikle bayıldık 2 gece konakladık bugün çıkacağız ama resmen buradan ayrılacağım için üzülüyorum. Böyle güzel manzara bu kadar huzurlu bir yer bulup 2 günümüzü geçirmek inanılmaz güzel bir tecrübeydi. Biz 1+1'lerde konakladık; odalardaki ince dekoratif ayrıntılar, Midilli'ye karşı muhteşem manzara kesinlikle çok güzeldi. Odada şömine bile vardı ama odamızın o kadar güzel manzarası vardı ki biz hep balkonda vakit geçirmek istedik. Otelin sahipleri en ince ayrıntıya kadar düşünmüşler; resmen bir otel değil de kendi evlerini tasarlar gibi yapmışlar. Kahvaltısı da gayet yeterli ve güzeldi. Otelin maskotları Ares'le Tarçın çok cana yakın ve eğitimli köpekler, onlarla da çok güzel vakit geçirdik. Eşsiz güzel manzara, muhteşem huzur — kesinlikle tavsiye ediyoruz.",
    source: "Google",
  },
  {
    author: "Bahar",
    date: "10 ay önce",
    text: "Ailecek, 1+1 odalarında 2 gece konakladığımız Karadut Taş Otel beklentilerimizin üzerinde bir deneyim sundu. İlgili, güler yüzlü çalışanlar, temiz ve konforlu odalar, muhteşem bir manzara ve sessizlik, dinlenmek için müthiş bir konum gerçek anlamda 5 yıldızı hak ediyor. Otel sahilden 7-8 dakika uzakta olsa da, kendilerine ait pansiyonun Kadırga Koyu'ndaki plajından ücretsiz yararlandırmaları da müthiş. Sonuç olarak; ben böyle bir işletmemiz olduğu için gurur duydum; bundan sonra mümkünse her yıl birkaç günü bu otelde geçirip kendimi yenilemek isterim. Emeği geçen herkese teşekkürlerimle.",
    source: "Google",
  },
  {
    author: "İrem İnci",
    date: "8 ay önce",
    text: "Karadut Otel, Assos tatilimizde tercih ettiğimiz konaklama lokasyonumuz oldu. Burası çok şirin bir aile işletmesi. Yağız Bey ve ailesi hem çok samimi hem de çok profesyonel; tüm ihtiyaçlarımızı sabırla karşıladılar. Odalar temiz ve ferah, daireler arası mesafe mahremiyet için yeterli. Sonsuzluk havuzuna da bayıldık; mükemmel bir manzaraya sahip. Çocuk havuzu da mevcut, havuz tertemiz ve bakımlıydı. Telefonla rezervasyon yaptırdığımızda internetten çok daha uygun bir fiyat aldık — iletişim numarasından ulaşmanızı öneririm.",
    source: "Google",
  },
];

/** Reviews that carry a confirmed star rating (never inferred). */
function ratedReviews(): Review[] {
  return REVIEWS.filter((r) => typeof r.rating === "number");
}

/**
 * Average rating across reviews WITH a confirmed rating, or null when no
 * review carries one. Null suppresses the stats badge and the
 * AggregateRating JSON-LD — never emit a rating without backing data.
 */
export function getAverageRating(): number | null {
  const rated = ratedReviews();
  if (rated.length === 0) return null;
  const sum = rated.reduce((acc, r) => acc + (r.rating as number), 0);
  return Math.round((sum / rated.length) * 10) / 10;
}

/** Number of reviews backing the aggregate rating (rated reviews only). */
export function getRatedReviewCount(): number {
  return ratedReviews().length;
}

export function getReviewCount(): number {
  return REVIEWS.length;
}
