# "Assos Sessizliği" — Sessiz Lüks Yeniden Tasarımı (Design Spec)

**Tarih:** 2026-07-02
**Kapsam (Faz 1):** `index.html` + `css/style.css` (+ küçük `js/app.js` eklentisi)
**Kapsam (Faz 2, Faz 1 onayı sonrası):** `about.html`, `rooms.html`, `reservation.html`, `contact.html`
**Esin:** Aman Resorts / Six Senses "sessiz lüks" estetiği

## Amaç

Mevcut altın/koyu "premium otel template" görünümünü, Assos taş oteli kimliğine
uygun, fotoğraf ve video öncelikli, sakin ve editoryal bir tasarıma dönüştürmek.
Telefon-öncelikli rezervasyon modeli tasarımın merkezinde kalır.

## Onaylanmış kararlar

| Karar | Seçim |
|---|---|
| Estetik yön | Sessiz lüks (Aman tarzı) |
| Renk paleti | Deniz & taş |
| Kapsam | Önce anasayfa, onay sonrası diğer sayfalar |
| Hero | Hibrit: foto anında açılır, video yüklenince yüksek kaliteli loop'a geçer |
| Teknik yaklaşım | Yeni HTML iskeleti + yeni CSS token sistemi (statik mimari + Bootstrap grid korunur). Faz 1'de yeni tasarım ayrı dosyada (`css/quiet.css`) yaşar; `index.html` yalnızca onu yükler, eski sayfalar `css/style.css` ile değişmeden çalışır. Faz 2'de tüm sayfalar `quiet.css`'e geçer ve `style.css` emekli edilir |
| Başlık fontu | Cormorant Garamond (Montserrat gövde metin olarak kalır) |
| Video kalitesi | **Kalite düşürülmez.** Sıkıştırma/kırpma yok; poster foto yükleme süresini maskeler |

## 1. Tasarım dili

### Renk tokenları

```css
--bg:      #f4f2ee;  /* kırık beyaz zemin */
--stone:   #cfc8bb;  /* taş grisi — ayraç, ikincil yüzey */
--accent:  #2e4a5c;  /* derin Ege mavisi — tek vurgu rengi */
--ink:     #22211f;  /* metin */
--line:    #d9d2c5;  /* 1px hairline çizgiler */
```

- Altın (`#e4a00e`) tamamen kaldırılır.
- Vurgu rengi yalnızca: rezervasyon bandı zemini, linkler, ince detaylar.
- Kart, `box-shadow`, `border-radius` kullanılmaz. Ayrım; boşluk, hairline
  çizgi ve tam genişlik görsellerle sağlanır.

### Tipografi

- **Başlıklar:** Cormorant Garamond (Google Fonts, `display=swap`), ağırlık 400–500.
- **Gövde:** Montserrat 300/400 (mevcut).
- **Hero başlık ölçeği:** `clamp(3rem, 8vw, 6.5rem)`.
- **Etiketler (eyebrow):** küçük boy, geniş harf aralığı (4–5px), büyük harf,
  taş grisi veya mavi.
- Bölüm dikey boşlukları: 120–160px desktop, ~80px mobil.

## 2. Anasayfa kurgusu

Sırasıyla:

1. **Nav** — Topbar kaldırılır; telefon numarası nav'ın sağ ucuna taşınır
   (`tel:` link). Hero üzerinde şeffaf/beyaz metin; scroll'da `--bg` zemin +
   ink metin + 1px alt çizgi. Mobilde tam ekran overlay menü.
2. **Hero (tam ekran)** — Poster: kuşbakışı drone fotoğrafı (anında görünür).
   `otel videosu.mp4` arka planda yüklenir; oynatılabilir olduğunda yumuşak
   opacity geçişiyle sessiz (`muted playsinline loop`) yüksek kaliteli loop
   olarak devreye girer. Tek satır serif başlık + tek hayalet CTA
   ("Odaları Keşfedin"). Mevcut stats bar hero'dan kaldırılır.
3. **Manifesto** — Ortalanmış, maks. ~640px genişlikte, 2–3 cümlelik serif
   giriş metni. Üstünde küçük "ASSOS · ÇANAKKALE" etiketi.
4. **Tam genişlik görsel bant** — `havuz videosu.mp4` sessiz loop veya
   tıkla-oynat; `prefers-reduced-motion`'da statik havuz fotoğrafı.
5. **Odalar (editoryal satırlar)** — 3 oda, kart yerine tam genişlik zigzag
   satırlar: bir yanda büyük fotoğraf, diğer yanda oda adı, m², kapasite,
   manzara bilgisi ve ince çizgi ayraçlar. Hover'da fotoğrafta hafif scale
   (transform-only). Oda adları AGENTS.md'deki kanonik adlardır.
