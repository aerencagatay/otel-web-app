# Multi-Agent Skill Dosyaları Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 4 adet Claude Code skill dosyası oluşturmak — UI Agent, Architecture Agent, Implementation Agent ve Code Review Agent — böylece `/ui-agent`, `/arch-agent`, `/impl-agent`, `/review-agent` komutlarıyla çağrılabilir hale gelsinler.

**Architecture:** Her agent bir Hybrid Skill + Subagent yapısında çalışır. Skill dosyası proje bağlamını taşır; ağır işleri (web fetch, derin kod analizi, izole implementasyon) specialized subagent'a devreder. Ana context'e sadece özet döner.

**Tech Stack:** Claude Code Skills (`SKILL.md` YAML frontmatter), Markdown, `!`...`` dynamic context injection

---

## Dosya Haritası

Oluşturulacak dosyalar:

| Dosya | Sorumluluk |
|-------|-----------|
| `.claude/skills/ui-agent/SKILL.md` | `/ui-agent` komutu talimatları |
| `.claude/skills/ui-agent/sources.md` | UI kaynak URL listesi (sık güncellenir) |
| `.claude/skills/ui-agent/brand-guide.md` | Marka tonu ve yasak pattern'ler |
| `.claude/skills/arch-agent/SKILL.md` | `/arch-agent` komutu talimatları |
| `.claude/skills/arch-agent/checklist.md` | Mimari inceleme kontrol listesi |
| `.claude/skills/impl-agent/SKILL.md` | `/impl-agent` komutu talimatları |
| `.claude/skills/review-agent/SKILL.md` | `/review-agent` komutu talimatları |

---

## Task 1: UI Agent Skill Dosyaları

**Files:**
- Create: `.claude/skills/ui-agent/SKILL.md`
- Create: `.claude/skills/ui-agent/sources.md`
- Create: `.claude/skills/ui-agent/brand-guide.md`

---

- [ ] **Step 1.1: Dizin oluştur**

```bash
mkdir -p ".claude/skills/ui-agent"
```

- [ ] **Step 1.2: SKILL.md oluştur**

`.claude/skills/ui-agent/SKILL.md` içeriği:

```markdown
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
```

- [ ] **Step 1.3: sources.md oluştur**

`.claude/skills/ui-agent/sources.md` içeriği:

```markdown
## UI Kaynakları

- https://21st.dev — React/Tailwind bileşen galerisi
- https://shadcnstudio.com/components — shadcn varyantları
- https://ui.shadcn.com/docs/components — resmi shadcn bileşenleri
- https://vercel.com/geist — Vercel design system
- https://tailwindui.com/components — Tailwind UI (ilham için)

## Arama Stratejisi
21st.dev'de aramak için şu terimleri dene:
booking, hotel card, date picker, reservation, trip summary, room card, availability, stay summary, boutique hotel
```

- [ ] **Step 1.4: brand-guide.md oluştur**

`.claude/skills/ui-agent/brand-guide.md` içeriği:

```markdown
## Marka Kuralları — Assos Karadut Taş Otel

### İzin Verilenler
- rounded-xl veya rounded-2xl kartlar
- Subtle shadow: shadow-md, shadow-stone-200
- Warm backgrounds: bg-stone-50, bg-amber-50, bg-[#faf8f5]
- Serif başlık fontu (Playfair Display)
- Soft border: border-stone-200
- Gold accent: text-[#e4a00e], border-[#e4a00e]
- Koyu metin: text-[#1a1a1a], text-[#555]

### Yasaklar
- Glassmorphism, yoğun backdrop-blur
- Neon, parlak gradient overload
- SaaS dashboard estetiği (çok sütunlu metrik kartları)
- Steril beyaz minimalizm
- Çok büyük bold sansserif başlıklar

### Hedef His
Coastal boutique — rustic luxury, Mediterranean calm.
Otel hissi ver, rezervasyon yazılımı hissi değil.

### Referans Promptlar (21st.dev / doğrudan üretim için)

Booking search bar:
"Create a premium boutique hotel booking section for a stone hotel in Assos. Use a warm Mediterranean palette, elegant typography, soft shadows, rounded-xl cards, and a calm luxury aesthetic. Include check-in, check-out, room type, adults, children, and a strong CTA."

Room card:
"Create responsive hotel room cards for a boutique coastal hotel. Each card should include a large image, room title, guest capacity, small amenity chips, optional starting price, and a select button. Keep the style warm, editorial, and premium with stone, sand, and charcoal tones."

Booking summary:
"Create a sticky booking summary card for a hotel reservation flow. Show selected dates, nights, guest count, room type, deposit reminder, and a submit action. The design should feel trustworthy, minimal, and luxurious."

Admin table:
"Create an admin reservation management interface for a small hotel. Show pending deposit and confirmed reservations, clean status badges, reservation details, date range, room code, guest contact info, and quick actions like confirm deposit or cancel."
```

