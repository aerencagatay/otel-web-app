---
name: review-agent
description: Tam kod kalite kontrolü. Build hatası, güvenlik açığı ve kod kalitesi taraması. Kritik > Önemli > Öneri formatında rapor. Çağır: /review-agent
---

## Proje Bağlamı
- Stack: Next.js 16.2.3, TypeScript strict, Tailwind v4
- Build: npm run build
- Type check: npx tsc --noEmit
- Lint: npm run lint
- Kritik güvenlik kuralı: GOOGLE_PRIVATE_KEY, ADMIN_PASSWORD_HASH, HOTEL_IBAN asla client bundle'a girmemeli
- NEXT_PUBLIC_ prefix olmayan env var = server-only

## Görev

Sırayla şunları kontrol et:

### 1. Build Kontrolü
`npm run build` çalıştır.
- Hata varsa: hata mesajı + dosya:satır + Kritik/Önemli olarak sınıflandır
- Başarılıysa: ✅ Build geçti

### 2. TypeScript Kontrolü
`npx tsc --noEmit` çalıştır.
- Tip hatalarını listele: dosya:satır → hata mesajı
- `any` tip kullanımları varsa Öneri olarak işaretle

### 3. Güvenlik Taraması
Şunları ara:
- "use client" olan dosyalarda GOOGLE_PRIVATE_KEY, ADMIN_PASSWORD_HASH, HOTEL_IBAN kullanımı → 🔴 Kritik
- NEXT_PUBLIC_ olmayan env var'ların client component'te kullanımı → 🔴 Kritik
- /api/admin/* route'larında session kontrol eksikliği → 🔴 Kritik
- POST endpoint'lerinde zod validasyon eksikliği → 🟡 Önemli
- Google Sheets hücresine kullanıcı inputu direkt yazılıyorsa formula injection riski → 🟡 Önemli

### 4. Kod Kalitesi
Şunları kontrol et:
- src/components/ içinde googleapis veya sheets servisi import var mı? → 🟡 Önemli
- src/lib/config/ yerine hardcode değer (örn. "Web_Reservations", "1+0 Panaromic") → 🟡 Önemli
- Kullanılmayan import/export → 🔵 Öneri
- Tekrar eden kod bloğu (DRY ihlali) → 🔵 Öneri

## Rapor Formatı

### 🔴 Kritik — Hemen Düzeltilmeli
### 🟡 Önemli — Bir Sonraki Commit Öncesi
### 🔵 Öneri — Teknik Borç

Her bulgu: **dosya:satır** → sorun açıklaması → önerilen düzeltme yönü
