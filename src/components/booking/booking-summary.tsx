import type { SearchParams, RoomResult } from "./booking-flow";
import { CalendarDays, Users, BedDouble, ShieldCheck } from "lucide-react";
import { calculateStayTotal } from "@/lib/config/pricing";

interface Props {
  search: SearchParams;
  room: RoomResult;
}

function nightCount(checkIn: string, checkOut: string) {
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  return Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BookingSummary({ search, room }: Props) {
  const nights = nightCount(search.checkIn, search.checkOut);
  const stay = calculateStayTotal(room.roomType, search.checkIn, search.checkOut);
  // Deposit (kapora) = one night's price for the check-in season.
  const deposit = stay.fromPrice ?? room.depositAmount;

  return (
    <aside className="premium-trip-card lg:sticky lg:top-[120px]">
      <h4 className="premium-trip-card__title m-0">Özet</h4>
      <p className="text-[12px] text-text-light -mt-2 mb-6 leading-relaxed">
        Gönderimden önce bilgilerinizi kontrol edin. Kapora aşağıda vurgulanmıştır.
      </p>

      <div className="space-y-0">
        <div className="premium-trip-card__row pb-5">
          <span className="premium-trip-card__dot" aria-hidden />
          <div className="flex items-start gap-3">
            <BedDouble size={17} className="text-gold-dark mt-0.5 shrink-0" strokeWidth={1.5} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-text-light mb-1 font-semibold">
                Oda
              </div>
              <div className="font-heading text-[17px] font-semibold text-dark leading-snug">
                {room.label}
              </div>
            </div>
          </div>
        </div>

        <div className="premium-trip-card__row pb-5">
          <span className="premium-trip-card__dot" aria-hidden />
          <div className="flex items-start gap-3">
            <CalendarDays size={17} className="text-gold-dark mt-0.5 shrink-0" strokeWidth={1.5} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-text-light mb-1 font-semibold">
                Konaklama
              </div>
              <div className="font-medium text-dark text-[14px] leading-snug">
                {formatDate(search.checkIn)}
                <span className="text-text-light mx-1.5">→</span>
                {formatDate(search.checkOut)}
              </div>
              <div className="text-[12px] text-gold-dark font-semibold mt-1">{nights} gece</div>
            </div>
          </div>
        </div>

        <div className="premium-trip-card__row pb-1">
          <span className="premium-trip-card__dot" aria-hidden />
          <div className="flex items-start gap-3">
            <Users size={17} className="text-gold-dark mt-0.5 shrink-0" strokeWidth={1.5} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-text-light mb-1 font-semibold">
                Misafir
              </div>
              <div className="font-medium text-dark text-[14px]">
                {search.adults} yetişkin
                {search.children > 0 && (
                  <span className="text-text-light"> · {search.children} çocuk</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Konaklama bedeli (toplam) */}
      <div className="mt-1 mb-4 pt-4 border-t border-border">
        {stay.total != null ? (
          <>
            <div className="flex justify-between items-center text-[13px] text-text mb-2">
              <span>
                {stay.uniform && stay.fromPrice != null
                  ? `${stay.fromPrice.toLocaleString("tr-TR")} ₺ × ${stay.nights} gece`
                  : `${stay.nights} gece konaklama`}
              </span>
              <span className="font-medium text-dark">
                {stay.total.toLocaleString("tr-TR")} ₺
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[11px] uppercase tracking-[0.18em] text-text-light font-semibold">
                Toplam (KDV dahil)
              </span>
              <span className="font-heading text-[1.45rem] font-semibold text-dark leading-none">
                {stay.total.toLocaleString("tr-TR")} ₺
              </span>
            </div>
          </>
        ) : (
          <div className="text-[13px] text-text-light leading-relaxed">
            Bu tarihler için toplam fiyat bilgisi almak üzere lütfen bizi arayın.
          </div>
        )}
      </div>

      <div className="premium-trip-card__deposit">
        <div className="premium-trip-card__deposit-label">Ödenecek kapora (1 gecelik ücret)</div>
        <div className="premium-trip-card__deposit-amount">
          {deposit.toLocaleString("tr-TR")} ₺
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-border">
        <div className="flex gap-3 items-start">
          <ShieldCheck size={18} className="text-gold-dark shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-[12px] text-text leading-relaxed m-0">
            <span className="font-semibold text-dark">Kesin rezervasyon:</span> IBAN kaporası
            onaylandıktan sonra oluşur. Talimatlar e-posta ile gider.
          </p>
        </div>
      </div>
    </aside>
  );
}
