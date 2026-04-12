import { getSheetsClient, getSheetId } from "./client";
import { parseMonthSheet, isCellOccupied } from "./parser";
import { ROOM_TYPE_MAP } from "../config/room-types";
import { splitByMonth } from "../utils/dates";

const TURKISH_MONTH_NAMES = [
  "",
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function monthToTabName(yearMonth: string): string {
  const [year, month] = yearMonth.split("-").map(Number);
  return `${TURKISH_MONTH_NAMES[month]} ${year}`;
}

/**
 * Write a pending reservation (green cells) to the sheet.
 * Returns the room label that was booked, or null if no room available.
 */
export async function writePendingReservation(
  checkIn: string,
  checkOut: string,
  roomType: string,
  guestName: string
): Promise<{ roomLabel: string } | null> {
  const monthGroups = splitByMonth(checkIn, checkOut);
  const config = ROOM_TYPE_MAP[roomType];
  if (!config) throw new Error(`Unknown room type: ${roomType}`);

  const sheets = getSheetsClient();
  const sheetId = getSheetId();

  // Find an available room of this type
  let targetRoomLabel: string | null = null;

  // Check first month to find available rooms
  const firstMonth = monthGroups[0];
  const tabName = monthToTabName(firstMonth.month);
  const parsed = await parseMonthSheet(tabName);
  if (!parsed) return null;

  // Find a room that's free for ALL dates in ALL months
  for (const room of parsed.rooms) {
    if (room.roomType !== roomType) continue;

    // Check this room across all months
    let roomAvailable = true;

    for (const group of monthGroups) {
      const mTabName = monthToTabName(group.month);
      const mParsed =
        mTabName === tabName ? parsed : await parseMonthSheet(mTabName);
      if (!mParsed) {
        roomAvailable = false;
        break;
      }

      const matchingRoom = mParsed.rooms.find(
        (r) => r.roomLabel === room.roomLabel
      );
      if (!matchingRoom) {
        roomAvailable = false;
        break;
      }

      for (const date of group.dates) {
        const cell = matchingRoom.cells.get(date);
        if (cell && isCellOccupied(cell)) {
          roomAvailable = false;
          break;
        }
      }
      if (!roomAvailable) break;
    }

    if (roomAvailable) {
      targetRoomLabel = room.roomLabel;
      break;
    }
  }

  if (!targetRoomLabel) return null;

  // Write green cells for all dates in all months
  const cellText = `WEB | ${guestName}`;

  for (const group of monthGroups) {
    const mTabName = monthToTabName(group.month);
    const mParsed =
      mTabName === tabName ? parsed : await parseMonthSheet(mTabName);
    if (!mParsed) continue;

    const matchingRoom = mParsed.rooms.find(
      (r) => r.roomLabel === targetRoomLabel
    );
    if (!matchingRoom) continue;

    for (const date of group.dates) {
      const dc = mParsed.dateColumns.find((d) => d.date === date);
      if (!dc) continue;

      const cellAddress = `'${mTabName}'!${colToLetter(dc.colIndex)}${matchingRoom.rowIndex + 1}`;

      // Write value
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: cellAddress,
        valueInputOption: "RAW",
        requestBody: { values: [[cellText]] },
      });
    }

    // Batch format update: green background for all cells in this month
    const sheetInfo = await getSheetGid(mTabName);
    if (sheetInfo === null) continue;

    const requests = group.dates
      .map((date) => {
        const dc = mParsed.dateColumns.find((d) => d.date === date);
        if (!dc) return null;
        return {
          repeatCell: {
            range: {
              sheetId: sheetInfo,
              startRowIndex: matchingRoom.rowIndex,
              endRowIndex: matchingRoom.rowIndex + 1,
              startColumnIndex: dc.colIndex,
              endColumnIndex: dc.colIndex + 1,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.56, green: 0.93, blue: 0.56 },
              },
            },
            fields: "userEnteredFormat.backgroundColor",
          },
        };
      })
      .filter(Boolean);

    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: { requests: requests as any[] },
      });
    }
  }

  return { roomLabel: targetRoomLabel };
}

/**
 * Confirm a reservation: change green cells to red.
 */
export async function confirmReservation(
  checkIn: string,
  checkOut: string,
  roomLabel: string
): Promise<void> {
  const monthGroups = splitByMonth(checkIn, checkOut);
  const sheets = getSheetsClient();
  const sheetId = getSheetId();

  for (const group of monthGroups) {
    const tabName = monthToTabName(group.month);
    const parsed = await parseMonthSheet(tabName);
    if (!parsed) continue;

    const room = parsed.rooms.find((r) => r.roomLabel === roomLabel);
    if (!room) continue;

    const sheetGid = await getSheetGid(tabName);
    if (sheetGid === null) continue;

    const requests = group.dates
      .map((date) => {
        const dc = parsed.dateColumns.find((d) => d.date === date);
        if (!dc) return null;
        return {
          repeatCell: {
            range: {
              sheetId: sheetGid,
              startRowIndex: room.rowIndex,
              endRowIndex: room.rowIndex + 1,
              startColumnIndex: dc.colIndex,
              endColumnIndex: dc.colIndex + 1,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.96, green: 0.4, blue: 0.4 },
              },
            },
            fields: "userEnteredFormat.backgroundColor",
          },
        };
      })
      .filter(Boolean);

    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: { requests: requests as any[] },
      });
    }
  }
}

/**
 * Cancel a reservation: clear cells.
 */
export async function cancelReservation(
  checkIn: string,
  checkOut: string,
  roomLabel: string
): Promise<void> {
  const monthGroups = splitByMonth(checkIn, checkOut);
  const sheets = getSheetsClient();
  const sheetId = getSheetId();

  for (const group of monthGroups) {
    const tabName = monthToTabName(group.month);
    const parsed = await parseMonthSheet(tabName);
    if (!parsed) continue;

    const room = parsed.rooms.find((r) => r.roomLabel === roomLabel);
    if (!room) continue;

    const sheetGid = await getSheetGid(tabName);
    if (sheetGid === null) continue;

    // Clear values
    for (const date of group.dates) {
      const dc = parsed.dateColumns.find((d) => d.date === date);
      if (!dc) continue;

      const cellAddress = `'${tabName}'!${colToLetter(dc.colIndex)}${room.rowIndex + 1}`;
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: cellAddress,
        valueInputOption: "RAW",
        requestBody: { values: [[""]] },
      });
    }

    // Clear formatting
    const requests = group.dates
      .map((date) => {
        const dc = parsed.dateColumns.find((d) => d.date === date);
        if (!dc) return null;
        return {
          repeatCell: {
            range: {
              sheetId: sheetGid,
              startRowIndex: room.rowIndex,
              endRowIndex: room.rowIndex + 1,
              startColumnIndex: dc.colIndex,
              endColumnIndex: dc.colIndex + 1,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 1, green: 1, blue: 1 },
              },
            },
            fields: "userEnteredFormat.backgroundColor",
          },
        };
      })
      .filter(Boolean);

    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: { requests: requests as any[] },
      });
    }
  }
}

// Helpers
function colToLetter(col: number): string {
  let letter = "";
  let temp = col;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

async function getSheetGid(tabName: string): Promise<number | null> {
  const sheets = getSheetsClient();
  const sheetId = getSheetId();

  const res = await sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: "sheets.properties",
  });

  const sheet = res.data.sheets?.find(
    (s) => s.properties?.title === tabName
  );

  return sheet?.properties?.sheetId ?? null;
}
