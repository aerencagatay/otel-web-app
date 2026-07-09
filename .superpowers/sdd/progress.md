# SDD Progress Ledger — Karadut büyük iyileştirme planı

Plan: docs/claude-code-tasks/ (00-ORCHESTRATION.md)
Base commit (main): 09f2133
Merge sırası: 01 → 02 → 06 → 03 → 04 → 05 (her merge sonrası build+lint yeşil)

Kararlar (kullanıcı, 2026-07-08):
- Fiyat gösterimi: PLAN geçerli — anasayfa + /rooms kartlarında pricing.ts'ten gerçek fiyat (AGENTS.md güncellendi, 09f2133).
- img/ oda klasörleri sadece FOTOĞRAF KAYNAĞI: Panoramic→Deluxe, Premium Dört Kişilik→Aile Suit, Traditional→Traditional.

Worktree'ler:
- ../otel-01-security  → feat/security       (Task 01 + genel temizlik)
- ../otel-02-design    → feat/design-system  (Task 02)
- ../otel-06-seo       → feat/seo-performance (Task 06)

## Durum

DALGA 1 TAMAM: 01 (e8af02e), 02 (e3c6e26), 06 (6684924) main'de, her merge sonrası build+lint yeşil.
  Merge çözümleri: availability-search.tsx (01'in render-sync sürümü tutuldu), featured-rooms video (06'nın preload=none + oda-video-poster.jpg), dis-cephe ham görsel tek kopya assets-raw'da (public'teki 5.9MB kopya silindi), package.json union + lockfile npm install ile yeniden üretildi.
DALGA 2 BAŞLADI: worktree'ler ../otel-03-trust (feat/trust-content) ve ../otel-04-i18n (feat/i18n), taban 6684924. Dalga 1 worktree'leri kaldırıldı.
Task 03: COMPLETE ve MERGE EDİLDİ (merge 2e08e3e, build+lint+test yeşil: 23/23 sayfa, 0 lint error, 8/8 test).
  Minor (final review'a): kısa yorumlarda işlevsiz "Devamını gör" butonu; galeriler 8-11 kare (spec 4-6 idi, kabul edilmiş sapma).
  Kullanıcıya raporlanacak: about sayfasındaki "Google Puanı 4.9 · 157 yorum" iddiası kaynaksız — otel sahibi gerçek yorum/puanları sağlayana kadar tutarsızlık riski; reviews.ts'te sadece 3 gerçek yorum var (spec 6 istiyordu, uydurma yasak olduğundan 3 kaldı).
Task 04: COMPLETE ve MERGE EDİLDİ (merge a85824e; review Spec ✅ / Approved, Critical/Important yok; build 32/32 sayfa + lint 0 error + test 8/8 — bayat .next cache temizlenerek). DALGA 2 TAMAM.
  Minor (final review'a): reservations route'ta ölü TR message string'i; room-images alt'ları EN'de TR; yorum çevirisi indeks-eşlemeli.
DALGA 3 BAŞLADI: worktree ../otel-05-ux (feat/ux-conversion), taban a85824e. Dalga 2 worktree'leri kaldırıldı.
Task 05: COMPLETE ve MERGE EDİLDİ (merge c58989e; fix re-review Approved; 42/42 sayfa, 0 lint error, 20/20 test). TÜM TASK'LAR MAIN'DE.
FINAL whole-branch review dispatch edildi (fable), bekleniyor. Push henüz YAPILMADI (kullanıcı kararı + Vercel env checklist gerekiyor).
  Minor (final review'a): lookup'ta getReservationLogs cache'siz (rate limit koruyor, ölçekte maliyetli); .find() teorik timing farkı (pratikte anlamsız, aksiyonsuz kabul).
  İmplementer sapmaları: rezervasyon no formatı gerçek "WEB-YYYYMMDD-XXXX" (spec'teki "KRD-" repoda yok); minGuests alternatif aramaya eklendi; cache yalnız read-only yolda (yazma yolu ham parse — double-booking koruması).
Not: .claude/agents dosyaları kullanıcı isteğiyle yeniden adlandırıldı (karadut-* → product-architect, ui-designer, frontend-engineer, platform-engineer, seo-localization-specialist, qa-engineer, security-reviewer, release-manager).
  İmplementer notları: EN rezervasyon Turnstile 503'e kadar canlı doğrulandı (staging'de gerçek EN rezervasyon önerilir); Web_Reservations sheet'ine S kolonu "locale" başlığı elle eklenmeli; room-images alt'ları EN'de TR; EN→TR geçiş 307.

Task 01: COMPLETE (commits 2548071..f116b43, feat/security, review clean — Spec ✅, Quality Approved, fix re-review Approved). MERGE'E HAZIR.
  Adjudike edilen bulgular (değişiklik yok): rate limit validasyondan önce = bilinçli güvenlik deseni.
  Minor notlar (final review'a taşınacak):
  - availability-search.tsx prefill referans eşitliği — booking-flow'da memoize kontrolü (Task 02/05 çakışma riski de var, merge'lerde dikkat)
  - templates.ts: escape edilmeyen server-üretimi alanlara açıklayıcı yorum
  Prod deploy checklist: UPSTASH_REDIS_REST_*, TURNSTILE_SECRET_KEY, NEXT_PUBLIC_TURNSTILE_SITE_KEY zorunlu (PREVIEW ortamına da — NODE_ENV=production olduğundan secretsiz preview'da form 503 döner).
  Ek minor (final review'a): turnstile.ts reason "no-secret-configured" hem dev-bypass-success hem prod-fail anlamında kullanılıyor — reason'a tek başına güvenen caller tuzağı.
Task 01 merge: e8af02e main'de, build+lint yeşil (19/19 sayfa, 0 lint error).
Task 02: COMPLETE (commits e72de41..985d9de, feat/design-system, fix re-review Approved — Spec ✅). MERGE'E HAZIR.
  Görsel QA notu (final'e): 1440px'te galeri hero karosunun gerçek aspect-square renderı + video/kart eşit yükseklik + 390px stack kontrolü.
  Minor (final review'a): date-range-picker focus-trap yok; select'te appearance:none ama özel ok ikonu yok.
Task 06: COMPLETE (commits b025d9f..3faf406, feat/seo-performance, review clean — Spec ✅, Quality Approved). MERGE'E HAZIR (02'den sonra).
  Takip maddeleri (kullanıcıya raporlanacak):
  - Geo koordinatı yaklaşık (köy merkezi) — otel sahibinden kesin koordinat alınınca hotel.ts güncellenmeli.
  - Lighthouse kriterleri (mobil ≥85, LCP ≤2.5s) deploy sonrası ölçülmeli.
  - hotel-web.jpg türevi 392KB→631KB büyümüş — optimize-images.mjs kalite ayarı gözden geçirilebilir (1MB altı, ihlal değil).
  Minor (final review'a): json-ld roomDetails'ın ROOM_TYPE_MAP ile compile-time bağlaması yok.
  Eski notlar: Lighthouse deploy sonrası ölçülecek; geo koordinatı köy hassasiyetinde (hotel.ts'te not); kök img/*.mp4 public kopyası çıktı (yeni kaynak değil); CRF28 video kalitesi gözle kontrol edilmeli (kullanıcıya raporlanacak); availability-search.tsx lint fix'i 01/02 ile aynı — merge'de çakışma çözülecek.
