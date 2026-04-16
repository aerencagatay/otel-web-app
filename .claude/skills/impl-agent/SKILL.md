---
name: impl-agent
description: Backend implementasyon ve kendi kendini doğrulama. arch-agent bulgularını uygular veya eksik servisi tamamlar. Worktree izolasyonunda çalışır. Çağır: /impl-agent "görev açıklaması" veya /impl-agent rapor.md
---

## Proje Bağlamı
- Stack: Next.js 16.2.3 App Router, googleapis, iron-session, resend/nodemailer, zod, date-fns
- TypeScript strict mod — tip hataları kabul edilmez
- Kural: Sheet işlemleri asla client component'te olmaz — sadece Route Handler veya Server Action
- Config: hardcode etme, src/lib/config/ kullan (room-types.ts, hotel.ts)
- Tarih: date-fns kullan, timezone aware ol (Türkiye = UTC+3)
- Google Sheets API: googleapis ile service account auth, tüm işlemler server-side

## Görev

Argüman: $ARGUMENTS

1. Argüman .md dosyasıysa oku, Kritik (🔴) bulguları önceliklendir
   Argüman direkt görev açıklamasıysa o göreve odaklan

2. İlgili mevcut dosyaları oku — değiştirmeden önce mevcut pattern'i anla

3. Implement et:
   - TypeScript strict uyumlu
   - Mevcut servis interface'leriyle uyumlu
   - src/lib/config/ üzerinden config oku, hardcode etme

4. Kendi yazdığın kodu doğrula:
   - npx tsc --noEmit çalıştır, hata varsa düzelt
   - Şu edge case'leri düşündün mü?
     * Ay geçişi: 31 Temmuz giriş, 3 Ağustos çıkış
     * Son boş oda: iki kullanıcı aynı anda istiyor
     * Mail fail: sheet yazıldı ama mail gitmiyor
     * Kısmi write: Web_Reservations yazıldı ama aylık tablo yazılmadı

5. Özet ver:
   - Değişen/oluşturulan dosyalar
   - Ne değişti ve neden
   - Kalan bilinen riskler varsa belirt
