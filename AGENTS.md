<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Kanonik Otel Bilgileri (tek doğruluk kaynağı)

Bu bölüm iş bilgilerinin kanonik kaynağıdır. Bir agent tanımı veya sayfa içeriği ile bu bölüm çelişirse, bu bölüm kazanır. Bilgi değişikliklerini yalnızca burada güncelleyin.

- **Otel adı:** Assos Karadut Taş Otel
- **Adres:** Büyükhusun Köyü Namazgah Mevkii No:26, Ayvacık, Çanakkale 17860
- **Telefon:** +90 501 091 34 17
- **E-posta:** karaduttas@gmail.com
- **Check-in / Check-out:** 14:00 / 12:00
- **Toplam oda:** 28
- **Başlangıç fiyatı:** 7.200 TL/gece — NOT: fiyat/istatistik gibi değerlerde CANLI SİTEDEKİ (src/) değer esastır; bu dosya canlı siteyle çelişirse siteyi değiştirme, bu dosyayı güncelle
- **Turizm Lisansı:** 24921
- **Konum notu:** Kadırga Koyu'na 5 km
- **Rezervasyon modeli:** Telefon öncelikli; online ödeme YOK. Dinamik rezervasyon (kapora akışı) Vercel/Next.js üzerinde planlı.
- **Rezervasyon URL konfigürasyonu:** `js/booking-config.js` → `window.KARADUT_BOOKING_URL`

## Oda tipleri (tüm sayfalarda bu adlar aynen kullanılır — kullanıcı onayı 2026-07-03)

1. **Deluxe Tam Deniz Manzaralı** — 24m², max 2 kişi, deniz manzarası
2. **Traditional Kısmi Deniz Manzaralı** — 22m², max 2 kişi
3. **Aile Suit Deniz Manzaralı** — 44m², max 4 kişi

Anasayfada gecelik başlangıç fiyatı GÖSTERİLMEZ (kullanıcı kararı 2026-07-03);
oda kartlarında "Fiyat için iletişim" kullanılır. `src/lib/config/pricing.ts`
rezervasyon sisteminin fonksiyonel verisidir, pazarlama kopyası değildir.
