#!/usr/bin/env node
/**
 * Hero sahnesi varlık üretimi ("Taş ve Işık" — UI_UX_AUDIT.md §8.1/§8.9).
 *
 * Üç çıktı üretir:
 *
 *   1. `hero-poster-mobile.jpg` (720x1280)
 *      Mobilde `hero-poster.jpg` (1920x1280 yatay) genişliğinin ~%68'ini
 *      indirip atıyordu. Bu türev, kaynağın pergola açıklığını ve koy
 *      kavisini içeren dikey bölgesini kadrajlar — mobilde kendi başına
 *      tam bir kompozisyon, masaüstünün kırpılmış hâli değil.
 *
 *   2. `hero-window-v1.mp4` (720x820, ~3.8 sn, sessiz)
 *      Bulgu Y1/K4: `otel-video.mp4` 720x1280 DİKEY, üstelik altı kesmeli
 *      bir sosyal medya reel'i (kesmeler 2.47/4.00/6.03/6.97/9.23/10.57)
 *      ve tüm kare boyunca "ASSOS'TA SONSUZ MAVİLİK VE YEŞİL..." yazısı
 *      gömülü. Yatay master YOK.
 *
 *      Çözüm: tek kesintisiz plan olan 4.10-6.00 aralığı (taş istinat
 *      duvarı + ahşap balkon + kaldırım, sıcak yatık ışık — konseptin
 *      malzemesi) alınır ve üstten 460px kırpılır. Gömülü yazı kaynağın
 *      y=380..415 bandında olduğu için bu kırpma onu tamamen keser.
 *
 *      Kalan 720x820 (~7:8) kadraj, hero'da 320x364 CSS px'lik bir
 *      "pencere"de gösterilir: DPR2'de 0.89x KÜÇÜLTME, yani bugünkü 2x
 *      büyütmenin tersi. Görüntü ilk kez net.
 *
 *      1.9 sn çok kısa bir döngü olduğu için ileri + geri (ping-pong)
 *      birleştirilir; kamera yavaş kaydığı için dönüş dikişi görünmez.
 *
 *   3. `hero-window-poster.jpg` (720x820)
 *      Klibin İLK KARESİ. `<video poster>` olarak kullanılır; böylece
 *      video eklenip oynamaya başladığında görünür bir geçiş olmaz —
 *      duran görüntü sadece kaymaya başlar. §8.10'un "tek orkestre
 *      edilmiş an" kuralı ikinci bir hareket anıyla bozulmaz.
 *
 * DOSYA ADLARI: `next.config.ts` `/img/:path*` altına bir yıllık
 * `immutable` cache veriyor. Bu yüzden içerik değişirse dosya adındaki
 * sürüm de artmalı (`-v1` -> `-v2`), yoksa eski ziyaretçiler bir yıl
 * boyunca eski dosyayı görür.
 *
 * Idempotent: çıktı kaynağından yeniyse atlanır. `--force` ile hepsi
 * yeniden üretilir.
 *
 * Kullanım:
 *   node scripts/build-hero-assets.mjs
 *   node scripts/build-hero-assets.mjs --force
 */

import { existsSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMG = path.join(ROOT, "public", "img");
const FORCE = process.argv.includes("--force");

/** Hero fotoğrafı: 1920x1280, 3:2 yatay. */
const POSTER_SRC = path.join(IMG, "hero-poster.jpg");
/** Reel kaynağı: 720x1280 dikey, 13.03 sn, gömülü yazılı. */
const VIDEO_SRC = path.join(IMG, "otel-video.mp4");

/**
 * Mobil kadraj: kaynağın x=859..1579 aralığı. Bu pencere pergola
 * kirişlerini üstte, koyu ~%42 yükseklikte, salıncak oturağını ve gölgeli
 * çimi altta (metin için koyu taban) bırakır.
 */
const MOBILE_CROP = { left: 859, top: 0, width: 720, height: 1280 };

/** Tek kesintisiz planın sınırları (ffmpeg sahne analiziyle ölçüldü). */
const CLIP_START = 4.1;
const CLIP_DURATION = 1.9;
/**
 * Üstten atılan piksel. Gömülü yazı y=380..415'te; 460 hem yazıyı hem
 * altındaki gölge halesini güvenli payla keser.
 */
const CROP_TOP = 460;
const CROP_W = 720;
const CROP_H = 1280 - CROP_TOP; // 820

/**
 * Kodlama ayarları ölçülerek seçildi (ping-pong dahil ~3.8 sn çıktı):
 *   crf 26 / 30fps -> 1206 KB   crf 28 / 30fps -> 908 KB
 *   crf 30 / 25fps ->  649 KB   crf 31 / 24fps -> 565 KB
 * 640 px genişlikte (DPR2'de pencerenin gerçek boyutu) crf 31 ile crf 28
 * arasında görünür fark yok — taş dokusu, kaldırım derzleri ve ahşap
 * korkuluk bozulmuyor. Hava çekimi yavaş kaydığı için 24 fps yeterli.
 */
const CRF = 31;
const FPS = 24;

/**
 * Grade (§8.9 "tüm site görselleri tek preset"). Klip, poster fotoğrafından
 * belirgin daha doygun ve daha yeşildi; hero'da ölçtüğümde pencere karedeki
 * EN doygun nesne oluyor ve hiyerarşide 4. sırada olması gerekirken göze
 * ilk o giriyordu. Doygunluk -10%, gölgeler hafif açılır (siyah nokta
 * kapanmasın), orta ton kontrastı +2%.
 *
 * Grade dosyaya gömülür, CSS `filter` ile YAPILMAZ: runtime filtre hem
 * compositing katmanı yaratır hem scrim'in kontrast matematiğini
 * belirsizleştirir.
 */
const GRADE = "eq=saturation=0.90:contrast=1.02:brightness=0.012";

const outputs = {
  mobilePoster: path.join(IMG, "hero-poster-mobile.jpg"),
  windowVideo: path.join(IMG, "hero-window-v1.mp4"),
  windowPoster: path.join(IMG, "hero-window-poster.jpg"),
};

function isFresh(out, src) {
  if (FORCE || !existsSync(out)) return false;
  return statSync(out).mtimeMs >= statSync(src).mtimeMs;
}

function kb(file) {
  return Math.round(statSync(file).size / 1024);
}

function ffmpeg(args) {
  execFileSync(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: ["ignore", "inherit", "inherit"],
  });
}

