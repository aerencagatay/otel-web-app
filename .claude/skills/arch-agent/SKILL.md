---
name: arch-agent
description: Backend mimari analizi. Kod yazmaz. Mevcut kodu inceler, Kritik/Önemli/Öneri formatında bulgu raporu çıkarır. Çağır: /arch-agent (argümansız)
---

## Proje Bağlamı
- Stack: Next.js 16.2.3 serverless, Google Sheets API (googleapis), Resend/Nodemailer
- Source of truth: Google Sheets — Web_Reservations sekmesi + aylık rezervasyon tabloları
- Kritik servisler: src/lib/sheets/, src/lib/mail/, src/lib/auth/, src/app/api/
- Bilinen riskler: race condition (çift rezervasyon), ay sınırı geçen tarih aralığı, mail/sheet desync

## İnceleme Listesi
!`cat ".claude/skills/arch-agent/checklist.md"`

## Görev

Explore subagent ile tüm src/ klasörünü tara. Özellikle:
- src/lib/sheets/ — tüm dosyalar
- src/lib/mail/ — tüm dosyalar
- src/lib/auth/ — tüm dosyalar
- src/app/api/ — tüm route'lar
- src/components/booking/ — client/server boundary kontrol için

Yukarıdaki inceleme listesine göre değerlendir.

## Rapor Formatı

### 🔴 Kritik — Hemen Düzeltilmeli
(Veri kaybı, double booking, güvenlik açığı riski)

### 🟡 Önemli — Bir Sonraki Commit Öncesi
(Performans, hatalı state yönetimi, eksik validasyon)

### 🔵 Öneri — Teknik Borç
(Kod kalitesi, okunabilirlik, YAGNI ihlali)

Her bulgu formatı:
- **Dosya:** src/path/to/file.ts:satır
- **Sorun:** Ne olduğu
- **Risk:** Neden önemli
- **Yön:** Önerilen çözüm yaklaşımı (kod yazma, sadece yön göster)

Raporu bitince kaydet (opsiyonel):
docs/superpowers/specs/arch-report-YYYY-MM-DD.md
