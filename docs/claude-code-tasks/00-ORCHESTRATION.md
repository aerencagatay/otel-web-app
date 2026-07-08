# Karadut Taş Otel — Büyük Çaplı İyileştirme: Orkestrasyon Planı

Bu klasördeki task dosyaları Claude Code agent'ları tarafından paralel yürütülmek üzere hazırlanmıştır.
Repo: `otel-web-app` (Next.js 16 App Router, Tailwind v4, Google Sheets backend, iron-session admin).

## Task listesi

| # | Dosya | Kapsam | Tahmini efor |
|---|-------|--------|--------------|
| 01 | `01-security-abuse-protection.md` | Rate limit, Turnstile, validasyon sıkılaştırma, brute-force koruması | S-M |
| 02 | `02-design-system-refresh.md` | Radius token sistemi, hızlı arama pill'i, video/grid simetrisi, kart dili | M-L |
| 03 | `03-trust-content.md` | Yerel oda fotoğrafları, yorumlar, KVKK/iptal politikası sayfaları, iletişim formu backend, fiyat gösterimi | M |
| 04 | `04-i18n.md` | next-intl ile TR/EN, hreflang, EUR fiyat gösterimi | L |
| 05 | `05-ux-conversion.md` | Range date picker + fiyat takvimi, oda detay sayfaları, WhatsApp, alternatif tarih önerisi, rezervasyon sorgulama | L |
| 06 | `06-seo-performance.md` | JSON-LD, og:image, görsel optimizasyonu, canonical, medya diyeti | M |

## Paralellik ve bağımlılık grafiği

```
Dalga 1 (paralel):   01-security   02-design-system   06-seo-performance
                                          │
Dalga 2 (paralel):              03-trust-content   04-i18n
                                          │
Dalga 3:                          05-ux-conversion
```

Gerekçe:
- **01** neredeyse tamamen `src/app/api/**` ve `src/lib/**` içinde çalışır; UI task'larıyla dosya çakışması yok → her zaman paralel güvenli.
- **02** `globals.css` ve layout/home bileşenlerine dokunur ve **token sistemini tanımlar**. 03 ve 05'teki yeni UI bu token'ları kullanacağı için 02 önce bitmelidir (en azından `globals.css` token bloğu merge edilmiş olmalı).
- **06**'nın JSON-LD ve görsel optimizasyon işleri bağımsızdır; sadece `layout.tsx` metadata bölümüne dokunur — 04 (i18n) `layout.tsx`'i yeniden yapılandıracağı için **06, 04'ten ÖNCE merge edilmelidir**.
- **04 (i18n)** en invaziv task'tır (tüm sayfalara dokunur). 03'ün oluşturduğu yeni sayfalar (KVKK, iptal politikası) i18n kapsamına gireceği için 03 ile aynı dalgada koordine edilir; string extraction 03 merge edildikten sonra final pass ister.
- **05** hem tasarım token'larına (02) hem çeviri altyapısına (04) hem yeni fotoğraflara (03) dayanır → en son.

## Çakışma önleme: dosya sahipliği

Her agent SADECE kendi task dosyasında "Dokunulacak dosyalar" altında listelenen path'lerde değişiklik yapar. Ortak dosyalar için kurallar:

- `src/app/globals.css`: **yalnızca 02** yapısal değişiklik yapar. Diğer task'lar sadece dosya SONUNA kendi yorum bloklu bölümlerini ekleyebilir (`/* === task-03 === */`).
- `src/app/layout.tsx`: 06 metadata bloğunu günceller; 04 provider sarmalar. Aynı dalgada ikisini çalıştırma.
- `package.json`: her agent kendi bağımlılığını `npm install <pkg>` ile ekler (elle edit yok), merge çakışması lockfile'da çözülür.
- Yeni dosya oluşturmak her zaman serbesttir; mevcut dosyayı silmek yasaktır (aşağıdaki temizlik istisnası hariç).

## Git stratejisi

Her task ayrı worktree/branch'te çalışır:

```bash
git worktree add ../otel-01-security -b feat/security
git worktree add ../otel-02-design   -b feat/design-system
# ...
```

Merge sırası: 01 → 02 → 06 → 03 → 04 → 05. Her merge sonrası `npm run build && npm run lint` yeşil olmadan sonraki merge yapılmaz.

## Ortak kabul kriterleri (tüm task'lar)

1. `npm run build` hatasız tamamlanır (Sheets env'leri yoksa build-time'da import edilen modüller `throw` etmemeli — dikkat: `src/proxy.ts` SESSION_SECRET yoksa throw ediyor, lokal `.env.local` şart).
2. `npm run lint` sıfır error.
3. Türkçe kullanıcıya görünen tüm metinler doğal ve hatasız Türkçe.
4. Mobil (390px) ve masaüstü (1440px) görsel kontrol yapılır; agent screenshot alabiliyorsa alır.
5. Commit mesajları conventional commit formatında (`feat:`, `fix:`, `chore:`).

## Genel temizlik (herhangi bir dalgada, tercihen 01 ile birlikte)

- Repo kökündeki `rooms.html`, `reservation.html` ve `_legacy/` klasörünü sil (git geçmişinde zaten mevcut).
- `public/` içindeki kullanılmayan şablon SVG'lerini sil: `next.svg`, `vercel.svg`, `globe.svg`, `window.svg`, `file.svg`.
- Türkçe karakterli/boşluklu asset adlarını yeniden adlandır ve referansları güncelle: `dış cephe.JPG` → `dis-cephe-original.jpg`, `aile_odası.webp` → `aile-suit.webp`.
- `next.config.ts` içindeki hard-coded LAN IP'sini (`192.168.1.59`) env değişkenine taşı veya kaldır.
