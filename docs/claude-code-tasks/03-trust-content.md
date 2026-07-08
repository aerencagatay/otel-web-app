# Task 03 — Güven ve İçerik: Yerel Fotoğraflar, Yorumlar, Politika Sayfaları, İletişim Formu, Fiyat Şeffaflığı

## Amaç
Siteyi "OTA'dan hotlink'li görselleri olan, iletişim formu çalışmayan, politikaları olmayan site"den "kendi içeriğiyle güven veren premium butik otel sitesi"ne taşımak.

## Mevcut durum (doğrulanmış bulgular)
- Oda görselleri `cdng.jollytur.com`'dan hotlink: `src/components/home/featured-rooms.tsx` ve `src/app/(public)/rooms/page.tsx` içinde hard-coded URL'ler; `next.config.ts`'te jollytur remotePattern'i var.
- Kullanıcı yeni oda fotoğraflarını `public/img/` altına ekledi/ekleyecek (Traditional, Panoramic/Deluxe, Aile Suit — balkon, yatak, havuz manzarası kareleri mevcut; ayrıca halihazırda repo'da `balkon-web.jpg`, `chairperson-web.jpg`, `havuz.webp`, `aile_odası.webp`, `bahce.webp` var).
- `src/components/contact-form.tsx`: submit sadece `setSubmitted(true)` — hiçbir yere veri gitmiyor (sahte form).
- Hero'da "9.6 misafir puanı" iddiası var ama tek bir yorum yok.
- KVKK aydınlatma metni, gizlilik, çerez bandı, iptal/iade politikası, mesafeli satış sayfaları YOK.
- `pricing.ts`'te Haziran–Ağustos 2026 fiyatları tanımlı ama `/rooms` "Fiyat için arayın" gösteriyor (tutarsızlık).

## Dokunulacak dosyalar
- `public/img/rooms/**` (YENİ klasör yapısı)
- `src/lib/config/room-images.ts` (mevcut — merkezi görsel kaynağı buraya taşınacak)
- `src/components/home/featured-rooms.tsx`, `src/app/(public)/rooms/page.tsx`
- `src/components/contact-form.tsx` + YENİ `src/app/api/contact/route.ts`
- YENİ: `src/components/home/reviews-section.tsx`
- YENİ: `src/app/(public)/kvkk/page.tsx`, `src/app/(public)/gizlilik/page.tsx`, `src/app/(public)/iptal-politikasi/page.tsx`
- YENİ: `src/components/layout/cookie-banner.tsx`
- `src/components/layout/footer.tsx` (politika linkleri)
- `src/lib/config/pricing.ts` (yalnızca okuma), `next.config.ts` (jollytur pattern'ini kaldır)

## Adımlar

### 1. Görsel envanteri ve merkezileştirme
- `public/img/rooms/{deluxe,traditional,aile-suit}/` klasörlerini oluştur; kullanıcının indirdiği fotoğrafları oda tipine göre buraya taşı, kebab-case adlandır (`deluxe-balkon-1.webp`). Tüm yeni görselleri sharp script'i ile 1920px max genişlik + WebP q80'e dönüştür (`scripts/optimize-images.mjs` yaz, `npm run img:optimize`).
- `room-images.ts`'i tek doğruluk kaynağı yap: her oda tipi için `cover` + `gallery[]` (alt metinleriyle). `featured-rooms.tsx` ve `rooms/page.tsx` görselleri SADECE buradan alsın.
- TÜM jollytur URL'lerini kaldır, `next.config.ts`'ten remotePattern'i sil. Grep ile `jollytur` sıfır sonuç dönmeli.
- Oda kartlarına hover'da ikinci görsele cross-fade (basit, CSS opacity) ekle; `rooms/page.tsx`'te oda başına 4-6 karelik lightbox'lı mini galeri (yeni bağımlılık istersen `yet-another-react-lightbox`, istemezsen basit modal).

### 2. Yorumlar bölümü (`reviews-section.tsx`)
- Ana sayfada Konum ile Galeri arasına "Misafirlerimiz ne diyor" bölümü. Veri: `src/lib/config/reviews.ts` içinde elle girilmiş 6 gerçek yorum objesi (ad, tarih, puan, metin, kaynak: "Google"). Otel sahibinden gerçek yorumlar gelene kadar `PLACEHOLDER — yayınlamadan önce gerçek yorumlarla değiştirin` yorumu bırak; UYDURMA yorum yazma, alanları boş şablon bırak ve bölümü `reviews.length === 0` iken render etme.
- Hero'daki "9.6" rozetini bu veri kaynağına bağla (ortalama puan hesapla); veri boşsa rozeti gizle.
- Yapı Task 06'daki `AggregateRating` JSON-LD'siyle uyumlu olsun (aynı config'i okusun).

### 3. İletişim formunu gerçek yap
- `src/app/api/contact/route.ts`: zod şema (ad, e-posta, telefon opsiyonel, konu enum, mesaj max 1000), Task 01'in `verifyTurnstileToken` ve rate limiter'ını kullan (IP başına 5/saat), `getMailService()` ile `ADMIN_EMAIL`'e ilet, gönderene otomatik "mesajınız alındı" e-postası.
- `contact-form.tsx`'i controlled state + fetch + hata/başarı durumlarıyla yeniden yaz. Başarı/hata mesajları Türkçe ve spesifik.
- Alternatif olarak formun altına belirgin WhatsApp yönlendirmesi ekle: `https://wa.me/905010913417?text=Merhaba...`

### 4. Yasal sayfalar + çerez bandı
- `kvkk`, `gizlilik`, `iptal-politikasi` sayfalarını `PageHero` + düzyazı şablonuyla oluştur. İçerik: sektörde standart yapıyı kur (veri sorumlusu, işlenen veriler, amaç, saklama, haklar / iptal-iade koşulları kapora modeline göre: X gün öncesine kadar tam iade vb.) ama somut hukuki değerleri `[OTEL SAHİBİ ONAYLAYACAK]` placeholder'ları ile işaretle — uydurma taahhüt yazma.
- Rezervasyon formuna zorunlu onay checkbox'ı: "KVKK Aydınlatma Metni'ni okudum" (linkli). Backend'de `consent: z.literal(true)` doğrula.
- `cookie-banner.tsx`: minimal, alt bantta, "Kabul et / Yalnızca zorunlu" iki seçenek; tercih localStorage'da (banner client component, rezervasyon akışını bloklamaz). Analytics henüz yoksa banner yalnızca tercih saklar — Task 06 analytics eklerse tercihi okur.
- Footer'a üç sayfanın linkini ekle.

### 5. Fiyat şeffaflığı
- `rooms/page.tsx` ve `featured-rooms.tsx`'te "Fiyat için arayın" yerine `pricing.ts`'ten mevcut/sonraki sezonun min fiyatını çek: `₺7.200'den başlayan / gece · kahvaltı dahil`. Fiyat tanımlı ay yoksa zarif fallback: `Fiyat için bize ulaşın`.
- Bunu yapan pure helper'ı `pricing.ts`'e ekle: `getLowestUpcomingPrice(roomType, today)` — unit test yaz (`pricing.test.ts`, vitest ekle: `npm i -D vitest`, `npm run test`).

## Yapma (scope dışı)
- i18n (Task 04) — metinleri düz Türkçe yaz, string extraction 04'te yapılacak.
- Oda detay route'ları (Task 05).
- Radius/gölge token'ları tanımlama — Task 02'nin token'larını KULLAN.

## Kabul kriterleri
- `grep -r jollytur src/ next.config.ts` → 0 sonuç.
- İletişim formu doldurulduğunda `ADMIN_EMAIL`'e e-posta düşer; Turnstile'sız istek prod modda reddedilir.
- `/kvkk`, `/gizlilik`, `/iptal-politikasi` render olur, footer'dan erişilir, sitemap'e eklenir (Task 06 ile koordine: sitemap.ts'e bu üç URL'yi ekle).
- Rezervasyon, KVKK onayı işaretlenmeden gönderilemez (hem client hem server).
- Odalar sayfası gerçek fiyat gösterir; fiyatsız ay senaryosu kırılmaz.
- `npm run test` yeşil.
