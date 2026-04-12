import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import BackToTop from "@/components/layout/back-to-top";
import StickyBookingCta from "@/components/layout/sticky-booking-cta";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Topbar />
      <Navbar />
      <main className="pb-[72px] lg:pb-0">{children}</main>
      <Footer />
      <BackToTop />
      <StickyBookingCta />
    </>
  );
}
