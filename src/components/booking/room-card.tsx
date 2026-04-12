import type { RoomResult } from "./booking-flow";
import { BedDouble, Users, CheckCircle } from "lucide-react";

interface Props {
  room: RoomResult;
  onSelect: () => void;
}

export default function RoomCard({ room, onSelect }: Props) {
  return (
    <div className="bg-white border border-border p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-gold hover:shadow-lg transition-all">
      <div className="flex-1">
        <h4 className="text-[18px] mb-1">{room.label}</h4>
        <div className="flex gap-4 text-[13px] text-text-light mb-2">
          <span className="flex items-center gap-1">
            <BedDouble size={14} className="text-gold" />
            {room.available} oda müsait
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} className="text-gold" />
            Maks. {room.maxGuests} kişi
          </span>
        </div>
        <div className="text-gold font-bold text-[16px]">
          Kapora: {room.depositAmount.toLocaleString("tr-TR")} ₺
        </div>
      </div>
      <button onClick={onSelect} className="btn-gold shrink-0">
        <CheckCircle className="inline w-4 h-4 mr-2" />
        Bu Odayı Seç
      </button>
    </div>
  );
}