async function buildMobilePoster() {
  if (isFresh(outputs.mobilePoster, POSTER_SRC)) {
    console.log("atlandi  hero-poster-mobile.jpg (guncel)");
    return;
  }
  await sharp(POSTER_SRC)
    .extract(MOBILE_CROP)
    // q78 + mozjpeg: 344 KB'lik yatay kaynagin yerine ~130 KB.
    .jpeg({ quality: 78, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(outputs.mobilePoster);
  console.log(`uretildi hero-poster-mobile.jpg  720x1280  ${kb(outputs.mobilePoster)} KB`);
}

function buildWindowVideo() {
  if (isFresh(outputs.windowVideo, VIDEO_SRC)) {
    console.log("atlandi  hero-window-v1.mp4 (guncel)");
    return;
  }
  ffmpeg([
    // -ss/-t girdiden ONCE: hizli arama, sadece gereken 1.9 sn cozulur.
    "-ss", String(CLIP_START),
    "-t", String(CLIP_DURATION),
    "-i", VIDEO_SRC,
    // crop -> split -> biri ters -> ikisini arka arkaya ekle (ping-pong).
    "-filter_complex",
    `[0:v]crop=${CROP_W}:${CROP_H}:0:${CROP_TOP},${GRADE},fps=${FPS},setpts=PTS-STARTPTS,split[a][b];` +
      `[b]reverse,setpts=PTS-STARTPTS[r];[a][r]concat=n=2:v=1[out]`,
    "-map", "[out]",
    // Video her zaman muted oynuyor; ses akisi tasinmaz.
    "-an",
    "-c:v", "libx264",
    "-crf", String(CRF),
    "-preset", "slow",
    "-profile:v", "high",
    // yuv420p: Safari dahil her yerde donanim cozumu icin zorunlu.
    "-pix_fmt", "yuv420p",
    // moov atom basa: video ilk baytlardan itibaren oynatilabilir.
    "-movflags", "+faststart",
    outputs.windowVideo,
  ]);
  console.log(
    `uretildi hero-window-v1.mp4  ${CROP_W}x${CROP_H}  ~${(CLIP_DURATION * 2).toFixed(1)} sn  ${kb(outputs.windowVideo)} KB`
  );
}

function buildWindowPoster() {
  if (isFresh(outputs.windowPoster, VIDEO_SRC)) {
    console.log("atlandi  hero-window-poster.jpg (guncel)");
    return;
  }
  ffmpeg([
    "-ss", String(CLIP_START),
    "-i", VIDEO_SRC,
    "-frames:v", "1",
    // AYNI grade: poster ile videonun ilk karesi birebir eşleşmezse
    // video başladığında renk sıçraması olur ve "görünmez geçiş" bozulur.
    "-vf", `crop=${CROP_W}:${CROP_H}:0:${CROP_TOP},${GRADE}`,
    "-q:v", "4",
    outputs.windowPoster,
  ]);
  console.log(`uretildi hero-window-poster.jpg  ${CROP_W}x${CROP_H}  ${kb(outputs.windowPoster)} KB`);
}

for (const src of [POSTER_SRC, VIDEO_SRC]) {
  if (!existsSync(src)) {
    console.error(`Kaynak bulunamadi: ${path.relative(ROOT, src)}`);
    process.exit(1);
  }
}

await buildMobilePoster();
buildWindowVideo();
buildWindowPoster();
