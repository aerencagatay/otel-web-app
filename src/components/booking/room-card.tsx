"use client";

import Image from "next/image";
import type { RoomResult } from "./booking-flow";
import { useLocale, useTranslations } from "next-intl";
import { BedDouble, Users, Sparkles } from "lucide-react";
import { getRoomTypeImage } from "@/lib/config/room-images";
import { calculateStayTotal } from "@/lib/config/pricing";
import { approxEur } from "@/lib/config/hotel";

interface Props {
  room: RoomResult;
  checkIn: string;
  checkOut: string;
  onSelect: () => void;
}

export default function RoomCard({ room, checkIn, checkOut, onSelect }: Props) {
  const t = useTranslations("booking.roomCard");
  const tr = useTranslations("roomTypes");
  const locale = useLocale();
  const intlLocale = locale === "en" ? "en-US" : "tr-TR";
  const num = (n: number) => n.toLocaleString(intlLocale);

  const img = getRoomTypeImage(room.roomType);
  const stay = calculateStayTotal(room.roomType, checkIn, checkOut);
  const roomLabel = tr.has(room.roomType) ? tr(room.roomType) : room.label;
  const depositAmount = stay.fromPrice ?? room.depositAmount;

  return (
    <article className="room-select-card group">
      <div className="room-select-card__media relative overflow-hidden">
        <Image
          src={img}
          alt={roomLabel}
          width={560}
          height={420}
          className="w-full h-full object-cover transition-transform duration-[650ms] ease-out group-hover:scale-[1.05]"
        />
      </div>
      <div className="room-select-card__body">
        <span className="room-select-card__tag room-select-card__tag--accent">
          {t("roomsAvailable", { count: room.available })}
        </span>
        <h3 className="font-heading text-xl md:text-2xl font-semibold text-dark m-0 mb-3 leading-snug tracking-tight">
          {roomLabel}
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-text mb-4">
          <span className="inline-flex items-center gap-2">
            <BedDouble size={16} className="text-gold-dark shrink-0" strokeWidth={1.5} />
            {t("boutiqueRoom")}
          </span>
          <span className="inline-flex items-center gap-2">
            <Users size={16} className="text-gold-dark shrink-0" strokeWidth={1.5} />
            {t("maxGuests", { count: room.maxGuests })}
          </span>
        </div>
        <p className="text-[12px] text-text-light m-0 flex items-start gap-2 leading-relaxed max-w-prose">
          <Sparkles size={15} className="text-gold shrink-0 mt-0.5" strokeWidth={1.5} />
          {t("note")}
        </p>
      </div>
      <div className="room-select-card__aside">
        {stay.total != null ? (
          <>
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-light mb-1 font-semibold">
              {t("totalNights", { nights: stay.nights })}
            </div>
            <div className="font-heading text-[1.65rem] md:text-[1.85rem] font-semibold text-dark mb-1 leading-none">
              {num(stay.total)} <span className="text-base font-body font-semibold">₺</span>
            </div>
            <div className="text-[11px] text-text-light mb-1">
              {stay.uniform && stay.fromPrice != null
                ? t("perNight", { price: num(stay.fromPrice) })
                : t("vatIncluded")}
            </div>
            {locale === "en" && (
              <div className="text-[11px] text-text-light mb-3">
                {t("approxEur", { amount: num(approxEur(stay.total)) })}
              </div>
            )}
            <div className="text-[11px] text-text-light mb-4">
              {t("depositOneNight")}{" "}
              <span className="font-semibold text-dark">{num(depositAmount)} ₺</span>
            </div>
          </>
        ) : (
          <>
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-light mb-2 font-semibold">
              {t("deposit")}
            </div>
            <div className="font-heading text-[1.65rem] md:text-[1.85rem] font-semibold text-dark mb-5 leading-none">
              {num(room.depositAmount)} <span className="text-base font-body font-semibold">₺</span>
            </div>
          </>
        )}
        <button
          type="button"
          onClick={onSelect}
          className="btn-cta-solid w-full justify-center text-[10px] py-3.5 border-0"
        >
          {t("select")}
        </button>
      </div>
    </article>
  );
}
