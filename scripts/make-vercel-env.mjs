/**
 * Produce a copy-paste-ready list of Vercel env values.
 * - GOOGLE_PRIVATE_KEY is read from the service-account JSON as a single line
 *   with literal \n (the app converts it back via .replace(/\\n/g, "\n")).
 * - Other values are read raw from .env.local (quotes stripped).
 * Output goes to a file OUTSIDE the repo so it is never committed.
 * Secrets are written to that file but never printed to the screen.
 *
 * Usage: node scripts/make-vercel-env.mjs path/to/service-account.json <outFile>
 */
import { readFileSync, writeFileSync } from "node:fs";

const [keyPath, outFile] = process.argv.slice(2);
if (!keyPath || !outFile) {
  console.error("Usage: node scripts/make-vercel-env.mjs <key.json> <outFile>");
  process.exit(1);
}

const k = JSON.parse(readFileSync(keyPath, "utf8"));
const privateKeyOneLine = k.private_key.replace(/\n/g, "\\n");

// raw parse of .env.local (no dotenv-expand, just strip surrounding quotes)
const envRaw = readFileSync(".env.local", "utf8").split(/\r?\n/);
function get(name) {
  const line = envRaw.find((l) => l.startsWith(name + "="));
  if (!line) return "";
  let v = line.slice(name.length + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  return v;
}

const blocks = [
  "# === VERCEL ENV DEGERLERI — her birini Vercel'e ayri ayri yapistir ===",
  "# Vercel'de TIRNAK veya \\$ ESCAPE EKLEME. Degerleri oldugu gibi yapistir.",
  "# Bu dosyayi Vercel'e girdikten sonra SIL.",
  "",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL:",
  k.client_email,
  "",
  "GOOGLE_SHEET_ID:",
  get("GOOGLE_SHEET_ID"),
  "",
  "SESSION_SECRET:",
  get("SESSION_SECRET"),
  "",
  "RESEND_API_KEY:",
  get("RESEND_API_KEY"),
  "",
  "MAIL_FROM:",
  get("MAIL_FROM"),
  "",
  "ADMIN_EMAIL:",
  get("ADMIN_EMAIL"),
  "",
  "GOOGLE_PRIVATE_KEY: (tek satir, asagidaki butun satiri kopyala)",
  privateKeyOneLine,
  "",
  "ADMIN_PASSWORD_HASH:",
  "(YENI sifre uret: node -e \"console.log(require('bcryptjs').hashSync('YENI_SIFRE',10))\")",
  "(cikan $2b$... degerini buraya degil, dogrudan Vercel'e yapistir)",
  "",
];

writeFileSync(outFile, blocks.join("\n"), "utf8");
console.log("Olusturuldu:", outFile);
console.log("Acip Vercel'e yapistir, sonra dosyayi sil.");
