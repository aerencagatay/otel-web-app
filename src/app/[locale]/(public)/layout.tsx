import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import BackToTop from "@/components/layout/back-to-top";
import StickyBookingCta from "@/components/layout/sticky-booking-cta";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import PlausibleAnalytics from "@/components/analytics/plausible";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("a11y");

  return (
    <>
      {/* Bulgu Y7: Tab'ın ilk durağı. Öncesinde klavye kullanıcısı içeriğe
          ulaşmak için tüm navigasyonu geçmek zorundaydı. Stili globals.css
          içindeki .skip-link'te; yalnızca focus alınca görünür. */}
      <a href="#main" className="skip-link">
        {t("skipToContent")}
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="pb-[72px] lg:pb-0">
        {children}
      </main>
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
