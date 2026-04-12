import HeroHome from "@/components/home/hero-home";
import StatsBar from "@/components/home/stats-bar";
import AboutSnippet from "@/components/home/about-snippet";
import FeaturedRooms from "@/components/home/featured-rooms";
import AmenitiesGrid from "@/components/home/amenities-grid";
import CtaBanner from "@/components/home/cta-banner";
import LocationSection from "@/components/home/location-section";
import GalleryStrip from "@/components/home/gallery-strip";

export default function HomePage() {
  return (
    <>
      <HeroHome />
      <StatsBar />
      <AboutSnippet />
      <FeaturedRooms />
      <AmenitiesGrid />
      <CtaBanner />
      <LocationSection />
      <GalleryStrip />
    </>
  );
}
