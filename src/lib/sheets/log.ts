import type { sheets_v4 } from "googleapis";
import { getSheetsClient, getSheetId } from "./client";

const LOG_TAB = "Web_Reservations";
export const LOG_TAB_NAME = LOG_TAB;

export interface ReservationLog {
  reservationId: string;
  status: "pending" | "confirmed" | "cancelled";
  checkIn: string;
  checkOut: string;
  nights: number;
  roomType: string;
  roomLabel: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  adults: number;
  children: number;
  depositAmount: number;
  notes: string;
  createdAt: string;
  confirmedAt: string;
  cancelledAt: string;
}

function logToRow(log: ReservationLog): (string | number)[] {
  return [
    log.reservationId,
    log.status,
    log.checkIn,
    log.checkOut,
    log.nights,
    log.roomType,
    log.roomLabel,
    log.firstName,
    log.lastName,
    log.email,
    log.phone,
    log.adults,
    log.children,
    log.depositAmount,
    log.notes || "",
    log.createdAt,
    log.confirmedAt || "",
    log.cancelledAt || "",
  ];
}

/**
 * Build an `appendCells` batchUpdate request that appends the log row to the
 * Web_Reservations tab. Used so the log write can ride inside the same atomic
 * batchUpdate as the monthly cell writes (closes the K3 desync window).
 */
export function buildLogAppendRequest(
  log: ReservationLog,
  logSheetGid: number
): sheets_v4.Schema$Request {
  const row = logToRow(log);
  return {
    appendCells: {
      sheetId: logSheetGid,
      rows: [
        {
          values: row.map((v) => ({
            userEnteredValue:
              typeof v === "number"
                ? { numberValue: v }
                : { stringValue: String(v) },
          })),
        },
      ],
      fields: "userEnteredValue",
    },
  };
}

/**
 * Append a log row via values.append. Kept as a fallback for admin manual
 * inserts; the standard reservation flow now writes the log inside the same
 * batchUpdate as the monthly cells.
 */
export async function appendReservationLog(
  log: ReservationLog
): Promise<void> {
  const sheets = getSheetsClient();
  const sheetId = getSheetId();

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `'${LOG_TAB}'!A:R`,
    valueInputOption: "RAW",
    requestBody: { values: [logToRow(log)] },
  });
}

/**
 * Get all reservation logs.
 */
export async function getReservationLogs(): Promise<ReservationLog[]> {
  const sheets = getSheetsClient();
  const sheetId = getSheetId();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `'${LOG_TAB}'!A2:R`,
  });

  const rows = res.data.values || [];

  return rows.map((row) => ({
    reservationId: row[0] || "",
    status: (row[1] as ReservationLog["status"]) || "pending",
    checkIn: row[2] || "",
    checkOut: row[3] || "",
    nights: Number(row[4]) || 0,
    roomType: row[5] || "",
    roomLabel: row[6] || "",
    firstName: row[7] || "",
    lastName: row[8] || "",
    email: row[9] || "",
    phone: row[10] || "",
    adults: Number(row[11]) || 0,
    children: Number(row[12]) || 0,
    depositAmount: Number(row[13]) || 0,
    notes: row[14] || "",
    createdAt: row[15] || "",
    confirmedAt: row[16] || "",
    cancelledAt: row[17] || "",
  }));
}

/**
 * Update a reservation log entry's status.
 */
export async function updateReservationLog(
  reservationId: string,
  updates: Partial<Pick<ReservationLog, "status" | "confirmedAt" | "cancelledAt">>
): Promise<void> {
  const sheets = getSheetsClient();
  const sheetId = getSheetId();

  // Find the row
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `'${LOG_TAB}'!A:A`,
  });

  const rows = res.data.values || [];
  let rowIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === reservationId) {
      rowIndex = i + 1; // 1-indexed
      break;
    }
  }

  if (rowIndex === -1) throw new Error(`Reservation not found: ${reservationId}`);

  const updateRequests: { range: string; values: string[][] }[] = [];

  if (updates.status) {
    updateRequests.push({
      range: `'${LOG_TAB}'!B${rowIndex}`,
      values: [[updates.status]],
    });
  }
  if (updates.confirmedAt) {
    updateRequests.push({
      range: `'${LOG_TAB}'!Q${rowIndex}`,
      values: [[updates.confirmedAt]],
    });
  }
  if (updates.cancelledAt) {
    updateRequests.push({
      range: `'${LOG_TAB}'!R${rowIndex}`,
      values: [[updates.cancelledAt]],
    });
  }

  for (const req of updateRequests) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: req.range,
      valueInputOption: "RAW",
      requestBody: { values: req.values },
    });
  }
}
