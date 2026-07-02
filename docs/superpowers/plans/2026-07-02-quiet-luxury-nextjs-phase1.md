# "Assos Sessizliği" v2 — Next.js Faz 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Canlı Next.js sitesinin anasayfası + paylaşılan layout'u sessiz lüks tasarıma geçirmek; global tema tokenlarını deniz & taş paletine çevirmek. Rezervasyon/API/mail katmanına dokunulmaz.

**Architecture:** Tüm stiller `src/app/globals.css`'te (Tailwind 4 `@theme` + özel sınıflar) — bu dosyanın TEK SAHİBİ tasarım agent'ıdır (Task 3). Layout JSX değişiklikleri (Task 2) ayrı agent'ta, `globals.css`'e DOKUNMAZ; yeni sınıf ihtiyaçları aşağıdaki kilitli sözleşmeyle Task 3'e bildirilmiştir. Paralel çalışmada dosya kesişimi yoktur.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind 4 (`@theme inline`, config dosyasız), next/font (Cormorant Garamond + DM Sans), lucide-react.

**Spec:** `docs/superpowers/specs/2026-07-02-quiet-luxury-nextjs-design.md`

## Global Constraints

- **Bu repodaki Next.js eğitim verinizdeki Next.js DEĞİL** — kod yazmadan önce `node_modules/next/dist/docs/` altındaki ilgili kılavuzu okuyun (AGENTS.md kuralı).
- Yeni token değerleri AYNEN spec §1'deki blok (aşağıda Task 3'te kopyalı). Token ADLARI değişmez.
- Mat altın (#a38b5f, #7d6a48, #c4b08a) hiçbir dosyada kalmaz.
- Videolar yeniden kodlanmaz. `public/img/hero-poster.jpg` (344 KB, 1920w) hazır — poster olarak bu kullanılır; `hero.JPG` silinmez.
- Component dosyaları yeniden adlandırılmaz/taşınmaz; booking/, admin/, api/, iç sayfa dosyaları DEĞİŞTİRİLMEZ (renkleri token değişiminden otomatik alırlar).
- Kanonik iş bilgileri AGENTS.md § Kanonik Otel Bilgileri (telefon +90 501 091 34 17, 3 kanonik oda adı, lisans 24921).
- Yeni animasyonlar yalnızca transform/opacity; `prefers-reduced-motion` desteklenir.
- Legacy kök HTML/CSS/JS dosyalarına DOKUNULMAZ.
- Agent'lar git commit YAPMAZ — commit'leri orkestratör atar.

## Kilitli sınıf sözleşmesi (Task 2 ↔ Task 3)

- Task 2 JSX'te YALNIZCA mevcut sınıf adlarını ve şu yeni sınıfları kullanabilir: `nav-phone` (navbar sağındaki tel: linki), `footer-license` (footer alt satırı).
- Task 3 bu iki sınıfı ve mevcut layout sınıflarını (navbar, footer, back-to-top, sticky-book-cta) yeni dile göre `globals.css`'te stiller.
- Navbar davranış sözleşmesi: mevcut scroll-state mekanizması korunur; şeffaf durumda beyaz metin, scrolled durumda `--color-ivory` zemin + 1px `--color-border` alt çizgi.

---

### Task 1: Hero poster üretimi — TAMAMLANDI (orkestratör, inline)

- [x] `public/img/hero-poster.jpg` üretildi: 1920×1280, 344 KB, HighQualityBicubic (System.Drawing). Orijinal `hero.JPG` yerinde.

---

### Task 2: Layout JSX — topbar kaldırma, navbar telefonu, footer düzeni

**Files:**
- Modify: `src/app/(public)/layout.tsx` (Topbar import + `<Topbar />` kaldır; başka değişiklik yok)
- Modify: `src/components/layout/navbar.tsx` (sağ tarafa `tel:` linki `nav-phone` sınıfıyla; mevcut scroll/menü davranışı korunur)
- Modify: `src/components/layout/footer.tsx` (üç sade sütun; sosyal linkler metinleşir/küçülür; en alta `footer-license` satırı: "© 2026 Assos Karadut Taş Otel · Turizm Lisans No: 24921")
- DO NOT TOUCH: `src/app/globals.css`, `src/components/layout/topbar.tsx` (dosya silinmez, sadece kullanımdan çıkar), home/, booking/

**Interfaces:**
- Produces: `nav-phone` ve `footer-license` sınıflarını taşıyan markup (stilleri Task 3 yazar).
- Consumes: kilitli sınıf sözleşmesi (yukarıda).

- [ ] **Step 1:** `node_modules/next/dist/docs/` içinden App Router/component kılavuzuna göz at (breaking changes)
- [ ] **Step 2:** Üç dosyayı yukarıdaki kurallara göre düzenle
- [ ] **Step 3:** Doğrula: `grep -n "Topbar" "src/app/(public)/layout.tsx"` → boş; `grep -c "nav-phone" src/components/layout/navbar.tsx` → ≥1; `grep -c "footer-license" src/components/layout/footer.tsx` → 1; `grep -rn "24921" src/components/layout/footer.tsx` → 1 satır
- [ ] **Step 4:** Raporla (commit YOK)

---

### Task 3: Tasarım sistemi — globals.css + anasayfa component'leri

**Files:**
- Modify: `src/app/globals.css` (tek sahip)
- Modify: `src/components/home/hero-home.tsx`, `stats-bar.tsx`, `about-snippet.tsx`, `featured-rooms.tsx`, `amenities-grid.tsx`, `cta-banner.tsx`, `location-section.tsx`, `gallery-strip.tsx`, `ambient-sound.tsx` (yalnızca görsel/kopya; davranış korunur)
- Modify: `src/components/home/hero-booking-strip.tsx` (yalnızca stil sınıfları; form davranışı korunur)
- DO NOT TOUCH: layout/*.tsx (Task 2'nin), booking/, admin/, sayfa dosyaları

**Interfaces:**
- Consumes: `public/img/hero-poster.jpg` (Task 1), kilitli sınıf sözleşmesi.
- Produces: `.nav-phone`, `.footer-license` stilleri + layout sınıflarının (navbar/footer/back-to-top/sticky-book-cta) yeni dile uyarlanmış halleri.

- [ ] **Step 1:** `node_modules/next/dist/docs/` ilgili kılavuza göz at; spec §2–§5'i oku
- [ ] **Step 2:** `@theme` token değerlerini AYNEN şu blokla değiştir:

```css
--color-gold: #2e4a5c;
--color-gold-dark: #223a49;
--color-gold-light: #4a6b80;
--color-olive: #3a4440;
--color-stone: #cfc8bb;
--color-ivory: #f4f2ee;
--color-dark: #22211f;
--color-dark-2: #2b2a27;
--color-text: #4a4842;
--color-text-light: #7a776d;
--color-warm: #efece6;
--color-border: #d9d2c5;
```

- [ ] **Step 3:** Anasayfa component'lerini spec §3 tablosuna göre yeniden tasarla (hero kopyası sadeleşir: eyebrow + tek satır serif + tek hayalet CTA + booking strip hairline stile; stats-bar ince tipografik şerit; about manifesto; featured-rooms editoryal zigzag + kanonik adlar; amenities tipografik liste; cta-banner düz `--color-gold` (yeni mavi) zeminli dev serif tel bandı + /reservation hayalet CTA; location sadeleşir; gallery çerçeveler sadeleşir). Hero `<video poster="/img/hero-poster.jpg">` yapılır.
- [ ] **Step 4:** globals.css'te altın kalıntısı taraması: `grep -in "a38b5f\|7d6a48\|c4b08a\|gradient" src/app/globals.css` → altın hex'leri boş; degrade yalnızca hero overlay'de kalabilir
- [ ] **Step 5:** Raporla (commit YOK)

---

### Task 4: Build + QA + düzeltmeler (orkestratör + QA agent)

- [ ] **Step 1:** `npm run build` → hatasız
- [ ] **Step 2:** `npm run dev` ile anasayfa smoke test (curl + tarayıcı)
- [ ] **Step 3:** QA agent: spec §7'deki 8 kabul kriteri + booking akışı görsel regresyon kontrolü (kod düzeyinde)
- [ ] **Step 4:** Blocker/High bulguları düzelt, commit