- [ ] **Step 1.5: Dosyaların varlığını doğrula**

```bash
ls -la ".claude/skills/ui-agent/"
```

Beklenen çıktı: `SKILL.md`, `sources.md`, `brand-guide.md` üç dosya görünmeli.

- [ ] **Step 1.6: SKILL.md frontmatter geçerli mi kontrol et**

```bash
head -6 ".claude/skills/ui-agent/SKILL.md"
```

Beklenen çıktı:
```
---
name: ui-agent
description: Modern UI bileşen araştırması...
---
```

- [ ] **Step 1.7: Dynamic context injection referansları var mı doğrula**

```bash
grep -n 'cat ".claude/skills/ui-agent/' ".claude/skills/ui-agent/SKILL.md"
```

Beklenen çıktı: 2 satır — sources.md ve brand-guide.md referansları görünmeli.

- [ ] **Step 1.8: Commit**

```bash
git add ".claude/skills/ui-agent/"
git commit -m "feat(skills): add ui-agent skill — multi-source UI research and implementation"
```

---

## Task 2: Architecture Agent Skill Dosyaları

**Files:**
- Create: `.claude/skills/arch-agent/SKILL.md`
- Create: `.claude/skills/arch-agent/checklist.md`

---

- [ ] **Step 2.1: Dizin oluştur**

```bash
mkdir -p ".claude/skills/arch-agent"
```

- [ ] **Step 2.2: SKILL.md oluştur**

`.claude/skills/arch-agent/SKILL.md` içeriği:

```markdown
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
```

- [ ] **Step 2.3: checklist.md oluştur**

`.claude/skills/arch-agent/checklist.md` içeriği:

```markdown
## Mimari İnceleme Odak Noktaları

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
```

- [ ] **Step 2.4: Dosyaların varlığını doğrula**

```bash
ls -la ".claude/skills/arch-agent/"
```

Beklenen çıktı: `SKILL.md` ve `checklist.md` görünmeli.

- [ ] **Step 2.5: Dynamic context injection referansı doğrula**

```bash
grep -n 'cat ".claude/skills/arch-agent/checklist.md"' ".claude/skills/arch-agent/SKILL.md"
```

Beklenen çıktı: 1 satır — checklist.md referansı görünmeli.

- [ ] **Step 2.6: Commit**

```bash
git add ".claude/skills/arch-agent/"
git commit -m "feat(skills): add arch-agent skill — architectural analysis and risk reporting"
```

---

## Task 3: Implementation Agent Skill Dosyası

**Files:**
- Create: `.claude/skills/impl-agent/SKILL.md`

---

- [ ] **Step 3.1: Dizin oluştur**

```bash
mkdir -p ".claude/skills/impl-agent"
```

- [ ] **Step 3.2: SKILL.md oluştur**

`.claude/skills/impl-agent/SKILL.md` içeriği:

```markdown
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
```

- [ ] **Step 3.3: Dosya varlığını doğrula**

```bash
ls -la ".claude/skills/impl-agent/"
```

Beklenen çıktı: `SKILL.md` görünmeli.

