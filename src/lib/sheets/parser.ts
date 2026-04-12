import { getSheetsClient, getSheetId } from "./client";
import { getRoomTypeBySheetLabel } from "../config/room-types";

export interface SheetCell {
  value: string;
  backgroundColor?: { red?: number; green?: number; blue?: number };
}

export interface ParsedMonth {
  month: string; // e.g. "2026-06"
  dateColumns: { date: string; colIndex: number }[];
  rooms: {
    rowIndex: number;
    roomLabel: string;
    roomType: string | null;
    cells: Map<string, SheetCell>; // date -> cell
  }[];
}

/**
 * Fetch and parse a specific sheet tab for a given month.
 * Sheet tab names expected like "Haziran 2026", "Temmuz 2026", etc.
 */
export async function parseMonthSheet(
  tabName: string
): Promise<ParsedMonth | null> {
  const sheets = getSheetsClient();
  const sheetId = getSheetId();

  // Fetch both values and formats
  const [valuesRes, formatsRes] = await Promise.all([
    sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `'${tabName}'`,
      valueRenderOption: "UNFORMATTED_VALUE",
    }),
    sheets.spreadsheets.get({
      spreadsheetId: sheetId,
      ranges: [`'${tabName}'`],
      fields:
        "sheets.data.rowData.values.userEnteredFormat.backgroundColor,sheets.data.rowData.values.effectiveValue",
    }),
  ]);

  const values = valuesRes.data.values;
  if (!values || values.length === 0) return null;

  const rowData = formatsRes.data.sheets?.[0]?.data?.[0]?.rowData || [];

  // Find the header row with dates (look for row containing numbers 1-31)
  let dateRowIndex = -1;
  let dateColumns: { date: string; colIndex: number }[] = [];

  for (let r = 0; r < Math.min(values.length, 5); r++) {
    const row = values[r];
    const dateCols: { date: string; colIndex: number }[] = [];

    for (let c = 0; c < row.length; c++) {
      const val = row[c];
      if (typeof val === "number" && val >= 1 && val <= 31) {
        dateCols.push({ date: String(val), colIndex: c });
      }
    }

    if (dateCols.length >= 15) {
      dateRowIndex = r;
      dateColumns = dateCols;
      break;
    }
  }

  if (dateRowIndex === -1) return null;

  // Determine month/year from tab name
  const monthInfo = parseTabName(tabName);
  if (!monthInfo) return null;

  // Map column dates to full YYYY-MM-DD
  const fullDateColumns = dateColumns.map((dc) => ({
    date: `${monthInfo.year}-${String(monthInfo.month).padStart(2, "0")}-${dc.date.padStart(2, "0")}`,
    colIndex: dc.colIndex,
  }));

  // Parse room rows (rows after the date header)
  const rooms: ParsedMonth["rooms"] = [];

  for (let r = dateRowIndex + 1; r < values.length; r++) {
    const row = values[r];
    if (!row || row.length === 0) continue;

    const roomLabel = String(row[0] || "").trim();
    if (!roomLabel) continue;

    const roomType = getRoomTypeBySheetLabel(roomLabel);
    if (!roomType) continue; // Skip rows that don't match a known room type

    const cells = new Map<string, SheetCell>();

    for (const dc of fullDateColumns) {
      const cellValue = String(row[dc.colIndex] || "").trim();
      const rawColor =
        rowData[r]?.values?.[dc.colIndex]?.userEnteredFormat?.backgroundColor;

      const cellFormat = rawColor
        ? {
            red: rawColor.red ?? undefined,
            green: rawColor.green ?? undefined,
            blue: rawColor.blue ?? undefined,
          }
        : undefined;

      cells.set(dc.date, {
        value: cellValue,
        backgroundColor: cellFormat,
      });
    }

    rooms.push({ rowIndex: r, roomLabel, roomType, cells });
  }

  return {
    month: `${monthInfo.year}-${String(monthInfo.month).padStart(2, "0")}`,
    dateColumns: fullDateColumns,
    rooms,
  };
}

const TURKISH_MONTHS: Record<string, number> = {
  ocak: 1,
  şubat: 2,
  mart: 3,
  nisan: 4,
  mayıs: 5,
  haziran: 6,
  temmuz: 7,
  ağustos: 8,
  eylül: 9,
  ekim: 10,
  kasım: 11,
  aralık: 12,
};

function parseTabName(
  name: string
): { month: number; year: number } | null {
  const parts = name.trim().toLowerCase().split(/\s+/);
  if (parts.length < 2) return null;

  const monthName = parts[0];
  const year = parseInt(parts[1]);

  const month = TURKISH_MONTHS[monthName];
  if (!month || isNaN(year)) return null;

  return { month, year };
}

/**
 * Check if a cell is "occupied" (green = pending, red = confirmed).
 */
export function isCellOccupied(cell: SheetCell): boolean {
  if (cell.value && cell.value.length > 0) return true;

  const bg = cell.backgroundColor;
  if (!bg) return false;

  // Green-ish (pending)
  if ((bg.green || 0) > 0.5 && (bg.red || 0) < 0.5) return true;
  // Red-ish (confirmed)
  if ((bg.red || 0) > 0.5 && (bg.green || 0) < 0.5) return true;

  return false;
}
