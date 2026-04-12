export interface RoomTypeConfig {
  publicLabel: string;
  sheetLabels: string[];
  maxGuests: number;
  depositAmount: number;
}

export const ROOM_TYPE_MAP: Record<string, RoomTypeConfig> = {
  deluxe_sea_view: {
    publicLabel: "Deluxe Deniz Manzaralı",
    sheetLabels: ["1+0 Panaromic"],
    maxGuests: 2,
    depositAmount: 5000,
  },
  traditional_room: {
    publicLabel: "Traditional Oda",
    sheetLabels: ["1+0 Traditional"],
    maxGuests: 2,
    depositAmount: 5000,
  },
  premium_family: {
    publicLabel: "1+1 Premium",
    sheetLabels: ["1+1 Premium", "1+1 5 kisi"],
    maxGuests: 4,
    depositAmount: 7000,
  },
};

export function getRoomTypeBySheetLabel(label: string): string | null {
  for (const [key, config] of Object.entries(ROOM_TYPE_MAP)) {
    if (config.sheetLabels.some((sl) => label.includes(sl))) {
      return key;
    }
  }
  return null;
}

export function getAllSheetLabels(): string[] {
  return Object.values(ROOM_TYPE_MAP).flatMap((c) => c.sheetLabels);
}
