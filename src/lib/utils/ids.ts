/**
 * Generate a reservation ID in format WEB-YYYYMMDD-XXXX
 */
export function generateReservationId(): string {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `WEB-${date}-${rand}`;
}
