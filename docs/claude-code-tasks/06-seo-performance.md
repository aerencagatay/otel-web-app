# Task 06 — SEO ve Performans: JSON-LD, OG Image, Görsel/Medya Diyeti, Analytics

## Amaç
Google'da zengin sonuç (yıldız, fiyat, olanaklar) çıkabilen, hızlı yüklenen, ölçümlenebilir bir site.

## Mevcut durum (doğrulanmış bulgular)
- JSON-LD / schema.org: repo'da SIFIR kullanım.
- `og:image` olarak ham `/img/hero.JPG` (7.6 MB!) veriliyor — sosyal önizlemeler güvenilmez.
- Ham asset'ler devasa: `hotel.JPG` 8.1MB, `balkon.JPG` 8.0MB, `hero.JPG` 7.6MB, `otel-video.mp4` 5.2MB, `ambient.mp3` 2.3MB. `-web` türevleri var ama ham dosyalar da `public/`te servis edilebilir durumda.
- Canonical tag'ler yok; `meta keywords` var (zararsız ama gereksiz).
- Analytics / hata izleme yok.
- Ana sayfada `ambient.mp3` + 2 video ilk yükte medya ağırlığı yaratıyor.

## Dokunulacak dosyalar
- YENİ: `src/components/seo/json-ld.tsx`
- `src/app/layout.tsx` (metadata: og image, canonical; JSON-LD mount)
- `src/app/(public)/rooms/page.tsx`, `contact/page.tsx` (sayfa özel şemalar)
- YENİ: `scripts/optimize-images.mjs` (Task 03 ile ortak — 03 yazdıysa yeniden kullan, koordine ol)
- `public/img/**` (üretilen türevler), YENİ `public/og.jpg`
- `src/components/home/hero-home.tsx`, `ambient-sound.tsx` (yükleme stratejisi)
- `src/app/sitemap.ts`, `src/app/robots.ts` (kontrol/rötuş)
- YENİ: analytics bileşeni

## Adımlar

### 1. Yapılandırılmış veri (JSON-LD)
`json-ld.tsx`: `<script type="application/ld+json">` render eden, tip güvenli (schema-dts kur: `npm i -D schema-dts`) bileşen. Şemalar:
- **Tüm sayfalar (layout):** `Hotel` — name, url, telephone (+90 501 091 34 17), email, address (`Büyükhusun Köyü Namazgah Mevkii No:26, Ayvacık, Çanakkale 17860`, `addressCountry: TR`), geo (koordinatı Google Maps'ten al, `hotel.ts` config'ine sabitle), image, `amenityFeature` (havuz, restoran, ücretsiz otopark, Wi-Fi...), `checkinTime`/`checkoutTime` (otel sahibinden — placeholder işaretle), `priceRange: "₺₺"`.
- `AggregateRating`: Task 03'ün `reviews.ts` config'i doluysa ekle, boşsa EKLEME (sahte rating cezalandırılır).
- **/rooms:** her oda için `HotelRoom` + `Offer` (`priceCurrency: TRY`, `price` = `getLowestUpcomingPrice`, `availability: InStock`).
- **/contact:** `ContactPage` + `LocalBusiness` referansı.
- Doğrulama: Google Rich Results Test ile manuel kontrol notu README'ye.

### 2. OG image ve metadata
- 1200×630, ≤200KB `public/og.jpg` üret (hero karesinden crop + hafif koyu overlay + logo; sharp ile script'te üret).
- `layout.tsx`: `openGraph.images` → `/og.jpg`; `alternates.canonical` her sayfada (template ile); `keywords` meta'sını kaldır.
- `twitter:image` aynı dosya.

### 3. Görsel/medya diyeti
- `scripts/optimize-images.mjs` (sharp): `public/img`'deki tüm JPG/PNG kaynakları için 2560px + WebP q80 türev üretir; script idempotent olsun.
- Ham 5-8MB dosyaları `public/`ten çıkar (`assets-raw/` klasörüne taşı ve `.vercelignore`/deploy dışı bırak); koddaki referansları optimize türevlere çevir. `hero.JPG` referansları dahil — `next/image` kullanan yerler kalitesini korur.
- Videolar: `preload="none"` + `poster` (her videodan ffmpeg ile ilk saniye karesi üret: `hero-poster.jpg` var, `oda-video` ve `havuz-video` için de üret). H.264 CRF 28 ile yeniden encode edip boyutları ~%40 düşür (kalite gözle kontrol).
- `ambient-sound.tsx`: sesi ASLA autoplay etme; kullanıcı butonla açana kadar `ambient.mp3` indirilmesin (`new Audio()` lazımsa tıklamada oluştur). Buton durumu erişilebilir (`aria-pressed`).
- `hero-home.tsx`: hero videosu `poster` ile açılır, `IntersectionObserver`/`requestIdleCallback` sonrası oynar; LCP elementi poster görseli olur (`priority` işaretli `next/image` veya `fetchpriority=high`).

### 4. Analytics + hata izleme
- Plausible (script tag, cookie'siz — çerez bandıyla uyumlu, tercihe gerek yok) VEYA GA4 (o zaman Task 03'ün çerez tercihini oku, onaysız yükleme yok). Varsayılan: Plausible.
- Hedef event'ler: `availability_search`, `room_selected`, `reservation_submitted`, `reservation_failed`, `contact_submitted`, `whatsapp_click`. Booking flow'a event çağrıları ekle (i18n'den bağımsız, key bazlı).
- Sentry (`@sentry/nextjs`) minimal kurulum: yalnızca server hataları + `reservations/route.ts` gibi kritik path'ler; DSN env'den, yoksa devre dışı.

### 5. Küçük rötuşlar
- `robots.ts`: `/admin` ve `/api`'yi disallow et.
- Sitemap: Task 03/05'in eklediği sayfalar dahil mi kontrol et; `lastModified: new Date()` yerine anlamlı sabit tarihler.
- Tüm `next/image` kullanımlarında anlamlı `alt` metinleri (Türkçe) — boş alt taraması yap.

## Yapma (scope dışı)
- Blog/içerik sayfaları (sonraki faz; iskelet kurma).
- i18n metadata (Task 04 halleder; JSON-LD bileşenine `locale` prop desteği bırak).

## Kabul kriterleri
- Rich Results Test: ana sayfa `Hotel`, /rooms `HotelRoom+Offer` hatasız.
- Sosyal debugger'da (opengraph.xyz vb.) önizleme <1sn'de ≤200KB görselle gelir.
- `public/` altında 1MB'tan büyük görsel dosya kalmaz; videolar poster'lı ve `preload="none"`.
- Ses hiçbir koşulda kullanıcı etkileşimi olmadan çalmaz/indirilmez.
- Ana sayfa Lighthouse (mobil): Performance ≥ 85, LCP ≤ 2.5s, CLS < 0.1.
- Rezervasyon tamamlandığında analytics event'i düşer.
