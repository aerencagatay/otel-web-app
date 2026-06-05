/**
 * One-off fix: wrap ADMIN_PASSWORD_HASH in single quotes so Next.js's
 * dotenv-expand does not mangle the `$` characters in the bcrypt hash.
 * Does not print the secret.
 */
import { readFileSync, writeFileSync } from "node:fs";

const path = ".env.local";
const lines = readFileSync(path, "utf8").split(/\r?\n/);
let changed = false;

const out = lines.map((line) => {
  if (!line.startsWith("ADMIN_PASSWORD_HASH=")) return line;
  let value = line.slice("ADMIN_PASSWORD_HASH=".length).trim();
  // strip existing surrounding quotes (single or double)
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    value = value.slice(1, -1);
  }
  changed = true;
  return `ADMIN_PASSWORD_HASH='${value}'`;
});

if (!changed) {
  console.error("ADMIN_PASSWORD_HASH satiri bulunamadi.");
  process.exit(1);
}

writeFileSync(path, out.join("\n"), "utf8");
console.log(".env.local guncellendi: ADMIN_PASSWORD_HASH tek tirnak icine alindi.");
