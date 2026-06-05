/**
 * One-off setup script — creates the rezervasyon Google Sheet from scratch.
 *
 * Usage:
 *   node scripts/setup-sheet.mjs path/to/service-account.json
 *
 * What it does:
 *   1. Creates a new spreadsheet titled "Karadut Rezervasyon Sistemi"
 *   2. Adds a `Web_Reservations` log tab with the header row the app expects
 *   3. Adds 12 monthly availability tabs (current month + 11 future), each
 *      with a date header (1..31) and one row per room
 *   4. Prints the SHEET_ID and the service-account email to share with
 *
 * After running:
 *   - Set GOOGLE_SHEET_ID in Vercel = printed value
 *   - The service account email already owns the sheet, no extra share needed
 *     (it created the sheet); but if you want karaduttasotel@gmail.com to see
 *     it in their Drive, share the printed URL with that account
 */

import { readFileSync } from "node:fs";
import { google } from "googleapis";

// ---------- EDIT THIS LIST IF ROOM LAYOUT IS DIFFERENT ---------------------
// Each label MUST contain one of the substrings the app's
// src/lib/config/room-types.ts looks for:
//   "1+0 Panaromic"   → deluxe_sea_view
//   "1+0 Traditional" → traditional_room
//   "1+1 Premium"     → premium_family
//   "1+1 5 kisi"      → premium_family
//
// Total 34 rooms — adjust the per-type counts as you like.
const ROOMS = [
  // Deluxe Deniz Manzaralı (Panaromic)
  ...range(1, 12).map((n) => `1+0 Panaromic ${100 + n}`),
  // Traditional
  ...range(1, 12).map((n) => `1+0 Traditional ${200 + n}`),
  // 1+1 Premium (Aile)
  ...range(1, 10).map((n) => `1+1 Premium ${300 + n}`),
];

// How many months to pre-create (current + N-1)
const MONTH_COUNT = 12;

const TURKISH_MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const LOG_HEADER = [
  "reservationId", "status", "checkIn", "checkOut", "nights",
  "roomType", "roomLabel", "firstName", "lastName", "email",
  "phone", "adults", "children", "depositAmount", "notes",
  "createdAt", "confirmedAt", "cancelledAt",
];

// ---------- main -----------------------------------------------------------

const keyPath = process.argv[2];
const existingSheetId = process.argv[3]; // optional: populate an existing sheet by ID
if (!keyPath) {
  console.error("Usage: node scripts/setup-sheet.mjs path/to/service-account.json [existingSheetId]");
  console.error("");
  console.error("  - Without [existingSheetId]: creates a new sheet (needs Drive API; sheet is owned by the service account).");
  console.error("  - With [existingSheetId]: populates a sheet you created and shared with the service account as Editor (recommended).");
  process.exit(1);
}

const credentials = JSON.parse(readFileSync(keyPath, "utf8"));
const serviceAccountEmail = credentials.client_email;

const auth = new google.auth.JWT({
  email: serviceAccountEmail,
  key: credentials.private_key,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ],
});

const sheets = google.sheets({ version: "v4", auth });