- [ ] **Step 3.4: Frontmatter kontrolü**

```bash
head -5 ".claude/skills/impl-agent/SKILL.md"
```

Beklenen çıktı:
```
---
name: impl-agent
description: Backend implementasyon...
---
```

- [ ] **Step 3.5: Commit**

```bash
git add ".claude/skills/impl-agent/"
git commit -m "feat(skills): add impl-agent skill — backend implementation with self-validation"
```

---

## Task 4: Code Review Agent Skill Dosyası

**Files:**
- Create: `.claude/skills/review-agent/SKILL.md`

---

- [ ] **Step 4.1: Dizin oluştur**

```bash
mkdir -p ".claude/skills/review-agent"
```

- [ ] **Step 4.2: SKILL.md oluştur**

`.claude/skills/review-agent/SKILL.md` içeriği:

```markdown
---
name: review-agent
description: Tam kod kalite kontrolü. Build hatası, güvenlik açığı ve kod kalitesi taraması. Kritik > Önemli > Öneri formatında rapor. Çağır: /review-agent
---

## Proje Bağlamı
- Stack: Next.js 16.2.3, TypeScript strict, Tailwind v4
- Build: npm run build
- Type check: npx tsc --noEmit
- Lint: npm run lint
- Kritik güvenlik kuralı: GOOGLE_PRIVATE_KEY, ADMIN_PASSWORD_HASH, HOTEL_IBAN asla client bundle'a girmemeli
- NEXT_PUBLIC_ prefix olmayan env var = server-only

## Görev

Sırayla şunları kontrol et:

### 1. Build Kontrolü
`npm run build` çalıştır.
- Hata varsa: hata mesajı + dosya:satır + Kritik/Önemli olarak sınıflandır
- Başarılıysa: ✅ Build geçti

### 2. TypeScript Kontrolü
`npx tsc --noEmit` çalıştır.
- Tip hatalarını listele: dosya:satır → hata mesajı
- `any` tip kullanımları varsa Öneri olarak işaretle

### 3. Güvenlik Taraması
Şunları ara:
- "use client" olan dosyalarda GOOGLE_PRIVATE_KEY, ADMIN_PASSWORD_HASH, HOTEL_IBAN kullanımı → 🔴 Kritik
- NEXT_PUBLIC_ olmayan env var'ların client component'te kullanımı → 🔴 Kritik
- /api/admin/* route'larında session kontrol eksikliği → 🔴 Kritik
- POST endpoint'lerinde zod validasyon eksikliği → 🟡 Önemli
- Google Sheets hücresine kullanıcı inputu direkt yazılıyorsa formula injection riski → 🟡 Önemli

### 4. Kod Kalitesi
Şunları kontrol et:
- src/components/ içinde googleapis veya sheets servisi import var mı? → 🟡 Önemli
- src/lib/config/ yerine hardcode değer (örn. "Web_Reservations", "1+0 Panaromic") → 🟡 Önemli
- Kullanılmayan import/export → 🔵 Öneri
- Tekrar eden kod bloğu (DRY ihlali) → 🔵 Öneri

## Rapor Formatı

### 🔴 Kritik — Hemen Düzeltilmeli
### 🟡 Önemli — Bir Sonraki Commit Öncesi
### 🔵 Öneri — Teknik Borç

Her bulgu: **dosya:satır** → sorun açıklaması → önerilen düzeltme yönü
```

- [ ] **Step 4.3: Dosya varlığını doğrula**

```bash
ls -la ".claude/skills/review-agent/"
```

Beklenen çıktı: `SKILL.md` görünmeli.

- [ ] **Step 4.4: Commit**

```bash
git add ".claude/skills/review-agent/"
git commit -m "feat(skills): add review-agent skill — build, security, and quality audit"
```

---

## Task 5: Entegrasyon Doğrulaması

**Files:**
- Verify: `.claude/skills/` tüm dizin yapısı

---

- [ ] **Step 5.1: Tüm skill dizinlerini listele**

```bash
find ".claude/skills" -name "SKILL.md" | sort
```

