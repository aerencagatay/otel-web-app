# Task 05 — UX ve Dönüşüm: Fiyat Takvimi, Oda Detay Sayfaları, Alternatif Tarihler, Rezervasyon Sorgulama, WhatsApp

## Amaç
Rezervasyon hunisindeki sürtünmeyi OTA standardına yaklaştırmak: kullanıcı fiyatı erken görsün, dolulukta alternatif alsın, rezervasyonunu kendisi takip edebilsin.

## Bağımlılıklar
Dalga 3 — şunlar merge edilmiş olmalı: Task 02 (`date-range-picker.tsx` bileşeni ve tasarım token'ları), Task 03 (yerel oda görselleri, `room-images.ts`), Task 04 (i18n — tüm yeni metinler baştan `messages/*.json`'a yazılır).

## Dokunulacak dosyalar
- `src/components/booking/date-range-picker.tsx` (fiyat gösterimi eklenir)
- YENİ: `src/app/api/pricing/route.ts` (aylık fiyat haritası endpoint'i — hafif, cache'li)
- YENİ: `src/app/[locale]/(public)/rooms/[slug]/page.tsx` (oda detay sayfaları)
- `src/lib/config/room-types.ts` (slug alanı), `src/lib/config/room-images.ts`
- `src/app/api/availability/route.ts` + `src/lib/sheets/availability.ts` (alternatif tarih önerisi + cache)
- `src/components/booking/booking-flow.tsx`
- YENİ: `src/app/[locale]/(public)/rezervasyon-sorgula/page.tsx` + `src/app/api/reservations/lookup/route.ts`
- YENİ: `src/components/layout/whatsapp-button.tsx`
- `src/app/sitemap.ts`

## Adımlar

### 1. Fiyat takvimi (date picker içinde gün bazlı fiyat)
- `GET /api/pricing?roomType=&months=YYYY-MM,YYYY-MM`: `ROOM_PRICING`'den gün→fiyat haritası döner (config statik olduğundan `Cache-Control: public, max-age=3600`). Oda tipi seçilmemişse en düşük fiyatlı tipi baz al ve `"from": true` işaretle.
- `date-range-picker.tsx`: her gün hücresinin altında küçük fiyat etiketi (`7.2k` biçiminde kısaltılmış, tooltip'te tam değer). Fiyatsız aylar etiketsiz. Seçim tamamlanınca picker altbilgisinde `N gece · toplam ₺X` özeti (calculateStayTotal helper'ını client'ta yeniden kullan — `pricing.ts` zaten pure).
- Mobilde fiyat etiketleri 10px, taşma testi yap.

### 2. Oda detay sayfaları (`/rooms/[slug]`)
- `room-types.ts`'e `slug` ekle: `deluxe-tam-deniz-manzarali`, `traditional-kismi-deniz-manzarali`, `aile-suit-deniz-manzarali` (EN tarafında aynı slug kalabilir, `localePrefix` yeterli).
- Sayfa içeriği: tam ekran galeri (Task 03 görsellerinden), özellik listesi, m²/kapasite/manzara, sezon fiyat tablosu (`ROOM_PRICING`'den), tarih seçiciyle gömülü müsaitlik CTA'sı (`/reservation?roomType=...&auto=1`'e prefill'li yönlendirme), diğer odalara "benzer odalar" bloğu.
- `generateStaticParams` + `generateMetadata` (oda adı + açıklama + oda görseli og:image). `/rooms` listesindeki kartlar artık detay sayfasına linklenir.
- Sitemap'e oda URL'lerini ekle.

### 3. Dolulukta alternatif tarih önerisi
- `availability.ts`'e `findNearestAvailability(checkIn, checkOut, roomType)` ekle: istenen aralık doluysa ±1..±7 gün kaydırılmış aynı uzunluktaki pencereleri tara (en fazla 6 sorgu; ay verisi zaten parse edildiyse yeniden fetch etme — parse sonuçlarını fonksiyon içinde memoize et).
- `GET /api/availability` yanıtına `rooms: []` iken `alternatives: [{checkIn, checkOut}]` alanı ekle (max 3 öneri).
- `booking-flow.tsx`: sonuç boşken ölü uç yerine "Bu tarihler dolu — şu tarihlerde müsaitlik var:" kartları; tıklayınca arama o tarihlerle yeniden koşar.
- **Performans yan görevi:** `parseMonthSheet` çağrılarına 60 sn'lik in-memory TTL cache ekle (`src/lib/sheets/cache.ts`, basit Map tabanlı; serverless instance başına çalışması yeterli). `availability.ts`'teki sıralı `for...await` ay döngüsünü `Promise.all`'a çevir.

### 4. Rezervasyon sorgulama (self-servis)
- `/rezervasyon-sorgula`: rezervasyon no (`KRD-...` formatı `ids.ts`'ten) + e-posta ile sorgu formu.
- `POST /api/reservations/lookup`: log sheet'ten kaydı bul; **ikisi birden eşleşmezse** generic "kayıt bulunamadı" dön (enumeration koruması), Task 01 rate limiter'ına bağla (IP başına 10/saat). Yanıt: durum (pending/confirmed/cancelled), tarihler, oda, kapora tutarı. İptal BUTONU EKLEME (iptal telefonla — scope kararı; sayfada telefon/WhatsApp CTA'sı göster).
- Rezervasyon başarı ekranı ve e-postalarına bu sayfanın linkini ekle.

### 5. WhatsApp butonu
- `whatsapp-button.tsx`: sağ altta yüzen, `--radius-pill`, `wa.me/905010913417?text=` locale'e göre hazır mesajla. Rezervasyon akışı adım 2-3'teyken oda/tarih bilgisini mesaja parametreleştir ("Merhaba, 12–15 Temmuz Deluxe oda hakkında bilgi almak istiyorum"). `sticky-booking-cta.tsx` ile çakışmayacak konum/z-index; mobilde ikisi aynı anda ekranı kaplamasın (scroll yönüne göre birini gizle).

## Yapma (scope dışı)
- Online ödeme entegrasyonu (ayrı, sonraki faz — iyzico).
- Sheets yerine veritabanı geçişi.
- Misafirin online iptali.

## Kabul kriterleri
- Takvimde Haziran–Ağustos 2026 günleri fiyat etiketli görünür; seçim sonunda doğru toplam hesaplanır (ay geçişli konaklama testi: 30 Haz → 3 Tem).
- `/rooms/deluxe-tam-deniz-manzarali` SSG render olur, metadata ve og:image doğru.
- Dolu tarih aramasında en az 1 alternatif önerilir (test için sheet'te elle doldurulmuş aralık senaryosu).
- Aynı availability sorgusu 60 sn içinde ikinci kez Sheets API'ye gitmez (log ile doğrula).
- Lookup: yanlış e-posta + doğru rezervasyon no → "bulunamadı".
- WhatsApp butonu her sayfada, CTA'larla çakışmadan çalışır.
