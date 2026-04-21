## Mimari İnceleme Odak Noktaları

### ⚠️ Bilinen False Positive'ler — RAPOR ETME

- **`src/proxy.ts` middleware olarak çalışıyor.** Next.js 16'da `middleware` deprecated, adı `proxy` oldu. `src/proxy.ts` doğru dosya adı. Eski `middleware.ts` aramaya gerek yok. Detay: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`. Bir incelemeye başlamadan önce her zaman `AGENTS.md`'yi oku — bu projede Next.js 16 breaking changes var.

### Race Condition
- createReservation() içinde server-side double availability check var mı?
- Sheet yazma operasyonu atomik mi yoksa iki ayrı API çağrısı mı?
- Aynı anda iki istek gelirse hangisi kazanır? Mutex/lock benzeri yapı var mı?

### Google Sheets Güvenliği
- Service account credentials client bundle'a sızıyor mu? (GOOGLE_PRIVATE_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL)
- Tüm googleapis çağrıları server-side Route Handler veya Server Action mı?
- "use client" olan dosyalarda sheets import var mı?
- API rate limit senaryosu (HTTP 429) handle edilmiş mi?

### Admin Auth
- /admin/* ve /api/admin/* route'ları session kontrolü yapıyor mu?
- Session expiry süresi tanımlanmış mı?
- ADMIN_PASSWORD_HASH env var'da mı, hardcode mu?

### Mail Servisi
- Mail gönderimi sheet yazımından bağımsız mı? (mail fail → rezervasyon yine de kayıtlı kalmalı)
- MailService interface (sendPendingDepositEmail, sendConfirmedEmail) tam implement edilmiş mi?

### Tarih / Timezone
- Tüm Date işlemleri UTC'de mi?
- checkIn dahil, checkOut hariç gece mantığı tutarlı mı?
- Ay geçişi edge case'i (örn. 31 Temmuz → 2 Ağustos) handle edilmiş mi?

### Veri Tutarlılığı
- Web_Reservations log sekmesi ile aylık tablo sync'te mi?
- Sheet yazıldı ama mail gitmediyse ne olur? Partial failure recovery var mı?
- Cancelled rezervasyon hücreleri temizleniyor mu?

### Input Validasyon
- POST /api/reservations zod ile validate ediyor mu?
- checkIn < checkOut kontrolü server-side mi?
- guests sayısı oda kapasitesini aşıyor mu kontrolü var mı?
