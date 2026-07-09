export interface RoomTypeConfig {
  publicLabel: string;
  sheetLabels: string[];
  maxGuests: number;
  depositAmount: number;
  /**
   * URL slug for the room detail page (`/rooms/[slug]`), same across TR/EN —
   * only the `/en` locale prefix changes. Kept stable once published (SEO).
   */
  slug: string;
}

export const ROOM_TYPE_MAP: Record<string, RoomTypeConfig> = {
  deluxe_sea_view: {
    publicLabel: "Deluxe Tam Deniz Manzaralı",
    sheetLabels: ["1+0 Deluxe"],
    maxGuests: 2,
    depositAmount: 5000,
    slug: "deluxe-tam-deniz-manzarali",
  },
  traditional_room: {
    publicLabel: "Traditional Kısmi Deniz Manzaralı",
    sheetLabels: ["1+0 Traditional"],
    maxGuests: 2,
    depositAmount: 5000,
    slug: "traditional-kismi-deniz-manzarali",
  },
  premium_family: {
    publicLabel: "Aile Suit Deniz Manzaralı",
    sheetLabels: ["1+1 Aile Suit"],
    maxGuests: 4,
    depositAmount: 7000,
    slug: "aile-suit-deniz-manzarali",
  },
};

/** Reverse lookup: slug -> room type key, or null if unknown. */
export function getRoomTypeBySlug(slug: string): string | null {
  for (const [key, config] of Object.entries(ROOM_TYPE_MAP)) {
    if (config.slug === slug) return key;
  }
  return null;
}

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
