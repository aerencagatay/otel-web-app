# Task 02 — Tasarım Sistemi Yenilemesi: Yumuşak Radius Dili, Arama Pill'i, Grid Simetrisi

## Amaç
Sitede şu an bilinçli ama soğuk bir "sıfır radius" dili var (`globals.css` içinde 15+ yerde `border-radius: 0`). Serif tipografi + taş otel sıcaklığıyla çelişen bu keskin dikdörtgen çerçeveler yumuşak, butik-lüks bir dile dönüştürülecek. Ayrıca ana sayfa odalar bölümündeki dikey video ile oda kartları arasındaki yükseklik uyumsuzluğu (asimetri) giderilecek.

## Tasarım yönü (uygulanacak karar — tartışmaya açık değil)
Hedef estetik: "taş dokusu + Ege ışığı + sessiz lüks". Referans his: Aman Resorts / Design Hotels rezervasyon arayüzleri — bol beyaz alan, hap formlu kontroller, çok yumuşak gölgeler, keskin hiçbir köşe yok. Serif başlıklar ve altın vurgu KORUNUR; değişen şey köşe/gölge/çerçeve dilidir.

## Dokunulacak dosyalar
- `src/app/globals.css` (token bloğu + tüm `border-radius: 0` geçişleri)
- `src/components/home/hero-booking-strip.tsx`
- `src/components/home/featured-rooms.tsx`
- `src/components/home/gallery-strip.tsx`
- `src/components/booking/*` (yalnızca class/stil düzeyinde)
- `src/components/layout/navbar.tsx`, `sticky-booking-cta.tsx`, `footer.tsx` (stil düzeyinde)

## Adımlar

### 1. Token sistemi (`globals.css` başına)
```css
:root {
  --radius-xs: 6px;    /* chip içi küçük elemanlar */
  --radius-sm: 10px;   /* input, select, küçük kart */
  --radius-md: 16px;   /* kart, panel */
  --radius-lg: 24px;   /* hero kart, büyük medya */
  --radius-pill: 999px;/* buton, chip, arama barı */
  --shadow-soft: 0 1px 2px rgba(20,18,14,.05), 0 8px 28px rgba(20,18,14,.07);
  --shadow-lift: 0 2px 6px rgba(20,18,14,.06), 0 16px 48px rgba(20,18,14,.12);
  --border-soft: 1px solid rgba(120,110,95,.18); /* sıcak, düşük kontrast */
}
```
Sonra dosyadaki tüm `border-radius: 0` satırlarını bağlamına göre uygun token'la değiştir (input → `--radius-sm`, kart → `--radius-md`, buton → `--radius-pill`). Hiçbir yerde ham px değeri bırakma. Sert `box-shadow` ve yüksek kontrast border'ları yeni token'lara çek.

### 2. Hızlı arama stripini yeniden yapılandır (`hero-booking-strip.tsx`)
Mevcut: beş ayrı keskin kutu + kare siyah "MÜSAİTLİK" butonu. Hedef:
- Tek parça yatay **pill kapsayıcı**: `background: rgba(255,255,255,.92)`, `backdrop-filter: blur(12px)`, `border-radius: var(--radius-pill)` (mobilde `--radius-lg` + dikey stack), `--shadow-lift`.
- İç segmentler (Giriş | Çıkış | Yetişkin | Çocuk | Oda) ayrı kutular DEĞİL; aralarında `1px` dikey ince ayraç (`border-soft`), her segment label'ı üstte 10px uppercase tracking'li, değer altta.
- Native `<input type="date">` yerine `react-day-picker` (v9) ile **tek popover'da range seçimi**: Giriş segmentine tıklayınca takvim açılır, giriş+çıkış tek akışta seçilir. Geçmiş günler disabled. (Fiyat gösterimi Task 05'te bu picker'a eklenecek — picker'ı `src/components/booking/date-range-picker.tsx` olarak ayrı, yeniden kullanılabilir bileşen yaz; rezervasyon sayfasındaki `availability-search.tsx` da aynı bileşeni kullansın.)
- Buton: pill formlu, altın→koyu hover geçişli, `MÜSAİTLİK` yerine `Müsaitliğe bak` (bağırmayan sentence case, ok ikonu).
- Klavye erişimi: popover `Escape` ile kapanır, focus ring görünür.

### 3. Odalar bölümü grid simetrisi (`featured-rooms.tsx`)
Problem: dikey `oda-video.mp4` yüksekliği, yanındaki 3 oda kartıyla hizalanmıyor → dengesiz kompozisyon. Uygulanacak çözüm:
- İki sütunlu grid: sol sütun video, sağ sütun 3 oda kartı. Sol hücreye `aspect-ratio: 3/4` + `object-fit: cover` sabitle; sağ sütun `display:grid; grid-template-rows: repeat(3, 1fr); gap` ile videonun toplam yüksekliğine eşitlenir (`h-full`).
- Mobilde: video `aspect-video`'ya kırpılır ve kartların üstünde tek sütun.
- Video: `preload="metadata"`, `poster` attribute'u (Task 06 poster üretecek; şimdilik mevcut kare), `muted loop playsInline`, görünür alana girince oynat (IntersectionObserver) — sayfa açılışında bant genişliği yakmasın.
- Oda kartları `--radius-md`, görsel üst köşeleri kartla aynı radius, hover'da `--shadow-lift` + görselde hafif scale (1.03, `transition 400ms`). `prefers-reduced-motion` durumunda scale kapalı.

### 4. Galeri (`gallery-strip.tsx`)
Rastgele yükseklikler yerine tanımlı kompozisyon: masaüstünde `grid-cols-4` üzerinde 1 büyük (2×2, `aspect-square`) + 3 normal (`aspect-[4/5]`) düzeni; tüm hücreler `object-cover`, `--radius-md`. Başlık overlay'leri alt gradient üzerinde.

### 5. Tutarlılık taraması
Tüm sayfalarda (about, rooms, reservation, contact, admin login) kalan keskin köşe/kutu var mı diye tara; buton ve input class'larının tek kaynaktan (`globals.css`'teki `.form-input`, `.btn` benzeri utility'ler) beslendiğini garanti et. Admin paneli fonksiyonel kalsın, ona minimum dokun.

## Yapma (scope dışı)
- Renk paletini ve tipografiyi değiştirme (mevcut serif + altın kimlik korunacak).
- Yeni sayfa/route ekleme.
- Fotoğraf değiştirme (Task 03), fiyat takvimi (Task 05).

## Kabul kriterleri
- `globals.css`'te `border-radius: 0` kalmaz; tüm radius değerleri token üzerinden gelir.
- Ana sayfa odalar bölümünde video ve kart sütunu piksel düzeyinde aynı yüksekliktedir (masaüstü 1440px'te doğrula).
- Arama stripi tek parça pill olarak render olur, range picker tek popover'da çalışır ve seçim `/reservation?checkIn=...&checkOut=...&auto=1` akışını bozmaz.
- 390px mobilde arama stripi dikey stack'te taşmadan çalışır.
- Lighthouse "Cumulative Layout Shift" ana sayfada 0.1 altı (aspect-ratio sabitlemenin yan faydası).
