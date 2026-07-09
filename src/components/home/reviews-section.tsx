"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { REVIEWS, getAverageRating, getRatedReviewCount, type Review } from "@/lib/config/reviews";

/**
 * "Misafirlerimiz ne diyor" — home page, between Location and Gallery.
 * Renders nothing when there are no reviews yet (never show an empty/fake
 * social-proof section). Review texts come VERBATIM from reviews.ts — long
 * ones are visually clamped with a "devamını gör" toggle, never shortened
 * in the data. Star rows and the average line only appear for reviews with
 * a CONFIRMED rating; while none have one, only the quotes are shown.
 */
export default function ReviewsSection() {
  if (REVIEWS.length === 0) return null;

  const average = getAverageRating();
  const ratedCount = getRatedReviewCount();

  return (
    <section className="section-py bg-warm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
          <span className="eyebrow">Misafir Yorumları</span>
          <h2 className="m-0 mb-4">Misafirlerimiz Ne Diyor</h2>
          <div className="divider-gold-center" />
          {average != null ? (
            <p className="text-[14px] text-text-light m-0">
              Google&apos;da{" "}
              <strong className="text-dark">{average.toLocaleString("tr-TR")}/5</strong>{" "}
              ortalama puan · {ratedCount} yorum
            </p>
          ) : (
            <p className="text-[14px] text-text-light m-0">
              Google&apos;da misafirlerimizin paylaştığı deneyimlerden seçtiklerimiz
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.author} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <figure className="bg-white border border-border rounded-[var(--radius-md)] p-6 md:p-7 flex flex-col m-0">
      {typeof review.rating === "number" && (
        <div className="flex items-center gap-1 mb-4" aria-label={`${review.rating}/5 yıldız`}>
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
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="self-start text-[11.5px] font-semibold tracking-[0.12em] uppercase text-gold-dark bg-transparent border-0 p-0 cursor-pointer underline underline-offset-4 mb-4"
        aria-expanded={expanded}
      >
        {expanded ? "Daha az göster" : "Devamını gör"}
      </button>
      <figcaption className="text-[12.5px] text-text-light border-t border-border pt-4 mt-auto">
        <span className="font-semibold text-dark">{review.author}</span>
        {" · "}
        {review.source} · {review.date}
      </figcaption>
    </figure>
  );
}
