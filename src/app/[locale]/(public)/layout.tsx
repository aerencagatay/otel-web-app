import { Suspense } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import BackToTop from "@/components/layout/back-to-top";
import StickyBookingCta from "@/components/layout/sticky-booking-cta";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import PlausibleAnalytics from "@/components/analytics/plausible";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pb-[72px] lg:pb-0">{children}</main>
      <Footer />
      <BackToTop />
      <StickyBookingCta />
      {/* useSearchParams gerektirir — Suspense sınırı olmadan build hata verir. */}
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
      <PlausibleAnalytics />
    </>
  );
}
