# "Assos Sessizliği" Anasayfa Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** index.html'i Aman tarzı sessiz lüks tasarıma geçirmek (deniz & taş paleti, hibrit video hero, editoryal oda satırları) — diğer 4 sayfayı hiç etkilemeden.

**Architecture:** Yeni tasarım tamamen yeni dosyalarda yaşar: `css/quiet.css` (yeni tasarım sistemi), `js/quiet.js` (hero video + reveal animasyonları). `index.html` yeniden yazılır ve yalnızca yeni dosyaları yükler. `css/style.css` ve `js/app.js`'e DOKUNULMAZ (diğer sayfalar onları kullanmaya devam eder). `js/app.js` index'te yüklenmeye devam eder (booking-link rewrite + nav davranışları oradan gelir).

**Tech Stack:** Statik HTML, Bootstrap 5.3 (yalnızca grid/collapse), vanilla JS, Google Fonts (Cormorant Garamond + Montserrat), IntersectionObserver. AOS index.html'den KALDIRILIR.

**Spec:** `docs/superpowers/specs/2026-07-02-quiet-luxury-redesign-design.md` — uygulayıcılar önce spec'i okur.

## Global Constraints

- Renk tokenları AYNEN: `--bg: #f4f2ee; --stone: #cfc8bb; --accent: #2e4a5c; --ink: #22211f; --line: #d9d2c5;`
- Altın `#e4a00e` (ve `#c48a0a`, `#f0b830`) yeni dosyalarda ASLA kullanılmaz.
- `border-radius` ve `box-shadow` kullanılmaz (hairline `1px solid var(--line)` kullanılır).
- Kanonik iş bilgileri `AGENTS.md § Kanonik Otel Bilgileri`'nden aynen alınır (telefon `+90 501 091 34 17`, oda adları: "Deluxe Oda Deniz Manzaralı", "Deluxe Oda Kısmi Deniz Manzaralı", "Aile Odası").
- Video dosyaları YENİDEN KODLANMAZ, kalite düşürülmez — yalnızca URL-güvenli ada kopyalanır.
- `css/style.css`, `js/app.js`, `about.html`, `rooms.html`, `reservation.html`, `contact.html` DEĞİŞTİRİLMEZ.
- Mevcut SEO head içeriği (title, meta, OG, schema.org JSON-LD, canonical) korunur; yalnızca görsel referansları yeni dosya adlarına güncellenir.
- Animasyonlar yalnızca `transform`/`opacity`; `prefers-reduced-motion: reduce`'da animasyon ve video yok.
- Her `<img>`/`<video>` elementinde `width`/`height` veya CSS aspect-ratio ile CLS önlenir; alt-fold görseller `loading="lazy"`.

---

### Task 1: Medya hazırlığı (URL-güvenli adlar + hero poster)

**Files:**
- Create: `img/otel-video.mp4` (kopya: `img/otel videosu.mp4`)
- Create: `img/havuz-video.mp4` (kopya: `img/havuz videosu.mp4`)
- Create: `img/hero-poster.jpg` (kopya: `img/otel kusbakısı foto.jpeg`)

**Interfaces:**
- Produces: Task 2 ve 3'ün kullanacağı sabit yollar: `img/otel-video.mp4`, `img/havuz-video.mp4`, `img/hero-poster.jpg`

- [ ] **Step 1: Dosyaları kopyala**

```bash
cd "c:/Users/ahmet/OneDrive/Desktop/otel website"
cp "img/otel videosu.mp4" img/otel-video.mp4
cp "img/havuz videosu.mp4" img/havuz-video.mp4
cp "img/otel kusbakısı foto.jpeg" img/hero-poster.jpg
```

- [ ] **Step 2: Doğrula**

Run: `ls -la --block-size=K img/otel-video.mp4 img/havuz-video.mp4 img/hero-poster.jpg`
Expected: 3 dosya listelenir; otel-video ~6 MB, havuz-video ~3 MB, hero-poster ~1 MB (boyutlar orijinalle birebir aynı — kalite kaybı yok).

