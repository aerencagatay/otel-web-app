/**
 * Central room photo catalogue — Task 03 (trust content).
 *
 * All room imagery across the site (home page cards, /rooms gallery, JSON-LD
 * imagery, etc.) MUST be sourced from here — never hard-code a photo path or
 * hotlink an external CDN URL elsewhere.
 *
 * Files live in `public/img/rooms/<slug>/<slug>-N.webp`, generated from the
 * repo-root `img/<Kaynak Klasör>/` originals by
 * `scripts/optimize-images.mjs` (1920px max width, WebP q80). See AGENTS.md
 * for the source-folder -> room-type mapping — those folder names are only
 * the photo SOURCE and never change the public room names below.
 */

export interface RoomImage {
  src: string;
  alt: string;
}

export interface RoomImageSet {
  /** Primary card/hero image for this room type. */
  cover: RoomImage;
  /** Full mini-gallery (includes the cover as its first entry). */
  gallery: RoomImage[];
}

export const ROOM_IMAGES: Record<string, RoomImageSet> = {
  deluxe_sea_view: {
    cover: { src: "/img/rooms/deluxe/deluxe-1.webp", alt: "Deluxe Tam Deniz Manzaralı oda" },
    gallery: [
      { src: "/img/rooms/deluxe/deluxe-1.webp", alt: "Deluxe Tam Deniz Manzaralı oda - genel görünüm" },
      { src: "/img/rooms/deluxe/deluxe-2.webp", alt: "Deluxe Tam Deniz Manzaralı oda - yatak alanı" },
      { src: "/img/rooms/deluxe/deluxe-3.webp", alt: "Deluxe Tam Deniz Manzaralı oda - balkon ve deniz manzarası" },
      { src: "/img/rooms/deluxe/deluxe-4.webp", alt: "Deluxe Tam Deniz Manzaralı oda - banyo" },
      { src: "/img/rooms/deluxe/deluxe-5.webp", alt: "Deluxe Tam Deniz Manzaralı oda - detay" },
      { src: "/img/rooms/deluxe/deluxe-6.webp", alt: "Deluxe Tam Deniz Manzaralı oda - manzara" },
      { src: "/img/rooms/deluxe/deluxe-7.webp", alt: "Deluxe Tam Deniz Manzaralı oda - iç mekân detayı" },
      { src: "/img/rooms/deluxe/deluxe-8.webp", alt: "Deluxe Tam Deniz Manzaralı oda - farklı açıdan görünüm" },
      { src: "/img/rooms/deluxe/deluxe-9.webp", alt: "Deluxe Tam Deniz Manzaralı oda - dekorasyon detayı" },
      { src: "/img/rooms/deluxe/deluxe-10.webp", alt: "Deluxe Tam Deniz Manzaralı oda - balkondan manzara" },
      { src: "/img/rooms/deluxe/deluxe-11.webp", alt: "Deluxe Tam Deniz Manzaralı oda - genel iç görünüm" },
    ],
  },
  traditional_room: {
    cover: { src: "/img/rooms/traditional/traditional-1.webp", alt: "Traditional Kısmi Deniz Manzaralı oda" },
    gallery: [
      { src: "/img/rooms/traditional/traditional-1.webp", alt: "Traditional Kısmi Deniz Manzaralı oda - genel görünüm" },
      { src: "/img/rooms/traditional/traditional-2.webp", alt: "Traditional Kısmi Deniz Manzaralı oda - yatak alanı" },
      { src: "/img/rooms/traditional/traditional-3.webp", alt: "Traditional Kısmi Deniz Manzaralı oda - balkon" },
      { src: "/img/rooms/traditional/traditional-4.webp", alt: "Traditional Kısmi Deniz Manzaralı oda - banyo" },
      { src: "/img/rooms/traditional/traditional-5.webp", alt: "Traditional Kısmi Deniz Manzaralı oda - detay" },
      { src: "/img/rooms/traditional/traditional-6.webp", alt: "Traditional Kısmi Deniz Manzaralı oda - manzara" },
      { src: "/img/rooms/traditional/traditional-7.webp", alt: "Traditional Kısmi Deniz Manzaralı oda - iç mekân detayı" },
      { src: "/img/rooms/traditional/traditional-8.webp", alt: "Traditional Kısmi Deniz Manzaralı oda - farklı açıdan görünüm" },
    ],
  },
  premium_family: {
    cover: { src: "/img/rooms/aile-suit/aile-suit-1.webp", alt: "Aile Suit Deniz Manzaralı oda" },
    gallery: [
      { src: "/img/rooms/aile-suit/aile-suit-1.webp", alt: "Aile Suit Deniz Manzaralı oda - genel görünüm" },
      { src: "/img/rooms/aile-suit/aile-suit-2.webp", alt: "Aile Suit Deniz Manzaralı oda - oturma alanı" },
      { src: "/img/rooms/aile-suit/aile-suit-3.webp", alt: "Aile Suit Deniz Manzaralı oda - yatak alanı" },
      { src: "/img/rooms/aile-suit/aile-suit-4.webp", alt: "Aile Suit Deniz Manzaralı oda - balkon ve deniz manzarası" },
      { src: "/img/rooms/aile-suit/aile-suit-5.webp", alt: "Aile Suit Deniz Manzaralı oda - açık hava yemek masası" },
      { src: "/img/rooms/aile-suit/aile-suit-6.webp", alt: "Aile Suit Deniz Manzaralı oda - banyo" },
      { src: "/img/rooms/aile-suit/aile-suit-7.webp", alt: "Aile Suit Deniz Manzaralı oda - iç mekân detayı" },
      { src: "/img/rooms/aile-suit/aile-suit-8.webp", alt: "Aile Suit Deniz Manzaralı oda - farklı açıdan görünüm" },
      { src: "/img/rooms/aile-suit/aile-suit-9.webp", alt: "Aile Suit Deniz Manzaralı oda - genel iç görünüm" },
    ],
  },
};

const FALLBACK: RoomImageSet = ROOM_IMAGES.deluxe_sea_view;

export function getRoomImages(roomType: string): RoomImageSet {
  return ROOM_IMAGES[roomType] ?? FALLBACK;
}

/** Convenience accessor for card contexts that only need the cover photo. */
export function getRoomCoverImage(roomType: string): RoomImage {
  return getRoomImages(roomType).cover;
}

/** Second gallery image, used for the hover cross-fade on room cards. */
export function getRoomHoverImage(roomType: string): RoomImage {
  const { gallery, cover } = getRoomImages(roomType);
  return gallery[1] ?? cover;
}
