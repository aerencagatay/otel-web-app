/** Room type keys → hero imagery for booking cards */
export const ROOM_TYPE_IMAGES: Record<string, string> = {
  deluxe_sea_view:
    "https://cdng.jollytur.com/files/cms/media/hotel/room/5f6475c4-9c9a-4640-a5dc-115fa6ffb7be-600.jpeg",
  traditional_room:
    "https://cdng.jollytur.com/files/cms/media/hotel/room/2e20db12-6c15-49eb-8b30-5cbd53389e78-600.jpeg",
  premium_family:
    "https://cdng.jollytur.com/files/cms/media/hotel/room/e21e4d3b-f71b-43ce-9dfd-a6b7bb92f9cc-600.jpeg",
};

export function getRoomTypeImage(roomType: string): string {
  return (
    ROOM_TYPE_IMAGES[roomType] ??
    "https://cdng.jollytur.com/files/cms/media/hotel/fa46d2cc-7aa8-45b3-95bf-d179020cf7a8-600.jpeg"
  );
}