- [ ] **Step 3: Commit**

```bash
git add img/otel-video.mp4 img/havuz-video.mp4 img/hero-poster.jpg
git commit -m "feat(media): URL-güvenli video/poster kopyaları (kalite korunarak)"
```

---

### Task 2: `js/quiet.js` — hibrit hero video + reveal animasyonları

**Files:**
- Create: `js/quiet.js`

**Interfaces:**
- Consumes: Task 1'in `img/otel-video.mp4` yolu (HTML'de `data-video-src` ile verilir).
- Produces: Task 3'ün markup'ının bağlanacağı sözleşme:
  - `#heroVideo` — `<video>` elementi, `data-video-src="img/otel-video.mp4"` özniteliği taşır, başlangıçta `src`'siz ve `opacity:0`.
  - `.is-playing` — video oynamaya hazır olunca `#heroVideo`'ya eklenen sınıf (CSS fade-in bunu hedefler).
  - `.reveal` — scroll'da görününce `.is-visible` sınıfı eklenen elementler.

- [ ] **Step 1: Dosyayı yaz**

```javascript
/* ============================================================
   ASSOS KARADUT TAŞ OTEL – Quiet JS (index.html only)
   Hibrit hero video + reveal-on-scroll.
   Tüm seçiciler defensive: element yoksa sessizce no-op.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== Hibrit hero video =====
     Poster foto anında görünür (CSS background / <img>).
     Video sayfa yüklendikten sonra orijinal kalitede yüklenir,
     oynatılabilir olunca .is-playing ile fade-in yapar. */
  var heroVideo = document.getElementById('heroVideo');
  if (heroVideo && !reducedMotion) {
    var src = heroVideo.getAttribute('data-video-src');
    if (src) {
      var start = function () {
        heroVideo.src = src;
        heroVideo.muted = true; // autoplay garantisi
        heroVideo.load();
        heroVideo.addEventListener('canplaythrough', function onReady() {
          heroVideo.removeEventListener('canplaythrough', onReady);
          heroVideo.play().then(function () {
            heroVideo.classList.add('is-playing');
          }).catch(function () { /* autoplay engellendi: poster kalır */ });
        });
      };
      if (document.readyState === 'complete') { start(); }
      else { window.addEventListener('load', start, { once: true }); }
    }
  }

  /* ===== Reveal on scroll ===== */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }
});
```

- [ ] **Step 2: Söz dizimi doğrulaması**

Run: `node --check js/quiet.js`
Expected: çıktı yok, exit 0.

- [ ] **Step 3: Commit**

```bash
git add js/quiet.js
git commit -m "feat(js): hibrit hero video yükleyici + reveal-on-scroll (quiet.js)"
```

---

### Task 3: `css/quiet.css` + `index.html` — sessiz lüks tasarım sistemi ve yeni anasayfa

Tek agent'a verilir (görsel bütünlük için CSS ve HTML birlikte). Agent: karadut-luxury-hotel-designer profili; `frontend-design` skill'i yüklü.

