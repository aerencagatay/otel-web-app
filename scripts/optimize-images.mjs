#!/usr/bin/env node
/**
 * Image + video optimization script (sharp + ffmpeg-static based).
 *
 * Responsibilities:
 *   1. Generate lightweight "-web.jpg" derivatives (max 2000px wide, JPEG q80)
 *      for large raw source photos under `public/img`, so pages never need
 *      to reference multi-megabyte originals directly.
 *   2. Generate `public/og.jpg` (1200x630, <=200KB) for Open Graph / Twitter
 *      card previews, cropped from the hero photo with a dark gradient
 *      overlay + hotel name so previews stay readable on any background.
 *   3. Re-encode background videos (H.264, CRF 28, audio stripped since they
 *      are always rendered muted) to cut their size roughly 40%, and extract
 *      a first-frame poster JPEG for each so `<video poster>` never has to
 *      wait on the video download to show something.
 *
 * Idempotent: re-running skips any derivative/encode that is already newer
 * than its source. Safe to run repeatedly (e.g. from CI or by a later task
 * that adds more room photos) — pass `--force` to regenerate everything.
 *
 * Usage:
 *   node scripts/optimize-images.mjs
 *   node scripts/optimize-images.mjs --force
 */

import { existsSync, statSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_IMG = path.join(ROOT, "public", "img");
const ASSETS_RAW_IMG = path.join(ROOT, "assets-raw", "img");
const FORCE = process.argv.includes("--force");

/**
 * Raw source -> derivative base name. The source may live either in
 * `public/img` (not yet archived) or `assets-raw/img` (already archived by
 * a previous run of the "move large raw files out of public/" cleanup) —
 * the script checks both so it keeps working after that move.
 */
const DERIVATIVES = [
  { source: "hero.JPG", webBase: "hero-web" },
  { source: "hotel.JPG", webBase: "hotel-web" },
  { source: "hotel-2.JPG", webBase: "hotel-2-web" },
  { source: "balkon.JPG", webBase: "balkon-web" },
  { source: "chairperson.JPG", webBase: "chairperson-web" },
  { source: "dis-cephe.jpg", webBase: "dis-cephe-web" },
];

const MAX_WIDTH = 2000;
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 80;

function findSource(fileName) {
  const inPublic = path.join(PUBLIC_IMG, fileName);
  const inRaw = path.join(ASSETS_RAW_IMG, fileName);
  if (existsSync(inPublic)) return inPublic;
  if (existsSync(inRaw)) return inRaw;
  return null;
}

function isStale(sourcePath, outputPath) {
  if (FORCE || !existsSync(outputPath)) return true;
  return statSync(sourcePath).mtimeMs > statSync(outputPath).mtimeMs;
}

async function generateDerivative({ source, webBase }) {
  const sourcePath = findSource(source);
  if (!sourcePath) {
    console.warn(`  skip ${source}: kaynak dosya bulunamadı (public/img veya assets-raw/img)`);
    return;
  }

  const jpgOut = path.join(PUBLIC_IMG, `${webBase}.jpg`);
  const webpOut = path.join(PUBLIC_IMG, `${webBase}.webp`);

  let didWork = false;

  if (isStale(sourcePath, jpgOut)) {
    await sharp(sourcePath)
      .rotate() // apply EXIF orientation
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(jpgOut);
    didWork = true;
    console.log(`  ${webBase}.jpg  <- ${path.relative(ROOT, sourcePath)}`);
  }

  if (isStale(sourcePath, webpOut)) {
    await sharp(sourcePath)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpOut);
    didWork = true;
    console.log(`  ${webBase}.webp <- ${path.relative(ROOT, sourcePath)}`);
  }

  if (!didWork) {
    console.log(`  ${webBase}.{jpg,webp} güncel, atlandı`);
  }
}

/**
 * 1200x630 Open Graph image, cropped from the hero photo with a dark
 * bottom-up gradient + hotel name so text stays legible over any photo.
 * Iteratively lowers JPEG quality until the file is <=200KB.
 */