6. **Deneyim** — İkon gridi yerine: bir yanda fotoğraf, diğer yanda sade
   tipografik liste (kahvaltı dahil, açık havuz, restoran, otopark,
   Kadırga Koyu'na 5 km, 7/24 resepsiyon).
7. **Rezervasyon bandı** — Tam genişlik `--accent` zemin; ortada dev serif
   telefon numarası (`tel:+905010913417`), altında check-in/out ve
   "kahvaltı dahil" notu. Telefon-öncelikli modelin vitrini.
8. **Konum + Footer** — Drone fotoğrafı üzerinde adres ve Google Maps linki.
   Footer: tek satırlı sade bilgi mimarisi, hairline ayraçlar,
   Turizm Lisans No: 24921.

## 3. Hareket ve performans

- AOS kaldırılır ya da yalnızca `fade-up` + kısa süreye indirgenir; tercihen
  küçük bir IntersectionObserver ile değiştirilir.
- `prefers-reduced-motion: reduce` → tüm animasyonlar kapalı, hero videosu
  hiç başlatılmaz, poster foto kalır.
- **Video: orijinal kalite korunur** (6 MB otel videosu, 3 MB havuz videosu).
  Kalite düşüren yeniden kodlama yapılmaz. Hero video `preload="none"` ile
  başlar; sayfa yüklendikten sonra JS ile yüklenir, `canplaythrough` olayında
  fade-in ile gösterilir.
- Video dosyaları URL-güvenli adlara kopyalanır/yeniden adlandırılır
  (örn. `img/otel-video.mp4`, `img/havuz-video.mp4` — Türkçe karakter ve
  boşluk içeren adlar URL'lerde sorun çıkarır).
- Alt fold görseller `loading="lazy"` + `width`/`height` öznitelikleri.
- Poster drone fotoğrafı web için optimize edilir (görsel kalite korunarak
  yeniden boyutlandırma; hedef ~300–500 KB).

## 4. Erişilebilirlik

- Sayfa başına tek H1, hiyerarşik başlıklar.
- Görünür focus halkaları (`:focus-visible`, mavi vurgu).
- Kontrast: `--ink` / `--bg` ve beyaz / `--accent` AA'yı geçer; taş grisi
  yalnızca dekoratif/büyük öğelerde kullanılır.
- Hero videoda ses yok; bilgi taşıyan içerik videoya gömülmez.
- Anlamlı `alt` metinleri; dekoratif görsellerde boş `alt`.

## 5. Korunanlar / Değişmeyenler

- Statik HTML + Bootstrap grid + vanilla JS mimarisi.
- `js/booking-config.js` ve `data-karadut-booking` link yeniden yazma davranışı.
- SEO metadata, schema.org JSON-LD, canonical URL'ler (görsel referansları
  yeni dosya adlarına güncellenir).
- Kanonik iş bilgileri (AGENTS.md § Kanonik Otel Bilgileri).
- `tel:` telefon CTA'ları; sahte form/ödeme yok.

## 6. Kabul kriterleri (Faz 1)

1. Anasayfa yeni palet ve tipografiyle açılıyor; altın rengi hiçbir yerde yok.
2. Hero: foto anında görünüyor; video yüklenince orijinal kalitede loop'a geçiyor.
3. `prefers-reduced-motion`'da video oynamıyor, animasyon yok.
4. Topbar yok; telefon nav'da ve `tel:` linki çalışıyor.
5. 3 oda editoryal satır düzeninde, kanonik adlarla listeleniyor.
6. Rezervasyon bandındaki numara tıklanınca arama başlatıyor.
7. 320px–1440px arasında yatay scroll yok, düzen bozulmuyor.
8. Mevcut nav/scroll/mobil menü JS davranışları hâlâ çalışıyor.
9. Konsol hatası yok.
10. Diğer 4 sayfa henüz eski tasarımda ama kırılmadan çalışıyor: yeni tasarım
    `css/quiet.css` dosyasında yaşar ve yalnızca `index.html` tarafından
    yüklenir; `css/style.css` Faz 1'de hiç değişmez. `js/app.js`'e eklenen
    hero-video kodu, ilgili DOM öğeleri yoksa sessizce çalışmaz (defensive).

## 7. Faz 2 (onay sonrası)

Anasayfa onaylandıktan sonra aynı tasarım sistemi about/rooms/reservation/
contact sayfalarına uygulanır; eski CSS sınıfları temizlenir; `oda videoları.mp4`
rooms sayfasında değerlendirilir.
