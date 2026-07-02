# "Assos Sessizliği" v2 — Next.js Uygulaması Redesign Spec

**Tarih:** 2026-07-02
**Bu spec, aynı tarihli statik-site spec'inin yerine geçer.** Önceki spec yanlış
hedefe (legacy statik HTML) yazılmıştı ve işi revert edildi (commit `4603d64`).
Doğru hedef: Vercel'de canlı çalışan Next.js uygulaması (`src/` + `public/`).

**Kapsam (Faz 1):** Anasayfa (`/`) + paylaşılan layout bileşenleri + global tema tokenları
**Kapsam (Faz 2, onay sonrası):** `/rooms`, `/about`, `/contact`, `/reservation` + booking akışı UI + `/booking-success`
**Esin:** Aman Resorts / Six Senses "sessiz lüks" estetiği

## Amaç

Canlı Next.js sitesinin görsel dilini daha modern ve klas bir seviyeye taşımak.
Mimari, rezervasyon sistemi, mail akışı ve içerik yapısı DEĞİŞMEZ — bu yalnızca
görsel/tasarım katmanı işidir.

## İÇERİK DOKUNULMAZDIR (kullanıcı düzeltmesi, 2026-07-02)

Sitedeki tüm içerik zaten doğrudur ve tasarım işi kapsamında DEĞİŞTİRİLMEZ:
istatistik değer/etiketleri ("3.500 ₺", "Gece başlangıç" vb.), oda adları,
fiyatlar, oda fotoğrafları ve tüm görsel kaynakları, başlık/paragraf metinleri,
CTA yazıları. §3 tablosundaki "kopya sadeleşir" ve "kanonik adlar" ifadeleri bu
düzeltmeyle GEÇERSİZDİR — yalnızca görsel katman (renk, tipografi ölçeği,
boşluk, düzen, className/CSS) değişir. Tek istisna: hero `poster` özniteliğinin
optimize kopyaya bağlanması (performans işi, görünen içerik aynı).

## Onaylanmış kararlar

