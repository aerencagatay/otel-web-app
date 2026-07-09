import { setRequestLocale } from "next-intl/server";
import HeroHome from "@/components/home/hero-home";
import StatsBar from "@/components/home/stats-bar";
import AboutSnippet from "@/components/home/about-snippet";
import FeaturedRooms from "@/components/home/featured-rooms";
import AmenitiesGrid from "@/components/home/amenities-grid";
import CtaBanner from "@/components/home/cta-banner";
import LocationSection from "@/components/home/location-section";
import ReviewsSection from "@/components/home/reviews-section";
import GalleryStrip from "@/components/home/gallery-strip";
import AmbientSound from "@/components/home/ambient-sound";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AmbientSound />
      <HeroHome />
      <StatsBar />
      <AboutSnippet />
      <FeaturedRooms />
      <AmenitiesGrid />
      <CtaBanner />
      <LocationSection />
      <ReviewsSection />
      <GalleryStrip />
    </>
  );
}