Beklenen çıktı (4 satır):
```
.claude/skills/arch-agent/SKILL.md
.claude/skills/impl-agent/SKILL.md
.claude/skills/review-agent/SKILL.md
.claude/skills/ui-agent/SKILL.md
```

- [ ] **Step 5.2: Tüm SKILL.md dosyalarının name alanı doğru mu**

```bash
grep -h "^name:" .claude/skills/ui-agent/SKILL.md .claude/skills/arch-agent/SKILL.md .claude/skills/impl-agent/SKILL.md .claude/skills/review-agent/SKILL.md
```

Beklenen çıktı:
```
name: ui-agent
name: arch-agent
name: impl-agent
name: review-agent
```

- [ ] **Step 5.3: Dynamic injection referans dosyaları mevcut mu doğrula**

```bash
# ui-agent'ın referans ettiği dosyalar var mı?
ls ".claude/skills/ui-agent/sources.md" ".claude/skills/ui-agent/brand-guide.md"

# arch-agent'ın referans ettiği dosya var mı?
ls ".claude/skills/arch-agent/checklist.md"
```

Beklenen çıktı: Her iki komut da dosya yollarını hatasız listemeli.

- [ ] **Step 5.4: Skill bakım rehberini docs'a ekle**

`docs/superpowers/skills-maintenance.md` oluştur:

```markdown
# Skill Bakım Rehberi

## Hangi skill ne zaman güncellenir?

| Sinyal | Skill | Yapılacak |
|--------|-------|-----------|
| Yeni oda tipi eklendi | ui-agent, arch-agent, impl-agent | SKILL.md Proje Bağlamı bloğunu güncelle |
| Mail provider değişti (Resend → SMTP) | impl-agent, review-agent | SKILL.md Proje Bağlamı bloğunu güncelle |
| Yeni API endpoint eklendi | arch-agent checklist | Route'u checklist'e ekle |
| UI Agent zayıf sonuç veriyor | ui-agent | sources.md'e yeni kaynak ekle |
| Arch Agent bilinen pattern'i sorun işaretliyor | arch-agent | checklist.md'e false-positive notu ekle |
| Yeni güvenlik riski keşfedildi | arch-agent, review-agent | Her ikisine de ekle |
| Next.js major version güncellendi | Tümü | Katman 1 (talimat mantığı) gözden geçir |

## Üç Bakım Katmanı

**Katman 1 — Talimat mantığı** (SKILL.md çalışma adımları)
Stack değişmedikçe dokunma. Ayda bir gözden geçir.

**Katman 2 — Proje bağlamı** (her SKILL.md başındaki ## Proje Bağlamı bloğu)
Kural: Projeye bir şey ekledikten sonra 5 dakika ayır, ilgili skill'i güncelle.

**Katman 3 — Referans listeleri** (sources.md, checklist.md)
İhtiyaç duyuldukça — yeni kaynak, yeni risk, ölü link.
```

- [ ] **Step 5.5: Final commit**

```bash
git add "docs/superpowers/skills-maintenance.md"
git commit -m "docs: add skill maintenance guide"
```

---

## Kabul Kriterleri

- [ ] `find ".claude/skills" -name "SKILL.md"` 4 dosya döndürüyor
- [ ] Her SKILL.md geçerli YAML frontmatter içeriyor (name + description)
- [ ] `ui-agent/sources.md` ve `ui-agent/brand-guide.md` mevcut (dynamic injection referansları)
- [ ] `arch-agent/checklist.md` mevcut (dynamic injection referansı)
- [ ] `skills-maintenance.md` bakım rehberi yazılı
- [ ] `/ui-agent booking-form` çağrısında skill tanınıyor ve kaynakları fetch ediyor
- [ ] `/arch-agent` çağrısında Explore subagent src/ taraması yapıyor
- [ ] `/impl-agent "test görevi"` çağrısında tsc doğrulaması çalışıyor
- [ ] `/review-agent` çağrısında `npm run build` komutu çalışıyor
