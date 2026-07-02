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
- **Toplam oda:** 34
- **Başlangıç fiyatı:** 3.500 TL/gece (kahvaltı dahil)
- **Turizm Lisansı:** 24921
- **Konum notu:** Kadırga Koyu'na 5 km
- **Rezervasyon modeli:** Telefon öncelikli; online ödeme YOK. Dinamik rezervasyon (kapora akışı) Vercel/Next.js üzerinde planlı.
- **Rezervasyon URL konfigürasyonu:** `js/booking-config.js` → `window.KARADUT_BOOKING_URL`

## Oda tipleri (tüm sayfalarda bu adlar aynen kullanılır)

1. **Deluxe Oda Deniz Manzaralı** — 24m², max 2 kişi, tam deniz manzarası
2. **Deluxe Oda Kısmi Deniz Manzaralı** — 22m², max 2 kişi
3. **Aile Odası** — 44m², max 4 kişi, oturma grubu
