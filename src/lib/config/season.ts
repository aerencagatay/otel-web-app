import { getDateRange } from "../utils/dates";

/**
 * Otelin açık olduğu sezon — rezervasyon yalnızca bu aralıktaki geceler
 * için alınır (kullanıcı kararı 2026-09-29): 1 Mayıs – 30 Eylül açık,
 * 1 Ekim – 30 Nisan kapalı. Tarih değişirse yalnızca burayı güncelleyin;
 * takvim, müsaitlik ve rezervasyon API'leri buradan okur.
 *
 * Kural GECE bazındadır: [checkIn, checkOut) aralığındaki her gece açık
 * ayda olmalı. Böylece 30 Eylül gecesi kalıp 1 Ekim'de çıkış yapılabilir.
 */
export const SEASON = {
  /** İlk açık ay (1–12). */
  openMonth: 5,
  /** Son açık ay (1–12), dahil. */
  closeMonth: 9,
} as const;

function isOpenMonth(month: number): boolean {
  return month >= SEASON.openMonth && month <= SEASON.closeMonth;
}

/** "YYYY-MM-DD" gecesi için otel açık mı? */
export function isBookableNight(date: string): boolean {
  return isOpenMonth(Number(date.substring(5, 7)));
}

/** Konaklamanın tüm geceleri sezon içinde mi? */
export function isStayInSeason(checkIn: string, checkOut: string): boolean {
  const nights = getDateRange(checkIn, checkOut);
  return nights.length > 0 && nights.every(isBookableNight);
}

/**
 * Takvimde (react-day-picker `disabled` matcher'ı) kapalı gösterilecek gün.
 * Sezon sonrasının ilk günü (1 Ekim) çıkış günü olarak seçilebilsin diye
 * açık bırakılır; giriş olarak seçilmesini tarih seçici engeller.
 */
export function isClosedPickerDay(date: Date): boolean {
  const month = date.getMonth() + 1;
  if (isOpenMonth(month)) return false;
  return !(month === SEASON.closeMonth + 1 && date.getDate() === 1);
}

/** `from` sezon içindeyse kendisi, değilse bir sonraki sezonun ilk günü. */
export function firstBookableDate(from: Date): Date {
  const month = from.getMonth() + 1;
  if (isOpenMonth(month)) return from;
  const year = month > SEASON.closeMonth ? from.getFullYear() + 1 : from.getFullYear();
  return new Date(year, SEASON.openMonth - 1, 1);
}
