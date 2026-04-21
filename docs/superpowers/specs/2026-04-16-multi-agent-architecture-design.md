# Multi-Agent Mimari Tasarımı
## Assos Karadut Taş Otel — Hybrid Skill+Subagent Sistemi

**Tarih:** 2026-04-16  
**Durum:** Onaylandı  
**Kapsam:** 4 manuel tetiklemeli agent skill'i

---

## 1. Bağlam

Proje statik HTML'den Next.js 16.2.3 (App Router, TypeScript) tabanlı dinamik bir rezervasyon sistemine dönüştürülüyor. Backend iskelet büyük ölçüde mevcut (`src/lib/sheets/`, `src/lib/mail/`, `src/app/api/`). Bu tasarım, devam eden geliştirme sürecini destekleyecek agent mimarisini tanımlar.

**Teknik stack:** Next.js 16.2.3, Tailwind v4, TypeScript strict, googleapis, iron-session, resend/nodemailer, zod, date-fns

---

## 2. Mimari Karar: Hybrid Skill + Subagent

### Neden bu yaklaşım?

Saf skill yaklaşımı (tüm iş ana context'te): UI araştırması sırasında 21st.dev HTML çıktısı ana context'i kirletir. Derin kod analizi sırasında `src/` dosyaları context'i doldurur.

Saf subagent yaklaşımı (her seferinde sıfırdan): Cold start problemi — her çağrıda proje bağlamını yeniden keşfetmek zorunda kalır.

**Hybrid çözüm:** Her agent bir **skill** olarak başlar (proje bağlamını taşır), ağır işleri **specialized subagent**'a devreder. Ana context'e sadece özet/sonuç döner.

### Tetikleme

Tüm agentlar **manuel** tetiklenir. Otomatik hook yok.

---

## 3. Agent Kataloğu

### 3.1 UI Agent — `/ui-agent [component-adı]`

**Sorumluluk:** Modern UI bileşen araştırması ve implementasyonu.

**Çalışma akışı:**
1. Skill, marka kılavuzunu ve kaynak listesini yükler
2. `general-purpose` subagent WebFetch ile kaynaklardan ilham toplar
3. Özet + öneri kullanıcıya sunulur
4. **Kullanıcı onaylayana kadar kod yazılmaz**
5. Onay sonrası subagent implement eder
6. Ana context'e sadece "tamamlandı + değişen dosyalar" döner

**Kaynaklar (sources.md içinde bakımlı tutulur):**
- https://21st.dev
- https://shadcnstudio.com/components
- https://ui.shadcn.com/docs/components
- https://vercel.com/geist
- https://tailwindui.com/components

**Marka kısıtları (brand-guide.md içinde bakımlı tutulur):**
- İzin: rounded-xl kartlar, warm background (stone-50, amber-50), serif başlık, subtle shadow
- Yasak: glassmorphism, neon, SaaS dashboard estetiği, steril beyaz görünüm
- Hedef his: Coastal boutique, Mediterranean calm, rustic luxury

**Örnek kullanım:**
```
/ui-agent booking-form
/ui-agent room-card
/ui-agent admin-table
```

---

### 3.2 Architecture Agent — `/arch-agent`

**Sorumluluk:** Kod yazmaz. Mevcut backend kodunu inceler, mimari bulgular çıkarır.

**Çalışma akışı:**
1. Skill, inceleme checklist'ini yükler
2. `Explore` subagent `src/` klasörünü tarar
3. Bulgular Kritik / Önemli / Öneri formatında raporlanır

**İnceleme odak noktaları (checklist.md içinde bakımlı tutulur):**
- Race condition: `createReservation()` double-check, atomik yazma
- Google Sheets güvenliği: server-only, rate limit
- Admin auth: route koruması, session expiry, hash güvenliği
- Mail: rezervasyon write'ından bağımsızlık, provider abstraction
- Tarih/timezone: UTC tutarlılığı, Türkiye locale, ay geçişi edge case
- Veri tutarlılığı: Web_Reservations ↔ aylık tablo sync

**Rapor formatı:**
```
### 🔴 Kritik — Veri kaybı, double booking, güvenlik açığı
### 🟡 Önemli — Performans, hatalı state, eksik validasyon
### 🔵 Öneri — Kod kalitesi, okunabilirlik
```
Her bulgu: `dosya:satır → sorun → neden risk → önerilen yön`

---

### 3.3 Implementation Agent — `/impl-agent [görev veya rapor dosyası]`

**Sorumluluk:** Backend implementasyon ve kendi kendini doğrulama. arch-agent bulgularını uygular veya eksik servisi tamamlar.

**Çalışma akışı:**
1. Argüman `.md` dosyasıysa okur, Kritik bulguları önceliklendirir
2. Argüman direkt görev açıklamasıysa o göreve odaklanır
3. Mevcut dosyaları okur, pattern'i öğrenir
4. `general-purpose` subagent worktree izolasyonunda implement eder
5. Doğrulama: `tsc --noEmit`, interface uyumu, edge case kontrolü
6. Ana context'e değişen dosyalar + özet döner

**Örnek kullanım:**
```
/impl-agent "race condition düzelt"
/impl-agent docs/superpowers/specs/arch-report.md
/impl-agent "mail provider abstraction eksik, tamamla"
```

**Zorunlu doğrulama adımları:**
- TypeScript hata yok (`tsc --noEmit`)
- Mevcut service interface'leriyle uyumlu
- Ay geçişi, boş oda, eşzamanlı istek edge case'leri düşünüldü mü?

---

### 3.4 Code Review Agent — `/review-agent`

**Sorumluluk:** Build + güvenlik + kod kalitesi. Tam spektrum kontrol.

**Çalışma akışı:**
1. `next build` çalıştırır
2. `tsc --noEmit` çalıştırır
3. Güvenlik taraması: `"use client"` + env var sızıntısı, auth eksiklikleri, zod validasyon
4. Kod kalitesi: servis/UI karışımı, hardcode değerler, `any` tip kullanımı
5. Rapor: Kritik > Önemli > Öneri formatında

**Kritik güvenlik kuralı:** `GOOGLE_PRIVATE_KEY`, `ADMIN_PASSWORD_HASH`, `HOTEL_IBAN` asla client bundle'a girmemeli.

---

## 4. Agent Handoff Akışı

Agentlar birbirini otomatik tetiklemez. Handoff kullanıcı üzerinden geçer:

```
/arch-agent
  → Rapor: src/lib/sheets/reservations.ts:45'te race condition
  → Rapor kaydedilir (opsiyonel: docs/superpowers/specs/arch-report-TARIH.md)

kullanıcı karar verir →

/impl-agent "reservations.ts:45 race condition — arch-report'a bak"
  → Worktree izolasyonunda düzeltir
  → Doğrular

/review-agent
  → Düzeltme sonrası tam kontrol
```

---

## 5. Dosya Yapısı

```
.claude/skills/
  ui-agent/
    SKILL.md          ← /ui-agent komutu + çalışma talimatları
    sources.md        ← referans URL listesi (sık güncellenir)
    brand-guide.md    ← marka tonu, renk, yasak pattern'ler (nadir değişir)
  arch-agent/
    SKILL.md          ← /arch-agent komutu + rapor formatı
    checklist.md      ← inceleme odak noktaları (yeni risk bulununca eklenir)
  impl-agent/
    SKILL.md          ← /impl-agent komutu + doğrulama adımları
  review-agent/
    SKILL.md          ← /review-agent komutu + kontrol listesi
```

---

## 6. Skill Bakım Rehberi

### Üç Bakım Katmanı

**Katman 1 — Talimat mantığı** (`SKILL.md` çalışma adımları)  
Ne zaman değişir: Stack değişirse (Next.js major update, provider değişimi).  
Sıklık: Ayda bir gözden geçir.

**Katman 2 — Proje bağlamı** (her SKILL.md başındaki bağlam bloğu)  
Ne zaman değişir: Yeni oda tipi, yeni API endpoint, mail provider, sheet yapısı değişince.  
Kural: **Projeye bir şey ekledikten sonra 5 dakika ayır, ilgili skill'in bağlam bloğunu güncelle.**

**Katman 3 — Referans listeleri** (`sources.md`, `checklist.md`)  
Ne zaman değişir: Yeni UI kaynağı bulununca, yeni mimari risk tespit edilince, ölü link çıkınca.  
Sıklık: İhtiyaç duyuldukça.

### Bakım Sinyalleri

| Sinyal | Yapılacak |
|--------|-----------|
| Agent yanlış oda tipiyle kod üretiyor | Katman 2 güncelle |
| Agent olmayan bir API'ye başvuruyor | Katman 2 güncelle |
| UI Agent zayıf sonuç veriyor | `sources.md`'e yeni kaynak ekle |
| Arch Agent bilinen pattern'i sorun işaretliyor | `checklist.md`'e false positive notu ekle |
| Yeni güvenlik riski keşfedildi | `arch-agent/checklist.md` güncelle |
| ESLint kuralı değişti | Review Agent Katman 2 güncelle |

---

## 7. Kapsam Dışı (Bu Tasarımda Yok)

- Otomatik hook tetikleme (bilinçli karar: manuel kontrol tercih edildi)
- Agentlar arası doğrudan iletişim
- Persistent agent state (her çağrı bağımsız)
- Scheduled/cron agent çalıştırma

Mimari bunlara genişleyebilecek şekilde tasarlandı (skill → hook veya cron'a çevrilebilir).

---

## 8. Kabul Kriterleri

Bu tasarım şu koşullar sağlandığında başarılı sayılır:

1. `/ui-agent booking-form` çağrısı → kaynaklardan özet → onay → implement akışı çalışıyor
2. `/arch-agent` → tüm src/ taranıyor, Kritik/Önemli/Öneri raporu geliyor
3. `/impl-agent "görev"` → worktree'de çalışıyor, tsc hatasız, özet dönüyor
4. `/review-agent` → build + güvenlik + kalite raporu tek çağrıda geliyor
5. Skill bakım sinyalleri belgelenmiş ve takip edilebilir
