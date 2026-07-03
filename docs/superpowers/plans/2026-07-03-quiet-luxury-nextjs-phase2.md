# "Assos Sessizliği" v2 — Faz 2 Implementation Plan (iç sayfalar + booking UI)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Faz 1'de anasayfaya uygulanan sessiz lüks dilini iç sayfalara (/rooms, /about, /contact, /reservation, /booking-success) ve booking akışı UI'sına yaymak; iç sayfalardaki 7–8 MB'lık JPG'leri optimize kopyalarla değiştirmek.

**Architecture:** `globals.css` TEK SAHİPLİ (Task A). Sayfa/component agent'ları (B, C, D) globals.css'e DOKUNMAZ; mevcut sınıfları kullanır, yeni görsel ihtiyaçlarını Tailwind utility'leriyle inline çözer (yeni özel sınıf UYDURMAZ). Dosya kesişimi yok → tam paralel.

**Spec:** `docs/superpowers/specs/2026-07-02-quiet-luxury-nextjs-design.md` (§2 tasarım dili, "İÇERİK DOKUNULMAZDIR" bölümü Faz 2'de de geçerli)

## Global Constraints

- **İÇERİK DOKUNULMAZDIR:** metinler, başlıklar, fiyat/istatistik değerleri, oda adları ("Deluxe Tam Deniz Manzaralı", "Traditional Kısmi Deniz Manzaralı", "Aile Suit Deniz Manzaralı"), SSS metinleri, form etiketleri, yorumlar, görsel İÇERİĞİ — hiçbiri değiştirilmez/yeniden yazılmaz. Tek istisna: aşağıdaki optimize JPG kopya YOL değişimleri (görünen içerik aynı).
- **Booking/istek mantığına dokunulmaz:** state, handler, fetch/router, zod, form validasyonu — yalnızca className/görsel katman değişir. `src/lib/`, `src/app/api/`, `src/app/admin/` tamamen yasak.
- Bu repodaki Next.js eğitim verinizdeki Next.js DEĞİL — kod öncesi `node_modules/next/dist/docs/` ilgili kılavuza bakın.
- Tasarım dili: hairline (1px var(--color-border)) ayrım, bol boşluk, radius/gölge sadeleşir, tek vurgu Ege mavisi (mevcut token'lar), yeni animasyon yalnızca transform/opacity + prefers-reduced-motion.
- Videolar yeniden kodlanmaz. Legacy kök HTML'lere dokunulmaz. Agent'lar git commit YAPMAZ.
- Token anlamsal yeniden adlandırma (gold→accent) bu fazda YAPILMAZ (ertelendi — görsel değeri yok, churn riski var).

## Optimize görsel sözleşmesi (Task 0 üretir, B/C kullanır)

Orkestratör şu web kopyalarını üretir (1920w, q82; orijinaller silinmez):
`/img/hotel-web.jpg`, `/img/hotel-2-web.jpg`, `/img/balkon-web.jpg`, `/img/chairperson-web.jpg`, `/img/dis-cephe-web.jpg` (+ mevcut `/img/hero-poster.jpg`).
Sayfa agent'ları, sayfalarında bu BÜYÜK JPG'lere verilen referansları optimize kopyayla değiştirir (başka görsel kaynağına dokunulmaz; Jollytur URL'leri AYNEN kalır).

---

### Task 0 (orkestratör, inline): Optimize JPG kopyaları — üret ve commit'le

- [ ] PowerShell System.Drawing ile 5 kopyayı üret, boyutları raporla, commit.

### Task A (designer agent): globals.css iç sayfa sınıfları + page-hero.tsx

**Files:** Modify `src/app/globals.css`, `src/components/layout/page-hero.tsx` (yalnız görsel), ayrıca `src/components/layout/sticky-booking-cta.tsx` ve `back-to-top.tsx` görsel rötuşu (Faz 1'de stillenmedi ise).
- [ ] page-hero, res-hero, room-list-card, amenity-tag, booking-card, booking-progress, premium-trip-card, room-select-card, contact-info-card, faq/accordion, form input/focus sınıflarını sessiz lüks diline getir (radius/gölge sadeleşir, hairline, boşluk artar). Yapıyı bozmadan stil rafinesi — booking sınıflarında düzen bozulmaz.
- [ ] page-hero.tsx görsel prop'ları/overlay'i sadeleştir; içerik (başlık/breadcrumb metni) aynen.

### Task B (page agent 1): /rooms + /about sayfaları

**Files:** Modify `src/app/(public)/rooms/page.tsx`, `src/app/(public)/about/page.tsx` — YALNIZCA className/yapısal görsel düzen + optimize görsel yol değişimi. globals.css'e dokunma; yeni özel sınıf uydurma (Tailwind utility kullan).

### Task C (page agent 2): /contact + /reservation + contact-form

**Files:** Modify `src/app/(public)/contact/page.tsx`, `src/app/(public)/reservation/page.tsx`, `src/components/contact-form.tsx` — aynı kurallar; form davranışı/validasyon değişmez.

### Task D (booking UI agent): booking component'leri

**Files:** Modify `src/components/booking/booking-flow.tsx`, `availability-search.tsx`, `room-card.tsx`, `booking-form.tsx`, `booking-summary.tsx`, `booking-success-view.tsx` — YALNIZCA className/görsel; state/handler/API çağrıları/props sözleşmeleri AYNEN. Şüphede kalırsan görseli değiştirme, raporla.

### Task E (orkestratör): Build + smoke + booking akışı doğrulaması + commit'ler

- [ ] Her agent bitişinde içerik-diff denetimi (metin değişikliği taraması) + commit
- [ ] `npm run build` temiz; `npm run start` ile /, /rooms, /about, /contact, /reservation, /booking-success 200 + içerik örneklem kontrolü
- [ ] Booking akışı görsel smoke: /reservation'da arama formu render oluyor, adım göstergesi görünüyor (kod düzeyi + curl)
- [ ] Kullanıcıya görsel inceleme raporu
