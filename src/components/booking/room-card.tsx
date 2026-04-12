import Image from "next/image";
import type { RoomResult } from "./booking-flow";
import { BedDouble, Users, Sparkles } from "lucide-react";
import { getRoomTypeImage } from "@/lib/config/room-images";

interface Props {
  room: RoomResult;
  onSelect: () => void;
}

export default function RoomCard({ room, onSelect }: Props) {
  const img = getRoomTypeImage(room.roomType);

  return (
    <article className="room-select-card group">
      <div className="room-select-card__media relative overflow-hidden">
        <Image
          src={img}
          alt={room.label}
          width={560}
          height={420}
          className="w-full h-full object-cover transition-transform duration-[650ms] ease-out group-hover:scale-[1.05]"
        />
      </div>
      <div className="room-select-card__body">
        <span className="room-select-card__tag room-select-card__tag--accent">
          {room.available} oda müsait
        </span>
        <h3 className="font-heading text-xl md:text-2xl font-semibold text-dark m-0 mb-3 leading-snug tracking-tight">
          {room.label}
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-text mb-4">
          <span className="inline-flex items-center gap-2">
            <BedDouble size={16} className="text-gold-dark shrink-0" strokeWidth={1.5} />
            Butik oda
          </span>
          <span className="inline-flex items-center gap-2">
            <Users size={16} className="text-gold-dark shrink-0" strokeWidth={1.5} />
            En fazla {room.maxGuests} misafir
          </span>
        </div>
        <p className="text-[12px] text-text-light m-0 flex items-start gap-2 leading-relaxed max-w-prose">
          <Sparkles size={15} className="text-gold shrink-0 mt-0.5" strokeWidth={1.5} />
          Rezervasyon talebiniz, kapora ödemesi onaylandıktan sonra kesinleşir.
        </p>
      </div>
      <div className="room-select-card__aside">
        <div className="text-[10px] uppercase tracking-[0.22em] text-text-light mb-2 font-semibold">
          Kapora
        </div>
        <div className="font-heading text-[1.65rem] md:text-[1.85rem] font-semibold text-dark mb-5 leading-none">
          {room.depositAmount.toLocaleString("tr-TR")} <span className="text-base font-body font-semibold">₺</span>
        </div>
        <button
          type="button"
          onClick={onSelect}
          className="btn-cta-solid w-full justify-center text-[9px] py-3.5 border-0"
        >
          Bu odayı seç
        </button>
      </div>
    </article>
  );
}
