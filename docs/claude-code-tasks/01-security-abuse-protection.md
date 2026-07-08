# Task 01 — Güvenlik ve Kötüye Kullanım Koruması

## Amaç
Rezervasyon API'si şu an ödemesiz pending kayıtlarla takvimi gerçek anlamda bloke ediyor ve hiçbir bot/abuse koruması yok. Bu task, sistemi otomasyonla takvim kilitleme (inventory-blocking) saldırısına ve brute-force'a karşı kapatır.

## Mevcut durum (doğrulanmış bulgular)
- `src/app/api/reservations/route.ts`: herkese açık POST, rate limit yok, captcha yok.
- `src/lib/utils/validation.ts`:
  - `roomType: z.string().min(1)` — serbest string, enum değil.
  - Gece sayısı üst limiti yok (1 yıllık rezervasyonla oda kilitlenebilir).
  - `adults + children > maxGuests` kontrolü rezervasyon POST'unda yapılmıyor (yalnızca availability'de `minGuests` filtresi var).
- `src/app/api/auth/login/route.ts`: sınırsız deneme, tek admin hesabı.
- `notes` alanı e-posta şablonlarına gidiyor → `src/lib/mail/templates.ts` içinde HTML escape doğrulanmalı.
- `src/app/api/cron/expire-reservations/route.ts`: Bearer secret ile korunuyor (OK, dokunma).

## Dokunulacak dosyalar
- `src/lib/utils/validation.ts`
- `src/app/api/reservations/route.ts`
- `src/app/api/availability/route.ts`
- `src/app/api/auth/login/route.ts`
- YENİ: `src/lib/security/rate-limit.ts`
- YENİ: `src/lib/security/turnstile.ts`
- `src/components/booking/booking-form.tsx` (yalnızca Turnstile widget ekleme — tasarıma dokunma)
- `.env.example`

## Adımlar

### 1. Rate limiting altyapısı
`@upstash/ratelimit` + `@upstash/redis` kur. `src/lib/security/rate-limit.ts` içinde üç ayrı limiter export et:
- `reservationLimiter`: IP başına 3 istek / 10 dakika, günlük 10.
- `availabilityLimiter`: IP başına 30 istek / dakika.
- `loginLimiter`: IP başına 5 istek / 15 dakika + e-posta başına 10 / saat.

IP'yi `x-forwarded-for`'un İLK elemanından al (Vercel arkasında). Upstash env yoksa (lokal dev) limiter no-op'a düşsün ve `console.warn` bassın — dev'i kırma. 429 yanıtları Türkçe kullanıcı mesajı içersin: `"Çok fazla deneme yaptınız. Lütfen birkaç dakika sonra tekrar deneyin."`

### 2. Cloudflare Turnstile
- `src/lib/security/turnstile.ts`: `verifyTurnstileToken(token, ip)` — `https://challenges.cloudflare.com/turnstile/v0/siteverify` POST'u.
- `booking-form.tsx`'e invisible/managed widget ekle (`@marsidev/react-turnstile`), token'ı submit payload'ına `turnstileToken` olarak koy.
- `reservations/route.ts` POST başında doğrula; `TURNSTILE_SECRET_KEY` env yoksa dev ortamında bypass et (warn ile).
- İletişim formu backend'i (Task 03) da bu helper'ı kullanacak — helper'ı generic yaz.

### 3. Validasyon sıkılaştırma (`validation.ts`)
```ts
roomType: z.enum(["deluxe_sea_view", "traditional_room", "premium_family"])
```
(değerleri `ROOM_TYPE_MAP`'ten türet, hard-code etme). Ek kurallar:
- Gece sayısı: max 21 (`checkOut - checkIn <= 21 gün`), refine ile.
- Check-in bugünden en fazla 365 gün sonrası olabilir.
- `firstName`/`lastName`: `.trim()`, yalnız harf/boşluk/tire regex'i (Türkçe karakter dahil), max 60.
- `phone`: normalize et (boşluk/tire sil), `+?[0-9]{10,15}` regex.
- `notes`: `.trim().max(500)`, kontrol karakterlerini strip et.
- Rezervasyon şemasına `superRefine` ekle: `adults + children <= ROOM_TYPE_MAP[roomType].maxGuests`, aşarsa Türkçe hata: `"Seçilen oda tipi en fazla X misafir kabul eder."`

### 4. Login brute-force
`login/route.ts`'e `loginLimiter` uygula. Başarısız denemede sabit süreli yanıt için `bcrypt.compare`'i her durumda çalıştır (timing side-channel: e-posta eşleşmese bile dummy hash ile compare et — `verifyCredentials` içinde).

### 5. E-posta template injection kontrolü
`src/lib/mail/templates.ts`'i incele. Kullanıcı girdisi (`firstName`, `notes` vb.) HTML gövdesine ham giriyorsa `escapeHtml()` helper'ı yaz ve tüm interpolasyonlara uygula.

### 6. Env ve dokümantasyon
`.env.example`'a ekle: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`. README'ye kısa kurulum notu.

## Yapma (scope dışı)
- Booking form'un görsel tasarımını değiştirme (Task 02'nin işi).
- Sheets katmanına dokunma.
- Admin paneline yeni özellik ekleme.

## Kabul kriterleri
- Aynı IP'den 4. rezervasyon denemesi 10 dk içinde 429 + Türkçe mesaj döner.
- `roomType: "hacked"` gönderen istek 400 döner.
- 30 gecelik rezervasyon isteği 400 döner (`"En fazla 21 gecelik rezervasyon yapılabilir."`).
- Deluxe (max 2) için 3 yetişkinli POST 400 döner.
- Turnstile token'sız POST (prod modda) 403 döner.
- `npm run build` env'siz ortamda güvenlik modülleri yüzünden patlamaz.
