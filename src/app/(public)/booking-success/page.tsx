import type { Metadata } from "next";
import { Suspense } from "react";
import BookingSuccessView from "@/components/booking/booking-success-view";

export const metadata: Metadata = {
  title: "Rezervasyon Başarılı",
  description: "Rezervasyon talebiniz alındı. Kapora talimatları e-posta ile iletilir.",
};

function SuccessFallback() {
  return (
    <div style={{ paddingTop: "38px" }} className="section-py min-h-[50vh] flex items-center justify-center bg-[var(--color-ivory)]">
      <p className="text-text-light text-[15px]">Yükleniyor…</p>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <BookingSuccessView />
    </Suspense>
  );
}
