# Mimari Analiz Raporu — 2026-04-17

**Üretici:** `/arch-agent`
**Kapsam:** `src/lib/sheets/`, `src/lib/mail/`, `src/lib/auth/`, `src/app/api/`, `src/components/booking/`, `src/proxy.ts`

---

### ✅ Çözüldü / Geri Çekildi

#### K4 (FALSE POSITIVE) — `proxy.ts` middleware olarak çalışmıyor
- **Durum:** Geri çekildi. Next.js 16'da `middleware` deprecated, adı `proxy` oldu. `src/proxy.ts` doğru dosya adı; rename yapılmamalı.
- **Referans:** `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`, `AGENTS.md`.
- **Önlem:** `arch-agent` checklist'ine false-positive notu ve SKILL.md'ye "önce AGENTS.md oku" zorunluluğu eklendi.

#### K5 — Hardcoded session secret fallback
- **Durum:** Çözüldü. `SESSION_SECRET` env yoksa `src/lib/auth/session.ts` ve `src/proxy.ts` startup'ta throw ediyor.

---

### 🔴 Kritik — Hemen Düzeltilmeli

#### K1. Double-booking race condition (sheet yazma atomik değil)
- **Dosya:** [src/app/api/reservations/route.ts:49-89](src/app/api/reservations/route.ts#L49-L89) & [src/lib/sheets/reservations.ts:31-161](src/lib/sheets/reservations.ts#L31-L161)
- **Sorun:** `writePendingReservation()` uygunluk kontrolü yapar (sat. 54-90), ancak hücre değer yazımı (sat. 116-121) ve formatlama (sat. 153-156) ayrı `batchUpdate` çağrılarıdır. İki istek arasında araya girilebilir.
- **Risk:** Aynı oda iki müşteriye satılabilir. Kapora kaybı, otel overbooking.
- **Yön:** Tek `batchUpdate` ile değer + format yazma; veya helper "lock" sheet ile mutex (write lock → re-check availability → write → release lock).

#### K2. Multi-month reservation kısmi yazma
- **Dosya:** [src/lib/sheets/reservations.ts:98-158](src/lib/sheets/reservations.ts#L98-L158)
- **Sorun:** Aylar arası rezervasyonlarda her ay ayrı `batchUpdate` çağrısı yapılıyor. İkinci ay başarısız olursa ilk ay yazılı kalır.
- **Risk:** Multi-month rezervasyonlarda data tutarsızlığı; eksik ay görünmez.
- **Yön:** Tüm ayların tüm hücrelerini tek `batchUpdate` requests array'i olarak gönder.

#### K3. Monthly sheet ↔ Web_Reservations log desync
- **Dosya:** [src/app/api/reservations/route.ts:49-89](src/app/api/reservations/route.ts#L49-L89)
- **Sorun:** Monthly sheet yazımı başarılı, log yazımı başarısız olursa: aylık tablo dolu ama log boş. Admin paneli log'dan okur, rezervasyonu görmez.
- **Risk:** Admin var olan rezervasyonu göremez, kapora gelse de onaylayamaz.
- **Yön:** İki yazımı try/rollback bloğunda birleştir veya tek `batchUpdate`'te birleştir.

#### K4. `proxy.ts` middleware olarak çalışmıyor
- **Dosya:** [src/proxy.ts:1-68](src/proxy.ts#L1-L68)
- **Sorun:** Next.js middleware için dosya adı `src/middleware.ts` olmalı. `proxy.ts` çağrılmıyor. Auth koruması her route handler'da manuel `isAuthenticated()` çağrısına bağlı.
- **Risk:** Bir route'ta unutursan, korumasız erişim.
- **Yön:** `src/proxy.ts` → `src/middleware.ts` rename. Next.js otomatik olarak `/admin` ve `/api/admin` yollarını korur.

#### K5. Hardcoded session secret fallback
- **Dosya:** [src/lib/auth/session.ts:11](src/lib/auth/session.ts#L11)
- **Sorun:** `SESSION_SECRET` env yoksa hardcoded default kullanılıyor (`"complex_password_at_least_32_characters_long_1234"`).
- **Risk:** Production'da default kullanılırsa public bir anahtarla session decrypt edilebilir. Admin hijack.
- **Yön:** `SESSION_SECRET` mandatory yap, yoksa startup'ta `throw`.

---

### 🟡 Önemli — Bir Sonraki Commit Öncesi

#### O1. Guest count vs room capacity validasyonu eksik
- **Dosya:** [src/app/api/reservations/route.ts:11-45](src/app/api/reservations/route.ts#L11-L45)
- **Sorun:** `adults + children > maxGuests` kontrolü yok. 4 kişilik odaya 5 kişi rezerve edilebilir.
- **Yön:** POST handler'da room type seçildikten sonra `totalGuests > config.maxGuests` ekle.

#### O2. Month boundary fragile: parser sheet'teki gün sayısına bağımlı
- **Dosya:** [src/lib/sheets/parser.ts:79-82](src/lib/sheets/parser.ts#L79-L82) & [src/lib/utils/dates.ts:15-25](src/lib/utils/dates.ts#L15-L25)
- **Sorun:** Sheet'te 31. gün boş bırakılırsa o gün availability check'ten kaçar.
- **Yön:** Date column'ları sayı (1-31) yerine ISO date ile eşle, edge case için test yaz.

#### O3. Mail service production'da silent fail edebilir
- **Dosya:** [src/lib/mail/index.ts:10-20](src/lib/mail/index.ts#L10-L20)
- **Sorun:** RESEND_API_KEY/SMTP_USER yoksa console.log mock kullanılıyor — production'da fark edilmez.
- **Yön:** `NODE_ENV === "production"` ise mail config mandatory yap, yoksa throw.

#### O4. Mail fail edince retry yok
- **Dosya:** [src/app/api/reservations/route.ts:92-108](src/app/api/reservations/route.ts#L92-L108)
- **Sorun:** Mail hatası catch'leniyor ve sessizce log'lanıyor. Müşteri kapora bilgisi almaz.
- **Yön:** 3x exponential backoff retry; veya background job queue; fallback olarak admin'e bildirim.

#### O5. Same-day check-in saat kontrolü yok
- **Dosya:** [src/app/api/availability/route.ts:1-50](src/app/api/availability/route.ts#L1-L50)
- **Sorun:** Sadece tarih karşılaştırılıyor. Müşteri 15:00'te 14:00 check-in için booking yapabilir.
- **Yön:** Bugün için minimum saat kontrolü ekle (örn. check-in saatinden N saat önce).

---

### 🔵 Öneri — Teknik Borç

#### B1. Availability/reservation arası kod tekrarı
- **Dosya:** [src/lib/sheets/reservations.ts:31-161](src/lib/sheets/reservations.ts#L31-L161) & [src/lib/sheets/availability.ts:37-118](src/lib/sheets/availability.ts#L37-L118)
- **Yön:** `findAvailableRoom(checkIn, checkOut, roomType)` shared helper'a çıkar.

#### B2. `getRoomTypeBySheetLabel()` fuzzy match
- **Dosya:** [src/lib/config/room-types.ts:29-36](src/lib/config/room-types.ts#L29-L36)
- **Yön:** Exact match veya regex; sheet label'ları unique tut.

#### B3. Error logging zayıf
- **Dosya:** [src/app/api/reservations/route.ts:46-54](src/app/api/reservations/route.ts#L46-L54)
- **Yön:** Pino/Winston ekle; stacktrace dev'de açık, production'da sanitized.

#### B4. Single admin hard-coded
- **Dosya:** [src/lib/auth/session.ts](src/lib/auth/session.ts) & [src/app/api/auth/login/route.ts](src/app/api/auth/login/route.ts)
- **Yön:** Multi-admin için future-proofing planla; şimdi yorum bırak.

#### B5. `colToLetter` 26+ sütun için test edilmemiş
- **Dosya:** [src/lib/sheets/reservations.ts:291-299](src/lib/sheets/reservations.ts#L291-L299)
- **Yön:** Test ekle veya googleapis'in kendi notation utility'sini kullan.

---

## Özet

| Seviye | Sayı |
|--------|------|
| 🔴 Kritik | 5 |
| 🟡 Önemli | 5 |
| 🔵 Öneri | 5 |

**Önerilen sıra:**
1. K4 (middleware rename) — 5 dakikalık fix, tüm auth güvenliğini değiştirir
2. K5 (session secret mandatory) — 2 satır
3. K1 + K2 + K3 (race + multi-month + log desync) — birlikte çözülebilir, tek atomik batchUpdate refactor
4. O serisi
5. B serisi
