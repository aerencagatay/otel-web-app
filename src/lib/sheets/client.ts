import { google, sheets_v4 } from "googleapis";

let sheetsClient: sheets_v4.Sheets | null = null;
let sheetMetadataCache: Map<string, number> | null = null;
let sheetMetadataPromise: Promise<Map<string, number>> | null = null;

export function getSheetsClient(): sheets_v4.Sheets {
  if (sheetsClient) return sheetsClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !key || !sheetId) {
    throw new Error(
      "Missing Google Sheets env vars: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID"
    );
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

export function getSheetId(): string {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error("GOOGLE_SHEET_ID not set");
  return id;
}

/**
 * Map of tab title -> sheetId (gid). Cached for the lifetime of the process
 * to avoid N+1 spreadsheets.get calls before each batchUpdate.
 */
export async function getAllSheetMetadata(): Promise<Map<string, number>> {
  if (sheetMetadataCache) return sheetMetadataCache;
  if (sheetMetadataPromise) return sheetMetadataPromise;

  sheetMetadataPromise = (async () => {
    const sheets = getSheetsClient();
    const sheetId = getSheetId();
    const res = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
      fields: "sheets.properties(sheetId,title)",
    });
    const map = new Map<string, number>();
    for (const s of res.data.sheets ?? []) {
      const title = s.properties?.title;
      const gid = s.properties?.sheetId;
      if (title && typeof gid === "number") map.set(title, gid);
    }
    sheetMetadataCache = map;
    return map;
  })();

  try {
    return await sheetMetadataPromise;
  } finally {
    sheetMetadataPromise = null;
  }
}

export function invalidateSheetMetadataCache(): void {
  sheetMetadataCache = null;
}
