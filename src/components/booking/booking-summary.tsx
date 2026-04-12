import type { SearchParams, RoomResult } from "./booking-flow";
import { CalendarDays, Users, BedDouble, CreditCard } from "lucide-react";

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

  return (
    <div className="bg-white border border-border p-6 sticky top-[120px]">
      <h4 className="text-[16px] mb-4 pb-3 border-b border-border">
        Rezervasyon Özeti
      </h4>

      <div className="space-y-3 text-[14px]">
        <div className="flex items-start gap-3">
          <BedDouble size={16} className="text-gold mt-0.5 shrink-0" />
          <div>
            <div className="text-text-light text-[12px] uppercase tracking-wide">
              Oda Tipi
            </div>
            <div className="font-semibold text-dark">{room.label}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CalendarDays size={16} className="text-gold mt-0.5 shrink-0" />
          <div>
            <div className="text-text-light text-[12px] uppercase tracking-wide">
              Tarihler
            </div>
            <div className="font-semibold text-dark">
              {formatDate(search.checkIn)} → {formatDate(search.checkOut)}
            </div>
            <div className="text-text-light text-[12px]">{nights} gece</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users size={16} className="text-gold mt-0.5 shrink-0" />
          <div>
            <div className="text-text-light text-[12px] uppercase tracking-wide">
              Misafirler
            </div>
            <div className="font-semibold text-dark">
              {search.adults} Yetişkin
              {search.children > 0 && `, ${search.children} Çocuk`}
            </div>
          </div>
        </div>

        <hr className="border-border" />

        <div className="flex items-start gap-3">
          <CreditCard size={16} className="text-gold mt-0.5 shrink-0" />
          <div>
            <div className="text-text-light text-[12px] uppercase tracking-wide">
              Kapora Tutarı
            </div>
            <div className="font-bold text-gold text-[20px]">
              {room.depositAmount.toLocaleString("tr-TR")} ₺
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gold/10 border border-gold/25 p-3 text-[12px] text-text">
        Kapora ödemesi IBAN havalesi ile yapılmaktadır. Detaylar rezervasyon
        sonrasında e-posta ile iletilecektir.
      </div>
    </div>
  );
}