**Files:**
- Create: `css/quiet.css`
- Modify: `index.html` (tam yeniden yazım; head'deki SEO bloğu korunur)

**Interfaces:**
- Consumes: Task 1 yolları (`img/hero-poster.jpg`, `img/otel-video.mp4`, `img/havuz-video.mp4`), Task 2 sözleşmesi (`#heroVideo`, `data-video-src`, `.is-playing`, `.reveal`, `.is-visible`).
- Produces: Faz 2'de diğer sayfaların kullanacağı `quiet.css` sınıf sistemi.

**index.html head kuralları:**
- Mevcut SEO bloğu (satır 1–85: title, meta'lar, OG, Twitter, schema.org JSON-LD) AYNEN korunur; yalnızca `og:image`/`twitter:image`/schema `image` değerleri `https://karaduttasotel.com/img/hero-poster.jpg` yapılır.
- CSS yüklemeleri: Bootstrap CDN korunur; AOS CSS satırı SİLİNİR; `css/style.css` yerine `css/quiet.css` yüklenir.
- Font satırı şu olur:
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
```
- Body sonunda script'ler: Bootstrap bundle CDN + `js/booking-config.js` + `js/app.js` + `js/quiet.js`. AOS JS satırı SİLİNİR.

**`css/quiet.css` temel blok (aynen bu tokenlarla başlar):**

```css
:root {
  --bg:     #f4f2ee;
  --stone:  #cfc8bb;
  --accent: #2e4a5c;
  --ink:    #22211f;
  --line:   #d9d2c5;
  --serif:  "Cormorant Garamond", Georgia, serif;
  --sans:   "Montserrat", sans-serif;
}
```

Devamında: base reset, `h1–h5 { font-family: var(--serif); font-weight: 500; }`,
`.reveal { opacity: 0; transform: translateY(24px); transition: opacity .8s ease, transform .8s ease; }`,
`.reveal.is-visible { opacity: 1; transform: none; }`,
`@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }`.

**Body kurgusu (sırayla, spec §2):**

1. **Nav** (`<nav id="mainNav">` id'si ve `.nav-link` sınıfları KORUNUR — app.js scroll/active davranışı bunlara bağlı; topbar div'i tamamen kaldırılır). Sağ uçta: `<a href="tel:+905010913417" class="nav-phone">+90 501 091 34 17</a>`. Hero üzerinde şeffaf + beyaz metin; `.scrolled` sınıfında `background: var(--bg); color: var(--ink); border-bottom: 1px solid var(--line);`. Mobil menü Bootstrap collapse ile tam genişlik `--bg` panel.
2. **Hero** — tam ekran (`min-height: 100svh`), şu iskelet AYNEN kullanılır:
```html
<section class="q-hero">
  <img class="q-hero-poster" src="img/hero-poster.jpg" alt="" fetchpriority="high">
  <video id="heroVideo" class="q-hero-video" data-video-src="img/otel-video.mp4"
         muted loop playsinline preload="none" aria-hidden="true"></video>
  <div class="q-hero-overlay"></div>
  <div class="q-hero-content">
    <p class="q-eyebrow">ASSOS · ÇANAKKALE</p>
    <h1>Taşın, zeytinin ve denizin sessizliği</h1>
    <a href="rooms.html" class="q-btn-ghost">Odaları Keşfedin</a>
  </div>
</section>
```
CSS: `.q-hero-video { opacity: 0; transition: opacity 1.2s ease; }` `.q-hero-video.is-playing { opacity: 1; }` — poster altta kalır, video üstüne fade-in yapar. Hero başlık `clamp(3rem, 8vw, 6.5rem)`, beyaz, `text-wrap: balance`. Overlay: alttan üste hafif koyu degrade (metin okunurluğu, AA kontrast).
3. **Manifesto** — ortalanmış, `max-width: 640px`, serif `clamp(1.5rem, 3vw, 2.25rem)`, mevcut about metninden damıtılmış 2–3 cümle (taş mimari + Assos doğası + kahvaltı dahil konaklama). Üstünde `q-eyebrow`. `.reveal` uygulanır.
4. **Havuz bandı** — tam genişlik `<video>` (`src="img/havuz-video.mp4"` muted loop playsinline `preload="metadata"` `loading` yok ama `.reveal` var); `prefers-reduced-motion`'da CSS ile gizlenip yerine `img/havuz.webp` `<img>` gösterilir (`<picture>` değil, iki element + media query).
5. **Odalar** — başlık "Odalar" + 3 editoryal zigzag satır (`.q-room-row`, `.q-room-row--reverse`). Her satır: %55 fotoğraf (`img/1..8.jpg` veya mevcut oda görselleri; `aile_odası.webp` aile odası için), %45 metin: kanonik oda adı (serif, büyük), altında hairline ile ayrılmış `m² · kapasite · manzara` satırı, kısa 1 cümle tanım, `rooms.html`'e ince ok linki ("Detaylar →"). Fiyat gösterilmez (fiyat rezervasyon bandında "3.500 TL'den başlayan" olarak bir kez geçer). Hover: foto `transform: scale(1.03)` (overflow hidden), 0.6s ease.
6. **Deneyim** — iki sütun: solda `img/bahce.webp`, sağda başlık + tipografik liste (`.q-list`): "Kahvaltı dahil / Açık yüzme havuzu / A la carte restoran / Ücretsiz otopark / Kadırga Koyu'na 5 km / 7/24 resepsiyon". Liste öğeleri arasında hairline, ikon YOK.
7. **Rezervasyon bandı** — `.q-reserve { background: var(--accent); }`, beyaz metin, ortalanmış: `q-eyebrow` ("REZERVASYON"), dev serif telefon `<a href="tel:+905010913417">+90 501 091 34 17</a>` (`clamp(2rem, 6vw, 4.5rem)`), altında `14:00 giriş · 12:00 çıkış · 3.500 TL'den başlayan · kahvaltı dahil` satırı, en altta ikincil link: `<a href="https://otel-web-app.vercel.app/reservation" data-karadut-booking class="q-btn-ghost">Online Rezervasyon</a>` (data-karadut-booking AYNEN korunur).
8. **Konum + Footer** — konum: tam genişlik `img/otel-kusbakısı.png` üzerinde adres + "Yol Tarifi Al" Google Maps linki (mevcut index'teki Maps URL'si korunur). Footer: `--bg` zemin, üç ince sütun (marka+adres / sayfalar / iletişim), hairline üst çizgi, en altta "© 2026 Assos Karadut Taş Otel · Turizm Lisans No: 24921".

**Erişilebilirlik gereksinimleri:** tek H1 (hero'da), sonra H2'ler; `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }`; tüm anlamlı görsellerde Türkçe alt; dekoratiflerde `alt=""`; back-to-top butonu `#backToTop` id ile korunur (app.js kullanıyor).

- [ ] **Step 1: `css/quiet.css`'i yaz** (yukarıdaki token bloğu + tüm bölüm stilleri)
- [ ] **Step 2: `index.html`'i yeniden yaz** (head kuralları + body kurgusu)
- [ ] **Step 3: Statik doğrulama**

Run: `grep -in "e4a00e\|c48a0a\|f0b830\|aos\|topbar\|style.css" index.html css/quiet.css; grep -c "data-karadut-booking" index.html; grep -c "<h1" index.html`
Expected: ilk grep boş (altın yok, AOS yok, topbar yok, style.css yüklenmiyor); `data-karadut-booking` ≥ 1; `<h1` tam 1.

- [ ] **Step 4: Görsel kontrol**

Run: `start index.html` (veya tarayıcıda aç) — poster anında görünür, video birkaç saniye içinde fade-in yapar, konsol hatası yok, 375px genişlikte yatay scroll yok.

- [ ] **Step 5: Commit**

```bash
git add css/quiet.css index.html
git commit -m "feat(design): Assos Sessizliği anasayfa — sessiz lüks redesign (quiet.css)"
```

---

### Task 4: QA doğrulaması ve düzeltmeler

**Files:**
- Read-only inceleme; bulgulara göre `index.html` / `css/quiet.css` / `js/quiet.js` düzeltmeleri.

**Interfaces:**
- Consumes: Task 1–3 çıktıları ve spec §6 kabul kriterleri (10 madde).

- [ ] **Step 1: QA agent'ı çalıştır** — spec §6'daki 10 kabul kriterini tek tek doğrular; ayrıca: eski sayfaların hâlâ `style.css` yüklediğini, `js/app.js`'in index'te hata üretmediğini (topbar yok → `topbarHeight` 0 olur, sorun değil; stats bar yok → counter no-op), kırık görsel yolu olmadığını kontrol eder.
- [ ] **Step 2: Bulguları önem sırasına göre düzelt** (Blocker/High hemen; Medium/Low raporlanır)
- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "fix(design): QA bulguları — quiet redesign düzeltmeleri"
```