async function generateOgImage() {
  const ogOut = path.join(ROOT, "public", "og.jpg");
  const heroSource = findSource("hero.JPG");

  if (!heroSource) {
    console.warn("  skip og.jpg: hero.JPG kaynağı bulunamadı");
    return;
  }

  if (!FORCE && existsSync(ogOut) && statSync(heroSource).mtimeMs <= statSync(ogOut).mtimeMs) {
    console.log("  og.jpg güncel, atlandı");
    return;
  }

  const width = 1200;
  const height = 630;

  const overlaySvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000000" stop-opacity="0" />
          <stop offset="55%" stop-color="#000000" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.72" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#fade)" />
      <text x="60" y="${height - 96}" font-family="Georgia, 'Times New Roman', serif" font-size="52" fill="#ffffff" letter-spacing="1">Assos Karadut Taş Otel</text>
      <text x="60" y="${height - 52}" font-family="Arial, sans-serif" font-size="22" fill="#e7c98a" letter-spacing="3">AYVACIK · ÇANAKKALE</text>
    </svg>
  `);

  const base = await sharp(heroSource)
    .rotate()
    .resize({ width, height, fit: "cover", position: "attention" })
    .composite([{ input: overlaySvg, top: 0, left: 0 }])
    .toBuffer();

  let quality = 82;
  let buffer = await sharp(base).jpeg({ quality, mozjpeg: true }).toBuffer();
  while (buffer.length > 200 * 1024 && quality > 40) {
    quality -= 8;
    buffer = await sharp(base).jpeg({ quality, mozjpeg: true }).toBuffer();
  }

  await sharp(buffer).toFile(ogOut);
  console.log(`  og.jpg oluşturuldu (${(buffer.length / 1024).toFixed(0)}KB, q${quality})`);
}

/**
 * Background videos: re-encoded in place (H.264 CRF 28, no audio — they are
 * always rendered muted) + a first-frame poster JPEG extracted alongside.
 * `.reencoded` marker files track whether a given source has already been
 * processed, since re-encoding is destructive (can't compare mtimes against
 * itself) and this script may run more than once against the same repo.
 */
const VIDEOS = [
  { file: "otel-video.mp4", poster: "otel-video-poster.jpg" },
  { file: "oda-video.mp4", poster: "oda-video-poster.jpg" },
  { file: "havuz-video.mp4", poster: "havuz-video-poster.jpg" },
];

function runFfmpeg(args) {
  execFileSync(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
}

async function generatePoster(videoPath, posterOut) {
  if (!FORCE && existsSync(posterOut) && statSync(videoPath).mtimeMs <= statSync(posterOut).mtimeMs) {
    return false;
  }
  runFfmpeg([
    "-y",
    "-i", videoPath,
    "-ss", "00:00:00.5",
    "-frames:v", "1",
    "-vf", "scale=1280:-2",
    posterOut,
  ]);
  return true;
}

// Markers live under scripts/ (committed) — NOT public/, so they are never
// served. They record that a video was already re-encoded, because in-place
// re-encoding can't be detected via mtime comparison against itself.
const MARKER_DIR = path.join(__dirname, ".media-markers");

async function reencodeVideo({ file, poster }) {
  const videoPath = path.join(PUBLIC_IMG, file);
  const posterOut = path.join(PUBLIC_IMG, poster);
  const markerPath = path.join(MARKER_DIR, `${file}.reencoded`);

  if (!existsSync(videoPath)) {
    console.warn(`  skip ${file}: bulunamadı`);
    return;
  }

  // Poster is generated first (cheap, non-destructive), from whatever the
  // current video content is.
  const posterMade = await generatePoster(videoPath, posterOut);
  if (posterMade) console.log(`  ${poster} üretildi`);

  if (!FORCE && existsSync(markerPath)) {
    console.log(`  ${file} zaten yeniden encode edilmiş, atlandı`);
    return;
  }

  const before = statSync(videoPath).size;
  const tmpOut = `${videoPath}.tmp.mp4`;
  runFfmpeg([
    "-y",
    "-i", videoPath,
    "-c:v", "libx264",
    "-crf", "28",
    "-preset", "medium",
    "-an",
    "-movflags", "+faststart",
    tmpOut,
  ]);
  const { renameSync, writeFileSync } = await import("node:fs");
  renameSync(tmpOut, videoPath);
  await mkdir(MARKER_DIR, { recursive: true });
  writeFileSync(markerPath, new Date().toISOString());
  const after = statSync(videoPath).size;
  const pct = (100 * (1 - after / before)).toFixed(0);
  console.log(`  ${file}: ${(before / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024 / 1024).toFixed(1)}MB (-${pct}%)`);
}

async function main() {
  await mkdir(PUBLIC_IMG, { recursive: true });

  console.log("Görsel türevleri (-web.jpg / .webp) üretiliyor...");
  for (const item of DERIVATIVES) {
    await generateDerivative(item);
  }

  console.log("\nog.jpg (Open Graph önizleme görseli) üretiliyor...");
  await generateOgImage();

  console.log("\nVideolar yeniden encode ediliyor + poster üretiliyor...");
  for (const item of VIDEOS) {
    await reencodeVideo(item);
  }

  console.log("\nTamamlandı.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