// 1. Build month list starting from this month
const now = new Date();
const months = [];
for (let i = 0; i < MONTH_COUNT; i++) {
  const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
  months.push({
    title: `${TURKISH_MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
    daysInMonth: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(),
  });
}

// Monthly tab grid (day columns need columnCount > 31, so a default 26-col
// sheet is not enough — we always set it explicitly).
const monthGrid = {
  rowCount: ROOMS.length + 5,
  columnCount: 33,
  frozenRowCount: 2,
  frozenColumnCount: 1,
};

const targetTabs = ["Web_Reservations", ...months.map((m) => m.title)];

let spreadsheetId;
let url;
const gidByTitle = new Map();

if (existingSheetId) {
  // ---- Populate an existing, shared spreadsheet (recommended path) --------
  spreadsheetId = existingSheetId;
  console.log(`Using existing spreadsheet: ${spreadsheetId}`);

  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  url = meta.data.spreadsheetUrl;
  for (const s of meta.data.sheets ?? []) {
    if (s.properties?.title != null && typeof s.properties.sheetId === "number") {
      gidByTitle.set(s.properties.title, s.properties.sheetId);
    }
  }

  // Add only the tabs that don't exist yet
  const toAdd = targetTabs.filter((t) => !gidByTitle.has(t));
  if (toAdd.length) {
    console.log(`Adding ${toAdd.length} missing tab(s)…`);
    const addReqs = toAdd.map((title) => ({
      addSheet: {
        properties: {
          title,
          ...(title === "Web_Reservations" ? {} : { gridProperties: monthGrid }),
        },
      },
    }));
    const addRes = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: addReqs },
    });
    for (const reply of addRes.data.replies ?? []) {
      const p = reply.addSheet?.properties;
      if (p?.title != null && typeof p.sheetId === "number") {
        gidByTitle.set(p.title, p.sheetId);
      }
    }
  } else {
    console.log("All target tabs already present — repopulating headers.");
  }
} else {
  // ---- Create a brand-new spreadsheet (needs Drive API) -------------------
  console.log("Creating spreadsheet…");
  const createRes = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: "Karadut Rezervasyon Sistemi" },
      sheets: [
        // Web_Reservations log
        {
          properties: { title: "Web_Reservations", index: 0 },
        },
        // 12 monthly tabs
        ...months.map((m, i) => ({
          properties: {
            title: m.title,
            index: i + 1,
            gridProperties: monthGrid,
          },
        })),
      ],
    },
  });

  spreadsheetId = createRes.data.spreadsheetId;
  url = createRes.data.spreadsheetUrl;
  console.log(`✅ Spreadsheet created: ${url}`);

  for (const s of createRes.data.sheets ?? []) {
    if (s.properties?.title && typeof s.properties.sheetId === "number") {
      gidByTitle.set(s.properties.title, s.properties.sheetId);
    }
  }
}

// 3. One batchUpdate to populate everything
console.log("Populating tabs…");
const requests = [];

// 3a. Web_Reservations header row
requests.push({
  updateCells: {
    rows: [{ values: LOG_HEADER.map((h) => ({
      userEnteredValue: { stringValue: h },
      userEnteredFormat: {
        textFormat: { bold: true },
        backgroundColor: { red: 0.85, green: 0.85, blue: 0.85 },
      },
    })) }],
    fields: "userEnteredValue,userEnteredFormat.textFormat.bold,userEnteredFormat.backgroundColor",
    start: { sheetId: gidByTitle.get("Web_Reservations"), rowIndex: 0, columnIndex: 0 },
  },
});

// 3b. Each monthly tab: title row + date header (1..N) + room rows
for (const m of months) {
  const gid = gidByTitle.get(m.title);

  // Row 0: title cell at A1 (e.g. "Mayıs 2026")
  requests.push({
    updateCells: {
      rows: [{ values: [{
        userEnteredValue: { stringValue: m.title },
        userEnteredFormat: {
          textFormat: { bold: true, fontSize: 12 },
          backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
        },
      }] }],
      fields: "userEnteredValue,userEnteredFormat.textFormat,userEnteredFormat.backgroundColor",
      start: { sheetId: gid, rowIndex: 0, columnIndex: 0 },
    },
  });

  // Row 1: "ODA" in A, then numbers 1..daysInMonth in B..
  const dateHeaderCells = [
    {
      userEnteredValue: { stringValue: "ODA" },
      userEnteredFormat: {
        textFormat: { bold: true },
        backgroundColor: { red: 0.85, green: 0.85, blue: 0.85 },
      },
    },
    ...range(1, m.daysInMonth).map((d) => ({
      userEnteredValue: { numberValue: d },
      userEnteredFormat: {
        textFormat: { bold: true },
        backgroundColor: { red: 0.85, green: 0.85, blue: 0.85 },
        horizontalAlignment: "CENTER",
      },
    })),
  ];
  requests.push({
    updateCells: {
      rows: [{ values: dateHeaderCells }],
      fields: "userEnteredValue,userEnteredFormat",
      start: { sheetId: gid, rowIndex: 1, columnIndex: 0 },
    },
  });

  // Rows 2..N: room labels in column A, blank availability cells after
  for (let i = 0; i < ROOMS.length; i++) {
    requests.push({
      updateCells: {
        rows: [{ values: [{
          userEnteredValue: { stringValue: ROOMS[i] },
          userEnteredFormat: { textFormat: { bold: true } },
        }] }],
        fields: "userEnteredValue,userEnteredFormat.textFormat.bold",
        start: { sheetId: gid, rowIndex: 2 + i, columnIndex: 0 },
      },
    });
  }

  // Narrow date columns for readability
  requests.push({
    updateDimensionProperties: {
      range: {
        sheetId: gid,
        dimension: "COLUMNS",
        startIndex: 1,
        endIndex: m.daysInMonth + 1,
      },
      properties: { pixelSize: 35 },
      fields: "pixelSize",
    },
  });

  // Wider room-label column
  requests.push({
    updateDimensionProperties: {
      range: { sheetId: gid, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
      properties: { pixelSize: 180 },
      fields: "pixelSize",
    },
  });
}

await sheets.spreadsheets.batchUpdate({
  spreadsheetId,
  requestBody: { requests },
});

console.log("✅ Tabs populated.");
console.log("");
console.log("=========================================================");
console.log("PASTE THIS INTO VERCEL ENV:");
console.log(`  GOOGLE_SHEET_ID=${spreadsheetId}`);
console.log("=========================================================");
console.log("");
if (existingSheetId) {
  console.log(`Service account (must be shared as Editor): ${serviceAccountEmail}`);
  console.log("→ If you see a 403 above, make sure the sheet is shared with that");
  console.log("  email as Editor, then re-run.");
} else {
  console.log(`Service account (owns the sheet): ${serviceAccountEmail}`);
  console.log("Optional: share the URL with karaduttasotel@gmail.com so the");
  console.log("hotel staff can view/edit the sheet in their own Drive.");
}
console.log(`Open in browser: ${url}`);

function range(start, count) {
  return Array.from({ length: count }, (_, i) => start + i);
}
