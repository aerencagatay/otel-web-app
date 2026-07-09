"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { REVIEWS, getAverageRating, getRatedReviewCount, type Review } from "@/lib/config/reviews";

/**
 * "Misafirlerimiz ne diyor" — home page, between Location and Gallery.
 * Renders nothing when there are no reviews yet (never show an empty/fake
 * social-proof section). Review texts come VERBATIM from reviews.ts (TR
 * canonical); the EN page shows the professional translations from
 * messages/en.json (`reviewsSection.items.*`), falling back to the verbatim
 * Turkish text when a translation is missing. Star rows and the average
 * line only appear for reviews with a CONFIRMED rating.
 */
export default function ReviewsSection() {
  const t = useTranslations("reviewsSection");
  const locale = useLocale();
  const intlLocale = locale === "en" ? "en-US" : "tr-TR";

  if (REVIEWS.length === 0) return null;

  const average = getAverageRating();
  const ratedCount = getRatedReviewCount();

  return (
    <section className="section-py bg-warm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2 className="m-0 mb-4">{t("title")}</h2>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((review, i) => (
            <ReviewCard key={review.author} review={review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const t = useTranslations("reviewsSection");
  const [expanded, setExpanded] = useState(false);

  // EN'de messages'taki çeviri; anahtar yoksa (yeni eklenen yorum henüz
  // çevrilmediyse) reviews.ts'teki orijinal metne düşer.
  const textKey = `items.${index + 1}.text`;
  const dateKey = `items.${index + 1}.date`;
  const text = t.has(textKey) ? t(textKey) : review.text;
  const date = t.has(dateKey) ? t(dateKey) : review.date;

  return (
    <figure className="bg-white border border-border rounded-[var(--radius-md)] p-6 md:p-7 flex flex-col m-0">
      {typeof review.rating === "number" && (
        <div
          className="flex items-center gap-1 mb-4"
          aria-label={t("starsAria", { rating: review.rating })}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < (review.rating as number) ? "text-gold fill-gold" : "text-border"}
            />
          ))}
        </div>
      )}
      <blockquote
        className={`text-[13.5px] text-text leading-[1.8] m-0 mb-3 flex-1 ${
          expanded ? "" : "line-clamp-6"
        }`}
      >
        &ldquo;{text}&rdquo;
      </blockquote>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="self-start text-[11.5px] font-semibold tracking-[0.12em] uppercase text-gold-dark bg-transparent border-0 p-0 cursor-pointer underline underline-offset-4 mb-4"
        aria-expanded={expanded}
      >
        {expanded ? t("showLess") : t("showMore")}
      </button>
      <figcaption className="text-[12.5px] text-text-light border-t border-border pt-4 mt-auto">
        <span className="font-semibold text-dark">{review.author}</span>
        {" · "}
        {review.source} · {date}
      </figcaption>
    </figure>
  );
}
