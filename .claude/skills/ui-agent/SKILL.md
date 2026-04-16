---
name: ui-agent
description: Modern UI bileşen araştırması ve implementasyonu. 21st.dev, shadcnstudio ve diğer kaynaklardan ilham toplar, onay alır, implement eder. Çağır: /ui-agent booking-form, /ui-agent room-card, /ui-agent admin-table
---

## Proje Bağlamı
- Stack: Next.js 16.2.3 App Router, Tailwind v4, TypeScript strict
- Bileşen dizini: src/components/booking/, src/components/home/, src/components/layout/
- Marka tonu: sıcak bej/taş, koyu kömür metin, hafif deniz mavisi vurgu
- Premium ama sakin — SaaS dashboard hissi OLMAMALI
- Renk: Gold #e4a00e, Dark #1a1a1a, Warm BG #faf8f5, Text #555
- Font: Playfair Display (başlık), Montserrat (gövde)

## Kaynaklar ve Marka Kuralları
!`cat ".claude/skills/ui-agent/sources.md"`
!`cat ".claude/skills/ui-agent/brand-guide.md"`

## Görev

Argüman: $ARGUMENTS

1. Yukarıdaki kaynaklardan WebFetch ile "$ARGUMENTS" bileşeni için ilham topla
   - Her kaynaktan en uygun 1-2 pattern seç
   - 21st.dev için şu terimleri dene: booking, hotel card, date picker, reservation, trip summary, room card

2. Kullanıcıya özet sun:
   - Hangi kaynaktan ne bulduğun
   - Otel markasına neden uyduğu
   - Pseudocode veya kısa açıklama

3. **KULLANICI ONAYLAYANA KADAR KOD YAZMA**

4. Onay gelince:
   - Varsa mevcut bileşen dosyasını oku, mevcut pattern'e uy
   - Tailwind v4 + TypeScript strict kullan
   - src/components/ altına implement et

5. Bitince değişen/oluşturulan dosyaları listele