| Karar | Seçim |
|---|---|
| Estetik yön | Sessiz lüks (Aman tarzı) — önceki onay geçerli |
| Renk paleti | **Deniz & taş** — kullanıcı Next.js bağlamında yeniden onayladı (2026-07-02); mat altın emekli olur |
| Kapsam | Önce anasayfa + paylaşılan layout; onay sonrası diğer sayfalar |
| Tipografi | Cormorant Garamond (başlık) zaten kurulu — KALIR. DM Sans (gövde) KALIR (Montserrat'a geçilmez; churn azaltma) |
| Video | Mevcut hero video düzeni korunur; video dosyaları yeniden kodlanmaz, kalite düşürülmez |

## 1. Renk tokenları (global — `src/app/globals.css` `@theme`)

Token DEĞERLERİ deniz & taş paletine geçer. Faz 1'de token ADLARI korunur
(yüzlerce sınıf referansını kırmamak için); anlamsal yeniden adlandırma
(`--color-gold` → `--color-accent`) Faz 2 temizliğine bırakılır.

```css
--color-gold:       #2e4a5c;  /* derin Ege mavisi — tek vurgu */
--color-gold-dark:  #223a49;  /* koyu mavi (hover) */
--color-gold-light: #4a6b80;  /* açık mavi (ikincil) */
--color-olive:      #3a4440;  /* nötr koyu yeşil-gri (yumuşatıldı) */
--color-stone:      #cfc8bb;  /* taş */
--color-ivory:      #f4f2ee;  /* kırık beyaz zemin */
--color-warm:       #efece6;  /* ikincil sıcak zemin */
--color-dark:       #22211f;  /* ink */
--color-dark-2:     #2b2a27;
--color-text:       #4a4842;  /* mevcut, kalır */
--color-text-light: #7a776d;  /* mevcut, kalır */
--color-border:     #d9d2c5;  /* hairline */
```

Bu değişiklik TÜM sayfaları anında yeni palete geçirir (booking ve admin dahil)
— renk tutarlılığı sitede bir bütün olur; yapısal/görsel rafine ise Faz 1'de
yalnızca anasayfa + layout'ta yapılır.

Kontrol: `#2e4a5c` üzeri beyaz metin AA geçer; `--color-gold-light` yalnızca
büyük metin/dekoratif kullanımda.

## 2. Tasarım dili (Faz 1'de anasayfa + layout'a uygulanır)

- Kart/gölge/yuvarlak köşe azaltılır: ayrım boşluk + 1px hairline
  (`--color-border`) ile. Mevcut `border-radius`/`box-shadow` kullanımları
  anasayfa ve layout bileşenlerinde sadeleştirilir (booking/iç sayfalar Faz 2).
- Bölüm dikey boşlukları büyür (desktop 120–160px hissi).
- Başlık ölçeği büyür; etiketler geniş harf aralıklı küçük büyük-harf.
- Altın degrade/parlak dokunuşlar kaldırılır; vurgu tek renk (Ege mavisi),
  az ve kararlı kullanılır.

## 3. Anasayfa bölüm planı (mevcut component'ler üzerinden)

| Component | Değişiklik |
|---|---|
| `layout/topbar.tsx` | KALDIRILIR (layout'tan çıkar); telefon navbara taşınır. TR/EN linki zaten işlevsizse birlikte kalkar |
| `layout/navbar.tsx` | Hero üzerinde şeffaf, scroll'da `--color-ivory` zemin + hairline alt çizgi; sağda `tel:` telefon linki; CTA sadeleşir |
| `home/hero-home.tsx` | Video düzeni korunur; kopya sadeleşir: eyebrow ("ASSOS · ÇANAKKALE") + tek satır serif başlık + tek hayalet CTA. HeroBookingStrip kalır ama hairline/şeffaf stile geçer (dönüşüm aracı — kaldırılmaz) |
| `home/stats-bar.tsx` | Koyu blok yerine ince tipografik şerit: hairline'larla ayrılmış 4 değer, `--color-ivory` zemin |
| `home/about-snippet.tsx` | Manifesto tarzına yaklaşır: daha büyük serif, daha az süs; ikonlu highlight listesi sade tipografik listeye döner |
| `home/featured-rooms.tsx` | 3 kart → editoryal zigzag satırlar; kanonik oda adları (AGENTS.md); hover'da hafif foto zoom (transform-only). Görseller şimdilik mevcut kaynaklarından kalır (bkz. §5 not) |
| `home/amenities-grid.tsx` | İkon gridi → fotoğraf + tipografik liste (hairline ayraçlı, ikonsuz) |
| `home/cta-banner.tsx` | Foto arka planlı banner → düz `#2e4a5c` zemin rezervasyon bandı: dev serif `tel:` numara + check-in/out + "3.500 TL'den başlayan · kahvaltı dahil" + /reservation'a hayalet CTA |
| `home/location-section.tsx` | Sadeleşir: hairline liste + Maps linki korunur |
| `home/gallery-strip.tsx` | Mozaik kalır; çerçeve/gölge sadeleşir |
| `home/ambient-sound.tsx` | Davranış korunur; düğme stili yeni dile uyarlanır |
| `layout/footer.tsx` | Hairline üst çizgili sade üç sütun; sosyal ikonlar küçülür/metinleşir; "Turizm Lisans No: 24921" eklenir |
| `layout/back-to-top.tsx`, `layout/sticky-booking-cta.tsx` | Davranış korunur, stil yeni dile uyarlanır |

`page-hero.tsx` ve booking bileşenleri Faz 1'de yapısal olarak DEĞİŞMEZ
(token değişiminden otomatik renk alırlar).

## 4. Hareket

- Mevcut animasyon yaklaşımı korunur; yeni eklenen geçişler yalnızca
  `transform`/`opacity`.
- `prefers-reduced-motion` desteği mevcut — korunur ve yeni animasyonlara da
  uygulanır.

## 5. Medya ve performans

- **Videolar yeniden kodlanmaz** (`public/img/otel-video.mp4` 5.4 MB,
  `havuz-video.mp4` 3.1 MB — kalite korunur).
- **Hero poster sorunu:** `hero.JPG` 7.9 MB ve `<video poster>` olarak
  kullanılıyor. Kalite gözle korunarak web boyutuna indirilen bir kopya
  (`public/img/hero-poster.jpg`, hedef ≤ 500 KB, 1920w) üretilir ve poster
  bu kopyayı gösterir. Orijinal dosya silinmez.
- Diğer 7–8 MB'lık JPG'lerin optimizasyonu Faz 2'ye not edilir (bu spec'te
  yalnızca anasayfada above-the-fold olanlar ele alınır).
- Oda görselleri Jollytur CDN'de — Faz 1'de kalır; sahibi kendi fotoğraflarını
  sağladığında yerelleştirilecek (bilinen konu).

## 6. Korunanlar / Değişmeyenler

- Rezervasyon akışı, API route'ları, Google Sheets/mail entegrasyonu, admin —
  hiçbirine dokunulmaz.
- `src/app/layout.tsx` font kurulumu (Cormorant + DM Sans) korunur.
- SEO: `robots.ts`, `sitemap.ts`, metadata yapıları korunur.
- Component sınırları korunur — dosyalar yeniden adlandırılmaz/taşınmaz.
- Kanonik iş bilgileri: AGENTS.md § Kanonik Otel Bilgileri.
- Legacy kök HTML dosyalarına DOKUNULMAZ.

## 7. Kabul kriterleri (Faz 1)

1. `npm run build` hatasız geçer; `npm run dev`'de anasayfa hatasız açılır.
2. Sitede mat altın (#a38b5f ailesi) hiçbir yerde görünmez; vurgu her yerde
   `#2e4a5c` ailesidir (token değişimi tüm sayfalara yansır).
3. Anasayfa: topbar yok; telefon navbarda `tel:` linkiyle; hero kopyası
   sadeleşmiş; booking strip çalışır durumda.
4. 3 oda kanonik adlarıyla editoryal satırlarda; rezervasyon bandındaki
   numara tıklanınca arama başlatır; /reservation linki çalışır.
5. Hero poster ≤ 500 KB; video orijinal kalitede oynar;
   `prefers-reduced-motion`'da statik görsele düşer.
6. 320–1440px arasında yatay scroll yok; mobil menü ve sticky booking CTA çalışır.
7. Booking akışı görsel olarak bozulmaz (renkler değişir, düzen bozulmaz) —
   arama → oda seçimi → form → özet manuel test edilir.
8. Konsol hatası yok; Lighthouse'ta anasayfa CLS'i kötüleşmez.

## 8. Faz 2 (onay sonrası)

İç sayfalar (`page-hero` dahil) + booking akışı UI rafinesi + token anlamsal
yeniden adlandırma (`gold` → `accent`) + büyük JPG optimizasyonu + Jollytur
görsellerinin yerelleştirilmesi (sahibinden fotoğraf geldiğinde).
