/**
 * Set the admin password: hashes the given plaintext password with bcrypt
 * and writes it straight into .env.local (single-quoted so Next.js's
 * dotenv-expand can't mangle the `$` characters). No copy-paste needed.
 *
 * Usage:
 *   node scripts/set-admin-password.mjs "your-password"
 *
 * The password is only on your local command line; the hash goes directly
 * into the file. Neither is printed to the screen.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/set-admin-password.mjs "your-password"');
  process.exit(1);
}
if (!existsSync(".env.local")) {
  console.error(".env.local bulunamadi.");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

// Escape every `$` as `\$` so Next.js's dotenv-expand treats them as
// literals instead of variable references (single/double quotes do NOT
// reliably prevent expansion in this Next version).
const escaped = hash.replace(/\$/g, "\\$");

const lines = readFileSync(".env.local", "utf8").split(/\r?\n/);
let found = false;
const out = lines.map((line) => {
  if (!line.startsWith("ADMIN_PASSWORD_HASH=")) return line;
  found = true;
  return `ADMIN_PASSWORD_HASH=${escaped}`;
});
if (!found) {
  out.push(`ADMIN_PASSWORD_HASH=${escaped}`);
}

writeFileSync(".env.local", out.join("\n"), "utf8");
console.log("✅ Admin sifresi guncellendi (hash .env.local'e yazildi, escaped).");
console.log("Hash uzunlugu:", hash.length, "| baslangic:", hash.slice(0, 4));
console.log("");
console.log("=== VERCEL ICIN (raw — tirnak/escape YOK, oldugu gibi yapistir) ===");
console.log(hash);
console.log("===================================================================");
console.log("");
console.log("1) Yukaridaki satiri Vercel > Settings > Environment Variables >");
console.log("   ADMIN_PASSWORD_HASH degerine yapistir (eskisini sil).");
console.log("2) Degisikligin gecerli olmasi icin Vercel'de redeploy gerekir.");
console.log("3) Lokal icin dev sunucusunu yeniden baslat: Ctrl+C, sonra npm run dev");
