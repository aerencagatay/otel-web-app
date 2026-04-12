/**
 * Calculate number of nights between two dates.
 * checkIn inclusive, checkOut exclusive.
 */
export function nightCount(checkIn: string, checkOut: string): number {
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  return Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Get all dates in range [checkIn, checkOut).
 * Returns YYYY-MM-DD strings.
 */
export function getDateRange(checkIn: string, checkOut: string): string[] {
  const dates: string[] = [];
  const current = new Date(checkIn);
  const end = new Date(checkOut);

  while (current < end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/**
 * Split a date range by month boundaries.
 * Returns array of { month: "YYYY-MM", dates: string[] }.
 */
export function splitByMonth(
  checkIn: string,
  checkOut: string
): { month: string; dates: string[] }[] {
  const allDates = getDateRange(checkIn, checkOut);
  const monthMap = new Map<string, string[]>();

  for (const date of allDates) {
    const month = date.substring(0, 7); // "YYYY-MM"
    if (!monthMap.has(month)) monthMap.set(month, []);
    monthMap.get(month)!.push(date);
  }

  return Array.from(monthMap.entries()).map(([month, dates]) => ({
    month,
    dates,
  }));
}

/**
 * Check if a date string is in the past.
 */
export function isPastDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}

/**
 * Format date for display.
 */
export function formatDateTR(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
