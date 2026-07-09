/**
 * Minimal in-memory TTL cache for parsed monthly availability sheets.
 *
 * Google Sheets reads (`parseMonthSheet`) are the most expensive part of an
 * availability lookup and the same month tab is requested repeatedly within
 * short windows (a guest browsing dates, the date-range-picker prefetching
 * adjacent months, `findNearestAvailability` scanning ±1..±7 days). A simple
 * per-serverless-instance Map with a short TTL removes most of that
 * duplication without needing a shared cache like Redis — availability data
 * is only ever slightly stale (max 60s), which is acceptable for a "is this
 * room free" check.
 *
 * IMPORTANT: only used for read-only availability lookups. The reservation
 * write path (`sheets/reservations.ts`) always calls the raw
 * `parseMonthSheet` directly (never this cache) — see the note on that
 * function for why stale data there would be unsafe.
 */

import { parseMonthSheet, type ParsedMonth } from "./parser";

const TTL_MS = 60_000;

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

/**
 * Returns the cached value for `key` if present and not expired, otherwise
 * calls `fetcher`, caches the result (including `null`/misses, so repeated
 * lookups for a sheet tab that doesn't exist don't keep hitting the API),
 * and returns it.
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const cached = store.get(key);
  if (cached && cached.expiresAt > now) {
    console.log(`[sheet-cache] HIT ${key}`);
    return cached.value as T;
  }

  console.log(`[sheet-cache] MISS ${key} — Sheets API'ye gidiliyor`);
  const value = await fetcher();
  store.set(key, { value, expiresAt: now + TTL_MS });
  return value;
}

/** Test/debug helper — clears every cached entry. */
export function clearSheetCache(): void {
  store.clear();
}

/**
 * Cached wrapper around `parseMonthSheet` for read-only availability
 * lookups. Same tab requested within 60s reuses the previous parse instead
 * of hitting the Sheets API again.
 */
export async function parseMonthSheetCached(
  tabName: string
): Promise<ParsedMonth | null> {
  return withCache(`month-sheet:${tabName}`, () => parseMonthSheet(tabName));
}
