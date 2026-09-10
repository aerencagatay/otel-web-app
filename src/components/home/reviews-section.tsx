"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { REVIEWS, getAverageRating, getRatedReviewCount, type Review } from "@/lib/config/reviews";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Assos+Karadut+Taş+Otel+Büyükhusun+Ayvacık";

/**
 * "Misafirlerimiz ne diyor" — home page, between Location and Gallery.
 * Renders nothing when there are no reviews yet (never show an empty/fake
 * social-proof section). Review texts come VERBATIM from reviews.ts (TR
 * canonical); the EN page shows the professional translations from
 * messages/en.json (`reviewsSection.items.*`), falling back to the verbatim
 * Turkish text when a translation is missing. Star rows and the average
 * line only appear for reviews with a CONFIRMED rating.
 *
 * Bulgu Y10: üç kart yerine tek, öne çıkan bir alıntı gösterilir (en yeni
 * Google yorumu — REVIEWS dizisindeki nispi tarihlere göre "7 ay önce" ile
 * en güncel olan). Bu, mobilde sayfa uzunluğunu kısaltırken tek bir güçlü
 * sosyal kanıt anına odaklanır. Metinler İÇERİK KİLİDİ altında — hiçbiri
 * kısaltılıp yeniden yazılmadı, yalnızca görüntülenen kart sayısı azaldı.
 */
export default function ReviewsSection() {
  const t = useTranslations("reviewsSection");
  const locale = useLocale();
  const intlLocale = locale === "en" ? "en-US" : "tr-TR";

  if (REVIEWS.length === 0) return null;

  const average = getAverageRating();
  const ratedCount = getRatedReviewCount();
  const featured = REVIEWS[0];

  return (
    <section className="section-py bg-warm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="type-section-title mx-auto mb-4">{t("title")}</h2>
          <div className="divider-gold-center" />
          {average != null ? (
            <p className="text-[14px] text-text-light m-0">
              {t.rich("averageLine", {
                strong: (chunks) => <strong className="text-dark">{chunks}</strong>,
                average: average.toLocaleString(intlLocale),
                count: ratedCount,
              })}
            </p>
          ) : (
            <p className="text-[14px] text-text-light m-0">{t("noRatingLine")}</p>
          )}
        </div>

        <FeaturedReview review={featured} index={0} />
      </div>
    </section>
  );
}

function FeaturedReview({ review, index }: { review: Review; index: number }) {
  const t = useTranslations("reviewsSection");
  const tAbout = useTranslations("about.reviews");
  const [expanded, setExpanded] = useState(false);

  // EN'de messages'taki çeviri; anahtar yoksa (yeni eklenen yorum henüz
  // çevrilmediyse) reviews.ts'teki orijinal metne düşer.
  const textKey = `items.${index + 1}.text`;
  const dateKey = `items.${index + 1}.date`;
  const text = t.has(textKey) ? t(textKey) : review.text;
  const date = t.has(dateKey) ? t(dateKey) : review.date;

  return (
    <figure className="max-w-2xl mx-auto text-center m-0">
      {typeof review.rating === "number" && (
        <div
          className="flex items-center justify-center gap-1 mb-5"
          aria-label={t("starsAria", { rating: review.rating })}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < (review.rating as number) ? "text-gold fill-gold" : "text-border"}
            />
          ))}
        </div>
      )}
      <blockquote
        className={`font-heading font-normal text-[19px] md:text-[23px] leading-[1.55] text-dark m-0 mb-5 ${
          expanded ? "" : "line-clamp-5 md:line-clamp-4"
        }`}
      >
        &ldquo;{text}&rdquo;
      </blockquote>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="text-[11.5px] font-semibold tracking-[0.12em] uppercase text-gold-dark bg-transparent border-0 p-0 cursor-pointer underline underline-offset-4 mb-6"
        aria-expanded={expanded}
      >
        {expanded ? t("showLess") : t("showMore")}
      </button>
      <figcaption className="text-[13px] text-text-light border-t border-border pt-5 flex flex-col items-center gap-1">
        <span className="font-semibold text-dark">{review.author}</span>
        <span>
          {review.source} · {date}
        </span>
      </figcaption>
      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-7 text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-dark no-underline border-b border-gold-dark/40 pb-1 hover:border-gold-dark transition-colors"
      >
        {tAbout("seeAll")}
      </a>
    </figure>
  );
}
