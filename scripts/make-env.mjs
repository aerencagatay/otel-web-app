/**
 * One-off helper: generate .env.local from the service-account JSON key.
 * The private key is written single-line with literal \n (the format
 * src/lib/sheets/client.ts expects via .replace(/\\n/g, "\n")).
 * Secrets are written to the file but never printed to stdout.
 *
 * Usage: node scripts/make-env.mjs path/to/service-account.json <SHEET_ID> <SESSION_SECRET>
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const [keyPath, sheetId, sessionSecret] = process.argv.slice(2);
if (!keyPath || !sheetId || !sessionSecret) {
  console.error("Usage: node scripts/make-env.mjs <key.json> <SHEET_ID> <SESSION_SECRET>");
  process.exit(1);
}
if (existsSync(".env.local")) {
  console.error(".env.local already exists — refusing to overwrite. Delete it first if you want to regenerate.");
  process.exit(1);
}

const k = JSON.parse(readFileSync(keyPath, "utf8"));
const escapedKey = k.private_key.replace(/\n/g, "\\n");

const content = `# === Google Sheets (otomatik dolduruldu) ===
GOOGLE_SERVICE_ACCOUNT_EMAIL=${k.client_email}
GOOGLE_PRIVATE_KEY="${escapedKey}"
GOOGLE_SHEET_ID=${sheetId}

# === Oturum güvenliği (otomatik üretildi) ===
SESSION_SECRET=${sessionSecret}

# === Admin girişi ===
ADMIN_EMAIL=admin@karaduttasotel.com
ADMIN_PASSWORD_HASH=BURAYA_BCRYPT_HASHINI_YAPISTIR

# === Mail (Resend) ===
RESEND_API_KEY=BURAYA_RESEND_API_KEYINI_YAPISTIR
MAIL_FROM="Assos Karadut Taş Otel <noreply@karaduttasotel.com>"
`;

writeFileSync(".env.local", content, "utf8");
console.log(".env.local olusturuldu.");
console.log("Toplam satir:", content.split("\n").length);
console.log("Private key tek satira sigdirildi (uzunluk:", escapedKey.length, "karakter).");
