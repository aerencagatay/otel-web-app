import { Star } from "lucide-react";
import { REVIEWS, getAverageRating } from "@/lib/config/reviews";

/**
 * "Misafirlerimiz ne diyor" — home page, between Location and Gallery.
 * Renders nothing when there are no reviews yet (never show an empty/fake
 * social-proof section). See src/lib/config/reviews.ts for the data source.
 */
export default function ReviewsSection() {
  if (REVIEWS.length === 0) return null;

  const average = getAverageRating();

  return (
    <section className="section-py bg-warm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
          <span className="eyebrow">Misafir Yorumları</span>
          <h2 className="m-0 mb-4">Misafirlerimiz Ne Diyor</h2>
          <div className="divider-gold-center" />
          {average != null && (
            <p className="text-[14px] text-text-light m-0">
              Google&apos;da{" "}
              <strong className="text-dark">{average.toLocaleString("tr-TR")}/5</strong>{" "}
              ortalama puan · {REVIEWS.length} yorum
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((review) => (
            <figure
              key={review.author}
              className="bg-white border border-border rounded-[var(--radius-md)] p-6 md:p-7 flex flex-col"
            >
              <div className="flex items-center gap-1 mb-4" aria-label={`${review.rating}/5 yıldız`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.rating ? "text-gold fill-gold" : "text-border"}
                  />
                ))}
              </div>
              <blockquote className="text-[13.5px] text-text leading-[1.8] m-0 mb-5 flex-1 line-clamp-6">
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <figcaption className="text-[12.5px] text-text-light border-t border-border pt-4 mt-auto">
                <span className="font-semibold text-dark">{review.author}</span>
                {" · "}
                {review.source} · {review.date}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
