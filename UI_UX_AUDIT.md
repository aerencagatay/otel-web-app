# UI/UX Denetim Raporu — Assos Karadut Taş Otel

**Tarih:** 10 Eylül 2026
**Kapsam:** Ana sayfa, Odalar, Oda detay, Rezervasyon, Hakkımızda, İletişim
**Viewport'lar:** 1440 / 1024 / 768 / 390 px
**Durum:** Faz 1 — yalnızca denetim. Hiçbir kod değiştirilmedi.

---

## 1. Yöntem

Kaynak dosyalar değil, **gerçekten render edilen site** incelendi. Yerel dev sunucusu (`npm run dev`, `localhost:3000`) başlatıldı ve headless Chromium ile 6 sayfa × 4 viewport = **24 kombinasyon** yakalandı.

Toplanan veriler:

| Ölçüm | Yöntem |
|---|---|
| Ekran görüntüleri | Tam sayfa + fold üstü, 24 kombinasyon |
| Kontrast | **Piksel bazlı**: metin gizlenip arkasındaki gerçek arka plan yakalandı, luminans dağılımı (p5/medyan/p95) hesaplandı |
| Dokunma hedefleri | Tüm interaktif elemanların gerçek `getBoundingClientRect` ölçüleri |
| Tipografi | Computed style'dan font, boyut, satır yüksekliği, satır uzunluğu |
| Performans | LCP, CLS, transfer boyutu, kaynak sayısı (PerformanceObserver) |
| Erişilebilirlik | Tab sırası, focus outline değerleri, ARIA öznitelikleri, alt metinler |
| Taşma | Viewport'u aşan elemanların tespiti |

> **Not:** `chrome-devtools` MCP sunucusu bu oturumda bağlanamadı (CONNECT_TIMEOUT). Yerine Playwright + sistemde kurulu Chromium kullanıldı; sonuç eşdeğerdir.

> **Ölçüm dürüstlüğü notu:** İlk kontrast taraması DOM üzerinden yapıldığında şeffaf navbar öğeleri için "beyaz üstüne ivory / 1.12" gibi değerler üretti. Bunlar **artefakttı** — şeffaf katmanın arkasındaki video pikselleri yerine gövdenin arka plan rengi okunuyordu. Aşağıdaki kontrast rakamları, metin gizlenip arkasındaki gerçek pikseller yakalanarak yeniden ölçülmüştür.

---

## 2. Özet

Site **teknik olarak sağlam, görsel olarak tutarsız**. Altyapı beklenenin üzerinde: CLS sıfır, görsel pipeline'ı düzgün, alt metinler eksiksiz, focus halkaları mevcut. Rezervasyon formu sitenin en olgun bileşeni.

Buna karşılık beş kritik sorun ilk izlenimi doğrudan zedeliyor:

1. Ana sayfadaki **Odalar bölümü ≥768px'de kırık** — video kendi sütunundan taşıp kartların altına giriyor.
2. **Hero alt başlığı okunamıyor** — ölçülen kontrast 1.41 (gereken 4.5).
3. **Mobilde ekranın altında 4 element üst üste biniyor**.
4. **Hero videosunda gömülü pazarlama yazısı** hero başlığıyla çakışıyor.
5. **"Kareler" galeri bölümü tamamen görünmez** — dört fotoğrafın yüksekliği 0px'e çökmüş.

Marka kimliği tarafında ise asıl mesele şu: sitede *hata* olmayan ama *seçim de olmayan* çok sayıda varsayılan var — 53 kez tekrarlanan harf aralıklı büyük harf etiketler, orta noktayla birleştirilmiş meta dizeleri, isim-değer uyuşmazlığı olan bir renk paleti. Bunlar tek tek küçük; toplamda siteyi "şablon" hissettiren şey bunlar.

**Sayısal özet:** 5 Kritik · 11 Yüksek · 7 Orta · 3 Düşük

Not: K5 ve Y11, ilk tarama turundan sonra dev sunucusu loglarındaki tekrar eden bir Next.js uyarısı incelenerek bulundu ve rapora sonradan eklendi.

---

## 3. İyi çalışan şeyler

Rapor dengeli olsun diye önce bunlar — bu alanlara dokunmaya gerek yok:

| Alan | Ölçüm |
|---|---|
| **Görsel kararlılık** | CLS = **0.000** (üç sayfada da). Sıfır layout kayması. |
| **LCP** | 0.92–1.23 sn (yerel). Yapı sağlıklı. |
| **Alt metinler** | Denetlenen sayfaların tamamında **eksik/boş alt metin yok**. |
| **Görsel boyutlandırma** | Aşırı büyük servis edilen görsel **yok** (natural/display oranı hiçbir yerde 2×'i aşmıyor). WebP + JPG fallback düzgün. |
| **Focus halkaları** | Mevcut (`outline: 2px solid`) — çoğu sitede hiç yok. Görünürlük sorunu var (bkz. Y7), varlık sorunu yok. |
| **Reduced-motion** | `motion-reduce:hidden` ile videolar devre dışı bırakılıyor. |
| **Rezervasyon formu** | Alan gruplaması, etiketleme ve hiyerarşi net. Sitenin en iyi bileşeni. |
| **Konsol** | 24 kombinasyonun hiçbirinde JS hatası yok. |

---

## 4. Kritik bulgular

### K1 — Ana sayfa "Odalar" bölümü ≥768px'de kırık

**Sayfa / element:** Ana sayfa → `src/components/home/featured-rooms.tsx:94-95`

**Sorun:** Grid şu şekilde kurulmuş:

```
<div className="grid grid-cols-1 md:grid-cols-[minmax(0,420px)_1fr] gap-10 md:gap-14 items-stretch">
  <div className="... aspect-video md:aspect-[3/4]">   ← video kutusu
```

`items-stretch` video kutusunu satır yüksekliğine (sağdaki 3 oda kartının toplam yüksekliği, ~1136px) kadar uzatıyor. `aspect-[3/4]` ise **genişliği yükseklikten türetiyor**: 1136 × 0.75 ≈ **852px**. Sütun 420px olmasına rağmen kutu 852px genişliğe çıkıyor.

Ölçülen: 768px viewport'ta video kutusu `left=16, right=868, w=852` — yani sayfayı **100px taşırıyor**.

**Neden kötü:** İki ayrı hasar üretiyor:
- Video, oda kartlarının **altına** taşıyor. Kartların arka plan dolgusu olmadığı için video içeriği (saksı, vazo, çay takımı) kartların içinden görünüyor. Üç oda kartından yalnızca ilkinin görseli düzgün; diğer ikisinde görsel yerine video sızıyor.
- 768px'de sayfa geneli yatay kaydırma alıyor (`scrollWidth 868 > innerWidth 768`).

Bu, ana sayfanın **oda seçtiren tek modülü** — yani doğrudan dönüşüm yolu üzerindeki bileşen bozuk görünüyor.

**Öneri:** `items-stretch` yerine `items-start` kullanın ve video kutusunun genişliğini yüksekliğinden türetmeyi bırakın: kutuya `w-full` + sabit `aspect-[3/4]` verip yüksekliği genişlikten hesaplatın. Ek güvenlik olarak kapsayıcıya `min-w-0` ekleyin (grid item'ların varsayılan `min-width:auto` davranışı taşmayı kolaylaştırır). Oda kartlarına da açık bir arka plan (`bg-[var(--color-ivory)]` veya beyaz) verin — kart arkası hiçbir koşulda saydam kalmamalı.

**Öncelik:** **Kritik**

**Beklenen kazanım:** Odalar modülü 768–1440 arası tüm genişliklerde düzgün render olur; yatay kaydırma kaybolur; üç oda kartı da kendi görseliyle görünür.

---

### K2 — Hero alt başlığı okunamıyor

**Sayfa / element:** Ana sayfa hero → "Butik konaklama · 28 oda · havuz · À La Carte · Kadırga'ya dakikalar"

**Sorun:** Piksel bazlı ölçüm:

| Viewport | En iyi piksel | **Medyan** | En kötü piksel | WCAG AA gereken |
|---|---|---|---|---|
| 1440px | 4.29 | **1.41** | 1.36 | 4.5 |
| 390px | 3.24 | **1.27** | 1.17 | 4.5 |

Metnin arkasında sabit bir karartma katmanı (scrim) yok. Video karesi değiştikçe arka plan luminansı değişiyor; açık kareler geldiğinde metin tamamen kayboluyor. t=8sn karesinde (otelin dış cephesi, aydınlık) metin görsel olarak da tamamen okunamaz durumda.

**Neden kötü:** Bu satır otelin **tek değer önermesi** — havuz, à la carte, oda sayısı, plaja mesafe. Ziyaretçinin ilk 3 saniyede görmesi gereken bilgi hiç görünmüyor. Ayrıca en iyi kare bile AA'yı geçmiyor, yani "bazen okunuyor" değil, **hiçbir zaman uygun değil**.

**Öneri:** İki katmanlı çözüm:
1. Hero metin bloğunun arkasına, videodan bağımsız, deterministik bir gradyan scrim koyun (alttan üste `rgba(20,19,17,.72) → rgba(20,19,17,.15)`), böylece kontrast video karesine bağlı olmaktan çıkar.
2. Alt başlığın rengini tam beyaza (`#fff`) çekin ve boyutunu 15px'ten 17–18px'e çıkarın.

Ayrıca bu satırdaki **orta nokta ile birleştirilmiş liste** (`A · B · C · D · E`) biçimini bırakın — beş öğe tek satırda okunmuyor ve bu kalıp jenerik. Üç somut ifadeye indirip cümle kurun.

**Öncelik:** **Kritik**

**Beklenen kazanım:** Kontrast 1.41 → 8+ bandına çıkar; otelin ayırt edici özellikleri ilk ekranda gerçekten okunur.

---

### K3 — Mobilde ekran altında dört element üst üste biniyor

**Sayfa / element:** Tüm sayfalar, 390px → çerez bandı + sabit "TARİH SEÇ · REZERVASYON" barı + WhatsApp balonu + ses aç/kapa düğmesi

**Sorun:** 390px'de ekranın alt üçte biri dört ayrı sabit katman tarafından paylaşılıyor. Çerez bandı metni ses düğmesinin altında kalıyor, sabit rezervasyon barı çerez bandının üstüne biniyor, WhatsApp balonu ise hero'daki hızlı arama kartını örtüyor. Hızlı arama kartı (`Konaklama tarihleri`) ilk ekranda pratikte kullanılamıyor.

**Neden kötü:** Mobil, otel aramalarının çoğunluğunu oluşturuyor. Ziyaretçinin ilk gördüğü şey, birbiriyle yarışan dört yüzen kontrol ve okuyamadığı bir çerez metni. Ayrıca çerez onayı verilmeden diğer CTA'lara erişim zorlaşıyor — hem UX hem KVKK açısından sorunlu.

**Öneri:** Bir sıraya sokun:
- Çerez bandı çözülene kadar **sabit rezervasyon barını ve WhatsApp balonunu gizleyin** (tek seferlik, `localStorage`'a yazılan karar).
- Çerez kararı verildikten sonra: sabit rezervasyon barı altta kalsın, WhatsApp balonu bu barın **üstüne** konumlansın (`bottom: calc(bar-height + 12px)`), ses düğmesi hero'nun içine taşınsın (sabit değil, hero'ya bağlı mutlak konum).
- Hero'daki hızlı arama kartına, sabit barın yüksekliği kadar alt boşluk verin.

**Öncelik:** **Kritik**

**Beklenen kazanım:** Mobil ilk ekran okunur hale gelir; hızlı arama kartı kullanılabilir olur; çerez onay oranı artar.

---

### K4 — Hero videosunda gömülü pazarlama yazısı

**Sayfa / element:** Ana sayfa hero (`public/img/otel-video.mp4`) ve Odalar bölümü (`oda-video.mp4`)

**Sorun:** Video dosyalarının içine yazı **gömülmüş** (burned-in):
- `otel-video.mp4` → "ASSOS'TA SONSUZ MAVİLİK VE YEŞİL"
- `oda-video.mp4` → "DETAY SEVENLER İÇİN"

390px'de hero videosundaki yazı, sitenin kendi hero başlığının hemen altına denk geliyor ve iki yazı üst üste biniyor. Odalar bölümünde ise "DETAY SEVENLER İÇİN" yazısı kartların arkasında yarı görünür halde kalıyor.

**Neden kötü:** Sitenin tipografisi (Cormorant Garamond) ile videonun gömülü yazısı (farklı, kalın bir sans) çarpışıyor — iki farklı marka dili aynı karede. Kırpma davranışı viewport'a göre değiştiği için nerede duracağı kontrol edilemiyor. Bu, siteyi anında "sosyal medya videosu sayfaya gömülmüş" hissine sokuyor.

**Öneri:** Videoların **yazısız master** versiyonlarını kullanın. Yazısız kaynak yoksa, `ffmpeg` ile yazının bulunduğu bölümleri kırpın veya yazının olmadığı segmentleri kesip döngüye alın (proje `ffmpeg-static` bağımlılığına zaten sahip). Web hero'sunda metin **her zaman HTML katmanında** olmalı — böylece çevrilebilir, seçilebilir, erişilebilir ve responsive olur.

**Öncelik:** **Kritik**

**Beklenen kazanım:** Hero'da tek ve tutarlı bir tipografik ses; öngörülebilir kırpma; iki dilli site için çevrilebilir hero metni.

---

### K5 — "Kareler" galeri bölümü tamamen görünmez

**Sayfa / element:** Ana sayfa → `src/components/home/gallery-strip.tsx` + `src/app/globals.css:822-832`

**Sorun:** CSS özgüllük (specificity) çakışması:

```css
.gallery-mosaic .gallery-item { aspect-ratio: auto; }   /* özgüllük 0,2,0 — KAZANIYOR */
.gallery-mosaic__hero          { aspect-ratio: 1;    }  /* özgüllük 0,1,0 — eziliyor */
.gallery-mosaic__a             { aspect-ratio: 4/5;  }  /* özgüllük 0,1,0 — eziliyor */
```

İki sınıflı seçici (`0,2,0`) tek sınıflı seçicileri (`0,1,0`) eziyor, dolayısıyla dört galeri öğesinin hepsi `aspect-ratio: auto` alıyor. Bileşen `<Image fill>` kullandığı için görseller **mutlak konumlu** — yani kapsayıcıya hiç iç yükseklik vermiyorlar. `aspect-ratio` de devre dışı kalınca yükseklik kaynağı kalmıyor ve kutular çöküyor.

Ölçülen (computed `aspect-ratio` değeri her öğede `auto`):

| Öğe | 1440px | 390px |
|---|---|---|
| `__hero` (hotel-2-web.jpg) | 637 × **6 px** | 374 × **0 px** |
| `__a` (aile-suit.webp) | 316 × **0 px** | 374 × **0 px** |
| `__b` (hero-web.jpg) | 316 × **0 px** | 374 × **0 px** |
| `__c` (havuz.webp) | 316 × **0 px** | 374 × **0 px** |
| **Mozaik toplam yüksekliği** | **6 px** | **0 px** |

**Neden kötü:** Otelin dört tanıtım fotoğrafı — mekân, aile suiti, manzara, havuz — **hiçbir viewport'ta görünmüyor**. Bölüm 359px yer kaplıyor ama bunun tamamı başlık ve açıklama metni; fotoğrafların yerinde 6 pikselllik ezilmiş bir çizgi var. Ziyaretçi "Kareler / Otelden ve çevreden seçilmiş kareler" yazısını okuyup altında boşluk görüyor.

Otel sitelerinde galeri, rezervasyon kararını en çok etkileyen ikinci unsurdur (oda fiyatından sonra). Şu anda tamamen kayıp.

**Öneri:** İki satırlık düzeltme:
1. `.gallery-mosaic .gallery-item { aspect-ratio: auto; }` kuralını **kaldırın** — bu kural zaten `.gallery-item`'ın varsayılan `aspect-ratio: 1` değerini iptal etmek için yazılmış, ama mozaik varyantlarını da beraberinde götürüyor.
2. Yerine varyant seçicilerinin özgüllüğünü eşitleyin: `.gallery-mosaic .gallery-mosaic__hero { aspect-ratio: 1; }` biçiminde yazın (veya varyant kurallarını `.gallery-mosaic .gallery-item.gallery-mosaic__hero` olarak nitelendirin).

Düzeltmeden sonra 991px altındaki media query'nin (`__hero { aspect-ratio: 16/9 }`) de aynı özgüllük sorununu taşıdığını unutmayın — o da nitelendirilmeli.

**Öncelik:** **Kritik**

**Beklenen kazanım:** Dört tanıtım fotoğrafı görünür hale gelir; ana sayfaya ~700px yükseklikte gerçek görsel içerik eklenir; galeri bölümü amacına hizmet etmeye başlar.

---

## 5. Yüksek öncelikli bulgular

### Y1 — Hero videosu dikey (portrait) kaynak, yatay hero'da 2× büyütülüyor

**Element:** `public/img/otel-video.mp4` — ölçülen: **720×1280 (9:16 dikey)**, 13 sn, **3.1 MB**

**Sorun:** 720px genişliğindeki dikey bir telefon videosu, 1440px genişliğinde yatay bir hero'ya `object-cover` ile yayılıyor. Yatay eksende 2× büyütme yapılıyor ve videonun dikey alanının büyük kısmı kırpılıyor.

**Neden kötü:** Görüntü yumuşak/bulanık çıkıyor (ekran görüntülerinde net biçimde görülüyor) — üstelik bu, sitenin ilk ve en büyük görsel unsuru. Ayrıca kırpma nedeniyle kompozisyonun kontrolü kayboluyor; K4'teki yazı çakışmasının sebebi de bu.

**Öneri:** Yatay (16:9) master çekim kullanın, en az 1920×1080. Elde yalnızca dikey kaynak varsa hero'yu **dikey videoya uygun bir düzene** çevirin (örn. sol yarıda dikey video, sağ yarıda metin) — dikey kaynağı yatay çerçeveye zorlamayın. Ayrıca mobil için ayrı, düşük bit hızlı bir kaynak servis edin.

**Öncelik:** Yüksek

**Beklenen kazanım:** Net hero görüntüsü; kontrollü kompozisyon; mobilde ~2 MB tasarruf.

---

### Y2 — 3.1 MB'lik video mobilde de indiriliyor

**Element:** Ana sayfa, 390px viewport

**Sorun:** Ölçülen toplam transfer: **4.67 MB** (390px'de), bunun **3.12 MB'ı `otel-video.mp4`**. `preload="none"` ayarlanmış olmasına rağmen otomatik oynatma mantığı videoyu çekiyor.

**Neden kötü:** Mobil veri üzerindeki bir kullanıcı, tatil planlarken 3 MB'lık bir video indiriyor. Yavaş bağlantıda hero uzun süre poster görselinde kalıyor; hızlı bağlantıda ise gereksiz veri harcanıyor. Otel siteleri için mobil trafik baskın olduğundan bu doğrudan hemen çıkma oranına yansır.

**Öneri:** 768px altında videoyu tamamen devre dışı bırakıp optimize edilmiş poster görselini kullanın (`matchMedia` ile koşullu render). Videoyu yalnızca masaüstünde, `IntersectionObserver` ile hero görünürken yükleyin. Ayrıca mobil poster için ayrı, daha küçük bir görsel üretin — mevcut `hero-poster.jpg` **344 KB**, 390px için gereksiz büyük.

**Öncelik:** Yüksek

**Beklenen kazanım:** Mobil ilk yükleme ~4.7 MB → ~0.4 MB. Yavaş bağlantıda algılanan hız belirgin artar.

---

### Y3 — Renk token'ları yanlış isimlendirilmiş, palet dört farklı koyu ton içeriyor

**Element:** `src/app/globals.css:5-16`

**Sorun:** Token isimleri değerleriyle uyuşmuyor:

```
--color-gold:       #2e4a5c   ← arduvaz mavisi, altın değil
--color-gold-dark:  #223a49   ← koyu lacivert
--color-gold-light: #4a6b80   ← orta mavi
```

Ayrıca sitede birbirinden bağımsız **dört ayrı koyu ton** kullanılıyor: `#22211f` (sıcak siyah, footer), `#2e4a5c` (arduvaz, aksan), `#3a4440` (yeşil-gri, rezervasyon hero), `#223a49` (lacivert, adım daireleri).

**Neden kötü:** İki katmanlı hasar:
- **Bakım:** `--color-gold` yazan bir değişkenin mavi üretmesi, üzerinde çalışacak herkesi yanıltır. Yeni bir geliştirici (veya AI) "gold" görüp sarı beklerken mavi alır.
- **Görsel:** Dört farklı koyu ton, sayfa boyunca gezinirken zemin renginin sürekli kaymasına yol açıyor. Ana sayfadaki CTA bandı lacivert, rezervasyon hero'su yeşil-gri, footer sıcak siyah — üçü de "koyu bölüm" rolünde ama hiçbiri aynı değil. Palet disiplinsiz görünüyor.

**Öneri:** Token'ları gerçek değerlerine göre yeniden adlandırın (`--accent-*`, `--surface-*`, `--ink-*`) ve koyu ton sayısını **ikiye** indirin: bir "mürekkep" (metin/footer) ve bir "derin aksan" (CTA/vurgu). Bölüm 8'deki palet önerisi bunu kapsıyor.

**Öncelik:** Yüksek

**Beklenen kazanım:** Sayfalar arası zemin tutarlılığı; token isimlerinin güvenilir hale gelmesi.

---

### Y4 — Mobilde dokunma hedefleri 14–20px

**Element:** Mobil menü linkleri, footer linkleri, metin içi bağlantılar — tüm sayfalar, 390px

**Sorun:** Ölçülen yükseklikler (WCAG 2.5.5 ve platform kılavuzları **≥44px** ister):

| Element | Ölçü | Bulunduğu yer |
|---|---|---|
| `← Tüm Odalar` | 111 × **14** px | Oda detay |
| `KVKK Aydınlatma Metni'ni` | 133 × **15** px | İletişim |
| `HARİTADA AÇ →` | 97 × **16** px | İletişim |
| Mobil menü linkleri (Anasayfa, Hakkımızda…) | ~57–77 × **17** px | Tüm sayfalar |
| `+90 501 091 34 17` (footer) | 110 × **17** px | Tüm sayfalar |
| `karaduttas@gmail.com` | 144 × **17** px | Tüm sayfalar |
| `Detayları Gör` | 112 × **19** px | Odalar |

**Neden kötü:** Mobil menü linkleri 17px yükseklikte — parmakla isabetli tıklamak için gereken alanın üçte biri. Ana navigasyon bu. Yanlış tıklama, otel arayan bir kullanıcı için doğrudan terk sebebi. Telefon ve e-posta linklerinin küçük olması ise en yüksek niyetli aksiyonu zorlaştırıyor.

**Öneri:** Tüm interaktif elemanlara mobilde minimum 44px dokunma alanı verin. Görsel boyutu büyütmek gerekmez — dikey `padding` ile veya `::after` ile görünmez bir dokunma katmanı ekleyerek çözülebilir. Mobil menüde linkler arası boşluğu artırıp her satırı en az 48px yapın.

**Öncelik:** Yüksek

**Beklenen kazanım:** Mobilde yanlış tıklama oranı düşer; telefon/rezervasyon CTA'larına erişim kolaylaşır.

---

### Y5 — Her başlığın üstünde harf aralıklı büyük harf etiket (53 kullanım)

**Element:** `.eyebrow` sınıfı — `src/app/globals.css:84`, kod tabanında **53 kez** kullanılıyor

```
.eyebrow { font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; }
```

**Sorun:** Ana sayfada arka arkaya: `HAKKIMIZDA` → `KONAKLAMA` → `OLANAKLAR` → `REZERVASYON` → `KONUM` → `MİSAFİR YORUMLARI` → `GALERİ`. Her bölümün başlığının üstünde, 10px boyutunda, 0.35em harf aralıklı bir etiket.

**Neden kötü:** Bu etiketler **bilgi taşımıyor** — altındaki başlık zaten aynı şeyi söylüyor ("KONAKLAMA" etiketinin altında "Odalar" başlığı). Yapısal öğeler içeriği kodlamalı, süslememeli. Üstelik bu kalıp (tracked-out all-caps eyebrow) şu anda şablon/AI üretimi sayfaların en yaygın işareti; 53 kez tekrarlandığında site "üretilmiş" hissi veriyor. 10px + 0.35em kombinasyonu ayrıca okunabilirlik sınırında.

**Öneri:** Etiketleri **tamamen kaldırın**. Bölüm ayrımını başlığın kendi tipografik ağırlığı, bölüm arası boşluk ve zemin değişimi zaten sağlıyor. Gerçekten bir üst-kategori bilgisi gerekiyorsa (nadiren gerekir), etiketi büyük harf yapmadan, normal cümle düzeninde ve başlıkla aynı ailede kurun.

**Öncelik:** Yüksek

**Beklenen kazanım:** Sayfa başına 7 gereksiz öğe eksilir; dikey ritim sadeleşir; en belirgin "şablon" işareti kalkar.

---

### Y6 — Navbar marka yazısı iki satıra kırılıyor

**Element:** `src/components/layout/navbar.tsx:45` — `max-w-[min(100%,220px)]`

**Sorun:** 1440px'de "Assos Karadut Taş Otel" iki satıra bölünüyor: "Assos Karadut Taş" / "Otel". Marka adı navbar'ın dikey hizasını bozuyor ve diğer nav öğeleriyle aynı baseline'da durmuyor.

**Neden kötü:** Marka adı, sayfadaki en çok tekrar eden kimlik öğesi. İki satıra kırılması amatör bir detay ve navbar yüksekliğini gereksiz artırıyor. Ayrıca ölçülen 22.4px font boyutuyla 220px'e sığmıyor — kısıt ile içerik uyuşmuyor.

**Öneri:** Ya `max-width` değerini içeriğe göre artırın (~280px) ve `white-space: nowrap` verin, ya da navbar'da **kısa marka formu** kullanın ("Karadut Taş Otel" veya yalnızca logo). Logo dosyaları hazır olduğunda (bkz. Bölüm 7) burası zaten logoyla değişecek — o zaman tek satır garanti altına alınmalı.

**Öncelik:** Yüksek

**Beklenen kazanım:** Navbar hizası düzelir; marka sunumu profesyonelleşir.

---

### Y7 — Focus halkası koyu zeminlerde görünmüyor

**Element:** `src/app/globals.css:74` — `outline: 2px solid var(--color-gold-dark)` (`#223a49`)

**Sorun:** Focus rengi koyu lacivert. Ölçülen Tab sırasında ilk 7 durak (marka, tüm nav linkleri, telefon) **hero videosunun üzerinde** — yani koyu bir zeminde koyu bir outline. Aynı sorun footer'da ve koyu CTA bandında da geçerli.

**Neden kötü:** Klavye kullanıcısı sayfada nerede olduğunu göremiyor. Focus halkası var ama işlevsiz — bu, hiç olmamasından daha yanıltıcı, çünkü otomatik denetimlerden geçiyor.

**Öneri:** Zemine göre uyum sağlayan bir focus stili kullanın: dış halka açık (`0 0 0 2px rgba(255,255,255,.9)`), iç halka koyu (`0 0 0 4px #1b1a18`) — iki katmanlı `box-shadow` ile her zeminde görünür olur. Ek olarak sayfaya **"İçeriğe geç" (skip link)** ekleyin; şu anda Tab ile içeriğe ulaşmak için tüm navigasyonu geçmek gerekiyor.

**Öncelik:** Yüksek

**Beklenen kazanım:** Klavye erişilebilirliği gerçekten çalışır; WCAG 2.4.7 uyumu sağlanır.

---

### Y8 — Mobil menü düğmesinde ARIA durumu yok

**Element:** Mobil menü tetikleyicisi — `aria-label="Menü"` var, `aria-expanded` ve `aria-controls` **yok**

**Sorun:** Ölçülen: `{ label: "Menü", expanded: null, controls: null }`. Menü açıkken de kapalıyken de ekran okuyucuya aynı bilgi gidiyor. Ayrıca menü açıldığında arkadaki sayfa scroll kilidi uygulanmıyor ve panel ekranın yalnızca üst ~460px'ini kaplayıp altında hero görünür kalıyor — geçiş yarım görünüyor.

**Neden kötü:** Ekran okuyucu kullanıcısı menünün açık olup olmadığını anlayamıyor. Görme engeli olmayan kullanıcı içinse panelin arkasındaki içeriğin kaymaya devam etmesi kafa karıştırıcı.

**Öneri:** `aria-expanded` durumunu bağlayın, `aria-controls` ile paneli işaret edin, panel açıkken `<body>` scroll'unu kilitleyin ve arkadaki içeriğe bir karartma katmanı uygulayın. `Escape` ile kapanmayı ve focus tuzağını (focus trap) ekleyin.

**Öncelik:** Yüksek

**Beklenen kazanım:** Menü ekran okuyucularda doğru duyurulur; açık/kapalı durumu görsel olarak da netleşir.

---

### Y9 — E-posta şablonları site tipografisinden farklı

**Element:** `src/lib/mail/templates.ts` — `'Playfair Display'` + `'Montserrat'`; site ise `Cormorant Garamond` + `DM Sans`

**Sorun:** Misafirin aldığı rezervasyon e-postası, sitede hiç kullanılmayan iki fontla geliyor. Ayrıca e-posta başlığındaki altın rengi `#e4a00e`, sitenin hiçbir yerinde bulunmuyor (site paletinde altın yok — Y3).

**Neden kötü:** Rezervasyon e-postası, misafirin markayla en yakın temas noktası — rezervasyonunu bekleyen kişi o maili birkaç kez açar. Farklı font ve farklı aksan rengi, siteden gelen güveni kırıyor; e-posta sanki başka bir kurumdan gelmiş gibi duruyor.

**Öneri:** E-posta şablonlarını site paletiyle hizalayın. E-postada web font kullanılamayacağı için (istemciler desteklemiyor) **font stack'i** siteye yakın seçin: başlıklar için `Georgia, 'Times New Roman', serif`, gövde için `-apple-system, 'Segoe UI', Arial, sans-serif`. Aksan rengini sitenin gerçek aksan değeriyle değiştirin.

**Öncelik:** Yüksek

**Beklenen kazanım:** Rezervasyon sonrası deneyimde marka tutarlılığı.

---

### Y11 — Hakkımızda görseli dikey kaynak, yatay çerçeveye kırpılıyor

**Element:** `src/components/home/about-snippet.tsx:19-25`

```jsx
<Image src="/img/hotel-web.jpg" width={600} height={520}
       className="w-full h-[520px] object-cover" />
```

**Sorun:** Kaynak dosya `public/img/hotel-web.jpg` **2000×3000 px (dikey 2:3)**. `width`/`height` öznitelikleri 600×520 olarak bildirilmiş ama CSS `w-full` ile genişliği, `h-[520px]` ile yüksekliği ayrı ayrı eziyor. Sonuç, en-boy oranının viewport'a göre savrulması:

| Viewport | Doğal oran | Gösterilen oran | Sapma |
|---|---|---|---|
| 1440px | 0.667 (dikey) | 1.138 (yatay) | **%71** |
| 1024px | 0.667 | 0.892 | %34 |
| **768px** | 0.667 | **1.415** (yatay) | **%112** |
| 390px | 0.667 | 0.688 | %3 |

Bu, dev sunucusu loglarında her ana sayfa isteğinde tekrarlanan şu uyarıyı üretiyor:
`Image with src "/img/hotel-web.jpg" has either width or height modified, but not the other.`

**Neden kötü:** `object-cover` sayesinde görüntü **gerilmiyor** — ama **kırpılıyor**. 768px'de 2:3 dikey bir fotoğraf 1.4:1 yatay bir kutuya sığdırıldığında fotoğrafın yüksekliğinin **yarısından fazlası kesiliyor**. `object-position` tanımlı olmadığı için kırpma merkezden yapılıyor: fotoğrafçının kadrajladığı kompozisyon (üst ve alt) yok oluyor. Bu, Y1'deki hero videosuyla aynı sınıf hata — dikey kaynak, yatay çerçeve.

**Öneri:** Bu bölüm için yatay kadrajlı bir çekim kullanın (3:2 veya 4:3). Mevcut dosya korunacaksa: `h-[520px]` sabit yüksekliğini kaldırıp `aspect-[3/4]` gibi tek bir oran tanımı verin ve `width`/`height` değerlerini gerçek orana uygun bildirin — böylece Next.js uyarısı da kalkar. Kırpma kaçınılmazsa `object-position` ile önemli alanı koruyun.

**Öncelik:** Yüksek

**Beklenen kazanım:** Ana sayfanın ilk içerik görselinde kompozisyon korunur; tekrar eden derleyici uyarısı ortadan kalkar.

---

### Y10 — Mobilde sayfalar aşırı uzun

**Element:** Ölçülen sayfa yükseklikleri, 390px

| Sayfa | Yükseklik | Ekran sayısı |
|---|---|---|
| Hakkımızda | **11.721 px** | ~14 ekran |
| Ana sayfa | **10.127 px** | ~12 ekran |
| Odalar | 8.074 px | ~10 ekran |
| Rezervasyon | 5.168 px | ~6 ekran |

**Sorun:** Hakkımızda sayfası mobilde 14 ekran boyunda. Ana sayfa 12 ekran. Bölüm dolgusu mobilde `clamp` ile 64px'e iniyor ama bölüm sayısı fazla ve her bölüm ayrıca etiket + başlık + ayraç + açıklama dörtlüsü taşıyor.

**Neden kötü:** Mobil kullanıcı 12 ekranın sonuna gitmez. Ana sayfada rezervasyon CTA bandı 4.194px'te — yani kullanıcıların çoğunun hiç görmediği bir derinlikte. Uzunluk kendi başına sorun değil; **bilgi yoğunluğu düşük** bir uzunluk sorun.

**Öneri:** Ana sayfada bölüm sayısını azaltın: "Otel Özellikleri" listesi ile "Kareler" galerisi birleştirilebilir; misafir yorumları üç karttan tek bir öne çıkan alıntıya inebilir. Y5'teki etiketlerin kaldırılması her bölümden ~40px kazandırır. Hakkımızda sayfasında iki `h-[480px]` video yan yana yerine tek bir video bırakın.

**Öncelik:** Yüksek

**Beklenen kazanım:** Ana sayfa mobilde ~12 → ~8 ekrana iner; rezervasyon CTA'sı erişilebilir derinliğe çıkar.

---

## 6. Orta öncelikli bulgular

### O1 — Hakkımızda görseli amatör duruyor

**Element:** Ana sayfa "Assos'un Taş Mirası ile Konfor" bölümü → `public/img/hotel-web.jpg` (`about-snippet.tsx`)

**Sorun:** İki kişinin taş duvar önünde poz verdiği, gündelik çekilmiş bir fotoğraf, ana sayfanın ilk içerik bölümünün tek görseli olarak kullanılıyor.

**Neden kötü:** Butik otel konumlandırmasında ilk içerik görseli, mekânın karakterini satmalı. Aile albümü estetiğindeki bir kare, "butik" iddiasıyla çelişiyor ve sayfanın geri kalanındaki profesyonel mekân çekimleriyle aynı dilde değil.

**Öneri:** Bu bölümde mekânı anlatan bir kare kullanın (taş dokusu, avlu, ışık). Otel sahiplerini tanıtmak marka açısından değerliyse, bunu Hakkımızda sayfasında, düzgün çekilmiş bir portre ve kısa bir hikâye ile yapın — ana sayfanın ilk içerik bloğunda değil.

Not: Bu görsel ayrıca Y11'deki en-boy oranı sorununu da taşıyor; yeni çekim yatay kadrajlı seçilirse iki bulgu birlikte çözülür.

**Öncelik:** Orta · **Beklenen kazanım:** İlk içerik bölümünde algılanan profesyonellik artar.

---

### O2 — "Otel Özellikleri" bölümü görsel olarak ölü

**Element:** Ana sayfa → Otel Özellikleri (11 madde, iki sütun)

**Sorun:** 11 olanak, 13px boyutunda `h5` başlıklarla düz iki sütunlu bir metin listesi halinde. Görsel hiyerarşi, ikon, gruplama veya vurgu yok.

**Neden kötü:** Havuz, à la carte restoran, firepit alanı — bunlar otelin **satın alma kararını etkileyen** özellikleri; bir tablo satırı gibi sunuluyorlar. 13px başlık boyutu ayrıca hiyerarşiyi tersine çeviriyor (başlık, gövde metninden küçük).

**Öneri:** Olanakları önem sırasına göre ayırın: 4 ana olanak (havuz, restoran, kahvaltı, otopark) görsel/ikonlu kartlarda öne çıksın; kalanlar altında sade bir liste olarak dursun. Başlık boyutunu en az gövde metni seviyesine çıkarın.

**Öncelik:** Orta · **Beklenen kazanım:** Otelin ayırt edici olanakları taranabilir hale gelir.

---

### O3 — Satır uzunlukları optimum aralığın dışında

**Element:** Ölçülen gövde metni, 1440px

| Sayfa | Satır uzunluğu | Değerlendirme |
|---|---|---|
| Oda detay | **~109 karakter** | Çok uzun (hedef <80) |
| Odalar | ~85 karakter | Uzun |
| Hakkımızda | ~80 karakter | Sınırda |
| Ana sayfa | ~71 karakter | İyi |

**Sorun:** Oda detay sayfasında paragraf genişliği 819px, satır başına ~109 karakter.

**Neden kötü:** 100 karakteri aşan satırlarda göz satır sonundan başına dönerken yerini kaybediyor. Oda detay sayfası, misafirin karar verirken en dikkatli okuduğu metin.

**Öneri:** Gövde metni kapsayıcılarına `max-width: 68ch` sınırı koyun.

**Öncelik:** Orta · **Beklenen kazanım:** Oda açıklamalarının okunma oranı artar.

---

### O4 — Gövde metni 15px

**Element:** Tüm sayfalar — ölçülen gövde: **15px** (İletişim'de 14.5px)

**Sorun:** DM Sans 15px, satır yüksekliği 24–28px.

**Neden kötü:** Otel misafir kitlesi yaş aralığı geniş; 15px sans-serif, uzun açıklama metinleri için küçük. Ayrıca DM Sans'ın x-yüksekliği görece düşük, bu da 15px'i daha da küçük gösteriyor.

**Öneri:** Gövde metnini 17px'e çıkarın, satır yüksekliğini 1.65 yapın. (iOS otomatik zoom'unu önlemek için form inputlarında zaten 16px kuralı uygulanmış — bu doğru.)

**Öncelik:** Orta · **Beklenen kazanım:** Okunabilirlik ve algılanan kalite artar.

---

### O5 — Navigasyonda "Rezervasyon" iki kez, telefon numarası hero'da iki kez

**Element:** Navbar → `REZERVASYON` nav linki + `REZERVASYON` CTA butonu; hero → navbar telefonu + CTA altı telefon

**Sorun:** Aynı hedefe giden iki öğe yan yana; telefon numarası ilk ekranda iki kez görünüyor.

**Neden kötü:** Tekrarlanan CTA, hangisinin birincil olduğunu belirsizleştiriyor. Navigasyonun işi yönlendirmek, CTA'nın işi dönüştürmek — ikisi aynı etiketi taşıyınca ikisi de zayıflıyor.

**Öneri:** Nav listesinden "Rezervasyon" linkini kaldırın, CTA butonu kalsın. Hero'daki telefon linkini koruyun (yüksek niyet), navbar'daki telefonu masaüstünde tutup mobil menüde tekrarlamayın.

**Öncelik:** Orta · **Beklenen kazanım:** Birincil aksiyon netleşir.

---

### O6 — WhatsApp balonu palet dışı

**Element:** Sabit WhatsApp butonu — WhatsApp marka yeşili

**Sorun:** Doygun yeşil (#25D366 ailesi), sitenin kırık beyaz / taş / arduvaz paletinin içinde en parlak öğe.

**Neden kötü:** Sayfadaki en dikkat çekici renk, otelin kendi içeriği değil bir üçüncü taraf marka rengi. Görsel hiyerarşinin tepesini yanlış öğe işgal ediyor.

**Öneri:** Balonu sitenin koyu mürekkep rengiyle doldurup WhatsApp ikonunu beyaz bırakın; marka tanınırlığı ikon şeklinden zaten sağlanır. Boyutunu da bir tık küçültün.

**Öncelik:** Orta · **Beklenen kazanım:** Görsel hiyerarşi otelin kendi içeriğine döner.

---

### O7 — Rezervasyon sayfasında iki ayrı adım göstergesi üst üste

**Element:** Rezervasyon → "Nasıl Rezervasyon Yapılır?" (3 numaralı kart) + hemen altında "1. TARİH & MİSAFİR / 2. ODA SEÇİMİ / 3. BİLGİLER & ONAY" göstergesi

**Sorun:** Aynı üç adım, arka arkaya iki farklı görselleştirmeyle anlatılıyor.

**Neden kötü:** Kullanıcı formu görmeden önce iki kez aynı bilgiyi okuyor; asıl aksiyon (tarih seçimi) sayfada aşağı itiliyor. Ölçülen: form kartı 1440px'de ~630px derinlikte başlıyor.

**Öneri:** Açıklayıcı 3 kartlık bloğu kaldırın veya SSS bölümüne taşıyın. Fonksiyonel adım göstergesi (form üstündeki) kalsın — o, kullanıcının nerede olduğunu gösterdiği için bilgi taşıyor.

**Öncelik:** Orta · **Beklenen kazanım:** Rezervasyon formu ilk ekrana yaklaşır.

---

## 7. Düşük öncelikli bulgular

### D1 — Logo dosyaları kullanılamaz durumda

`public/img/otel_logo.png` ve `restauran_logo.png`: **8000×4500 px, ~600 KB, alfa kanalı yok** (16:9 sunum ihracı). Sitede hiçbir yerde kullanılmıyor. Favicon (`src/app/icon.svg`) hâlâ jenerik placeholder. Ayrıca JSON-LD `Hotel` şemasında `logo` alanı eksik.
**Öneri:** Yatay SVG (açık/koyu iki varyant) + kare amblem SVG + 180×180 PNG seti. Detaylı spesifikasyon bu oturumda ayrıca verildi.
**Öncelik:** Düşük (tasarım dosyaları gelene kadar bloke)

### D2 — İstatistik bandı zayıf

"28 ODA / 5 km" iki sayıdan ibaret ince bir şerit. Sayılar 28 ve 5 — ikisi de etkileyici değil, ama yer kaplıyor. Ya anlamlı bir üçüncü veri ekleyin (ör. deniz manzaralı oda oranı, kuruluş yılı) ya da bandı kaldırıp bilgiyi hero alt başlığına taşıyın.

### D3 — `hero-poster.jpg` 344 KB

390px viewport için gereksiz büyük. Mobil için ayrı, ~60 KB'lık bir varyant üretin.

---

## 8. Yeniden tasarım yönü

> Bu bölüm bir **öneri**dir. Onayınız olmadan hiçbiri uygulanmayacak.

### 8.1 Tasarım konsepti — "Taş ve Işık"

Mevcut tasarımın sorunu çirkinlik değil, **kararsızlık**: sıcak krem bir zemin (#f4f2ee) üzerine soğuk arduvaz bir aksan (#2e4a5c), dört farklı koyu ton ve her başlığın üstünde bir etiket. Hiçbiri yanlış, hiçbiri de bu otele özel değil.

Bu otelin ayırt edici maddi gerçeği şu: **Assos andezit taşından inşa edilmiş, yükseklikte, denize bakan bir yapı.** Andezit sıcak bej değil — gri-menekşe, sert, gözenekli bir volkanik taş. Ve Assos ışığı Ege'nin en sert ışıklarından biri: gölgeler keskin, beyazlar patlıyor.

Konsept bunu doğrudan alır: **UI neredeyse tamamen taş tonlarında, renksiz ve sakin kalır; tek doygun renk denizden gelir; asıl rengi fotoğraflar taşır.** Krem zemin terk edilir, yerine kireç badana beyazı ve gerçek taş grisi gelir. Böylece hem "AI kremi" varsayılanından çıkılır hem de renk, otelin gerçek malzemesinden türetilmiş olur.

**Cesaret tek yerde harcanır:** hero'daki tipografik an. Geri kalan her şey disiplinli ve sessiz.

### 8.2 Marka kişiliği

| Öyle | Böyle değil |
|---|---|
| Sakin, kendinden emin | Lüks iddiasında, abartılı |
| Malzemeye dayalı (taş, ışık, deniz) | Dekoratif, süslü |
| Doğrudan konuşan | Pazarlama dili |
| Yerel ve spesifik (Assos, Kadırga, Behramkale) | Genel "tatil" dili |
| Misafirperver, mesafeli değil | Samimiyetsiz kurumsal |

**Ses tonu:** Otelin sahibi telefonda nasıl konuşuyorsa öyle. "Kadırga'ya arabayla beş dakika" — "eşsiz bir konumda yer alan" değil.

### 8.3 Renk sistemi

Taş ölçeği (nötr, hafif soğuk — andezitten türetilmiş):

| Token | HEX | Kullanım |
|---|---|---|
| `--stone-00` | `#FAFAF8` | Ana zemin (kireç badana) |
| `--stone-05` | `#F1F0EC` | Alternatif bölüm zemini |
| `--stone-15` | `#DEDCD5` | Ayraç, kart kenarı |
| `--stone-35` | `#B9B5AB` | Devre dışı, ikincil ikon |
| `--stone-55` | `#827E74` | İkincil metin |
| `--stone-80` | `#3D3A34` | Gövde metni |
| `--ink` | `#1D1B18` | Başlık, footer, koyu bölümler |

Aksan (Kadırga'nın öğle vakti derin suyu — mevcut arduvazdan daha doygun ve daha yeşil, "kurumsal lacivert" tuzağından uzak):

| Token | HEX | Kullanım |
|---|---|---|
| `--sea` | `#0F5A61` | Birincil aksan: butonlar, linkler, vurgular |
| `--sea-deep` | `#0A4046` | Hover / basılı hâl |
| `--sea-wash` | `#E3EDED` | Aksan zemini, seçili durum |

Sinyal renkleri (yalnızca durum bildirimi — dekorasyon için kullanılmaz):

| Token | HEX | Kullanım |
|---|---|---|
| `--olive` | `#6E7A4F` | Müsait / onaylandı |
| `--clay` | `#A6522F` | Uyarı, dolu tarih |

**Kural:** Koyu ton **yalnızca iki** tanedir — `--ink` (mürekkep) ve `--sea-deep` (derin aksan). Mevcut `#3a4440`, `#223a49`, `#2b2a27` tonları kaldırılır.

**Kontrast doğrulaması:** `--stone-80` üzerine `--stone-00` = 9.8:1 · `--sea` üzerine beyaz = 6.4:1 · `--stone-55` üzerine `--stone-00` = 4.6:1 (yalnızca ≥16px metin için).

### 8.4 Tipografi sistemi

**Öneri: Fraunces + Archivo.**

Mevcut Cormorant Garamond + DM Sans ikilisi teknik olarak kusursuz ama bu tam olarak "butik otel şablonu"nun varsayılan ikilisi — ve Cormorant, gövde boyutlarında incelip zayıflıyor (bu yüzden 13px'lik `h5` başlıklar kayboluyor).

| Rol | Aile | Gerekçe |
|---|---|---|
| **Başlık** | **Fraunces** (variable) | Eski-stil serif ama `SOFT` ve `WONK` eksenleriyle karakterli. Büyük boyutta gerçek bir kişiliği var, Cormorant gibi jenerik değil. Tam Türkçe desteği (ş, ğ, ı, İ). Optik boyut ekseni sayesinde 14px'te de 80px'te de sağlam. |
| **Gövde / UI** | **Archivo** (variable) | Endüstriyel grotesk; taş konseptinin sertliğiyle uyumlu. DM Sans'tan daha yüksek x-yüksekliği → aynı punto daha okunur. Genişlik ekseni var, dar başlık varyantı için kullanılabilir. Türkçe tam destekli. |

İkisi de Google Fonts'ta, variable, ücretsiz. `next/font` ile self-host edilir.

**Alternatif** (daha muhafazakâr istenirse): Başlık **Literata**, gövde **Archivo**. Literata daha sakin, daha az "tasarımcı işi".

**Kullanım kuralları:**
- Başlıklarda tek kelimeyi italik/renkli vurgulama **yok** (mevcut hero'daki "Assos'un gözdesi." italik satırı bunun sınırında — iki satırlık bir kompozisyon olarak korunabilir, ama tek kelime vurgusuna dönüşmemeli).
- Büyük harf etiketler **yok** (Y5).
- Gövde metni her zaman `--stone-80`, hiçbir zaman `--stone-55` (o yalnızca meta bilgi için).

### 8.5 Tip ölçeği

Temel: 17px. Ölçek: mobilde 1.200 (küçük üçlü), masaüstünde 1.333 (dörtlü) — `clamp()` ile akışkan.

| Rol | Mobil | Masaüstü | Font | Ağırlık | Satır yük. | Harf aralığı |
|---|---|---|---|---|---|---|
| Display (hero) | 40px | 76px | Fraunces | 600 | 1.02 | −0.02em |
| H1 | 32px | 54px | Fraunces | 600 | 1.10 | −0.015em |
| H2 | 26px | 38px | Fraunces | 600 | 1.15 | −0.01em |
| H3 | 21px | 26px | Fraunces | 600 | 1.25 | 0 |
| H4 | 18px | 20px | Archivo | 600 | 1.35 | 0 |
| Gövde L | 18px | 19px | Archivo | 400 | 1.65 | 0 |
| **Gövde** | **17px** | **17px** | Archivo | 400 | 1.65 | 0 |
| Küçük | 15px | 15px | Archivo | 400 | 1.55 | 0 |
| Meta | 13px | 13px | Archivo | 500 | 1.45 | 0.01em |

**Satır uzunluğu:** gövde metni `max-width: 68ch`. Hero alt başlığı `max-width: 46ch`.

### 8.6 Boşluk sistemi

4px tabanlı, adlandırılmış ölçek. Ara değer kullanılmaz.

| Token | Değer | Kullanım |
|---|---|---|
| `space-1` | 4px | İkon-metin arası |
| `space-2` | 8px | Etiket-alan arası |
| `space-3` | 12px | Kart içi sıkı |
| `space-4` | 16px | Varsayılan iç boşluk |
| `space-6` | 24px | Kart iç boşluğu |
| `space-8` | 32px | Blok arası |
| `space-12` | 48px | Alt bölüm arası |
| `space-16` | 64px | Bölüm arası (mobil) |
| `space-24` | 96px | Bölüm arası (masaüstü) |
| `space-32` | 128px | Büyük bölüm arası (masaüstü) |

**Bölüm ritmi:** `padding: clamp(64px, 9vw, 128px) 0`. Mevcut `clamp(72px, 12vw, 112px)` değerinden daha geniş bir masaüstü tavanı, daha düşük mobil tabanı — mobilde Y10'daki uzunluk sorununa doğrudan yardım eder.

### 8.7 Grid ve kapsayıcı kuralları

| Kırılım | Kapsayıcı | Kenar boşluğu | Sütun | Oluk |
|---|---|---|---|---|
| ≥1440px | 1280px | 48px | 12 | 32px |
| 1024–1439px | %100 | 40px | 12 | 24px |
| 768–1023px | %100 | 32px | 8 | 24px |
| <768px | %100 | 20px | 4 | 16px |

**Metin kapsayıcısı:** en fazla 68ch, asla tam grid genişliği.
**Hizalama:** Varsayılan **sola hizalı**. Ortalanmış metin yalnızca hero'da ve tek başına duran bölüm başlıklarında; paragraflar hiçbir zaman ortalanmaz.
**Zorunlu kural:** Her grid item'a `min-width: 0`. K1'deki taşma tam olarak bu eksiklikten kaynaklandı.

### 8.8 Buton ve etkileşim stilleri

Mevcut `border-radius: 999px` (pill) butonlar, taş/mimari konseptiyle çelişiyor ve jenerik duruyor. **Kesme taş** mantığına uygun olarak keskin köşeye geçilir.

| Varyant | Zemin | Metin | Kenar | Radius | Yükseklik |
|---|---|---|---|---|---|
| **Birincil** | `--sea` | `--stone-00` | yok | 2px | 52px (mobil 56px) |
| **İkincil** | şeffaf | `--ink` | 1px `--stone-35` | 2px | 52px |
| **Koyu zemin üstü** | şeffaf | `--stone-00` | 1px `rgba(255,255,255,.5)` | 2px | 52px |
| **Metin linki** | — | `--sea` | alt çizgi (1px, 3px offset) | — | ≥44px dokunma alanı |

**İç boşluk:** 16px 28px. **Tipografi:** Archivo 15px / 600, büyük harf **değil**, cümle düzeni ("Müsaitliğe bak", "Tarih seç").
**Ok işareti (`→`) buton metnine eklenmez.**

**Etkileşim:**
- Hover: zemin `--sea` → `--sea-deep`, 120ms.
- Active: 1px aşağı kayma (`translateY(1px)`), gölge yok.
- Focus: iki katmanlı halka — `0 0 0 2px var(--stone-00), 0 0 0 4px var(--ink)` (her zeminde görünür, Y7'yi çözer).
- Disabled: `--stone-15` zemin, `--stone-35` metin.

**Kartlar:** Tek bir gölge değeri kullanılmaz. Kart ayrımı **1px `--stone-15` kenarlıkla** yapılır; gölge yalnızca gerçekten yüzen öğelerde (modal, açılır menü, sabit bar). Radius kartlarda 4px, medyada 0.

### 8.9 Görsel yönü

**Ne fotoğraflanacak:**
- Taş dokusu yakın planları — andezitin gözenekli yüzeyi, derz çizgileri, ışığın taş üzerindeki gölgesi.
- Yükseklikten deniz — otelin gerçek ayrıcalığı bu; her oda tipinde manzara farkı gösterilmeli.
- Sert öğle ışığı ve uzun akşam gölgeleri. Assos ışığı yumuşak değil; yumuşatmaya çalışmayın.
- Boş mekânlar — sabah kahvaltı masası kurulmuş ama kimse yokken, havuz kenarı sakinken.

**Ne fotoğraflanmayacak:**
- Kameraya poz veren insanlar (O1).
- Stok görsel hissi veren "mutlu aile" kareleri.
- Aşırı doygun gün batımı.

**Renk düzenlemesi (grade):** Nötr-soğuk gölgeler, sıcak yüksek ışıklar. Doygunluk hafif düşük. Tüm site görselleri **tek bir preset** ile işlenir — şu an bazı kareler sıcak, bazıları soğuk.

**Teknik:** 16:9 veya 3:2 yatay; oda kartlarında 4:3. Videolar **yazısız master** (K4), yatay, en az 1920×1080, mobilde devre dışı (Y2).

### 8.10 Hareket ilkeleri

**Tek orkestre edilmiş an:** Sayfa yüklenirken hero'da yalnızca bir hareket — başlık iki satır hâlinde 400ms arayla belirir (opacity + 12px yukarı), scrim aynı anda açılır. Toplam 900ms. Sayfada başka giriş animasyonu yok.

**Yasak:** Her bölümde "fade-and-slide-up", her kartta hover'da yukarı kalkma, scroll-triggered sayaçlar. Bunlar şu an sitede kısmen var ve "üretilmiş" hissinin bir parçası.

**İzinli:** Kullanıcının eylemine cevap veren hareket — menü açılışı (200ms), akordeon (180ms), tarih seçici (150ms), buton hover (120ms).

**Süreler:** Mikro 120ms · Küçük geçiş 180ms · Panel 240ms. Easing: `cubic-bezier(.2,.7,.3,1)`.

**`prefers-reduced-motion: reduce`** → tüm süreler 0.01ms, videolar poster'a düşer. (Mevcut uygulama bunu zaten yapıyor, korunmalı.)

### 8.11 Masaüstü ve mobil davranış

**Navigasyon**
- ≥1024px: Yatay bar. Hero üzerinde şeffaf (metin `--stone-00`), 80px scroll sonrası `--stone-00` zemin + `--ink` metin. Logo tek satır, asla kırılmaz (Y6). "Rezervasyon" nav linki kaldırılır, yalnızca CTA butonu kalır (O5).
- <1024px: Hamburger. Panel **tam ekran** (mevcut yarım panel değil), `--stone-00` zemin. Linkler Fraunces 24px, satır yüksekliği 56px (Y4). `aria-expanded` + scroll kilidi + Escape + focus trap (Y8).

**Hero**
- Masaüstü: Tam genişlik video, üzerinde deterministik gradyan scrim (K2). Metin bloğu sola hizalı, kapsayıcının sol sütununda — ortalanmış değil. Bu, mevcut ortalanmış hero'dan ayrışır ve metnin video kompozisyonuyla çakışmasını azaltır.
- Mobil: Video yok, optimize poster (Y2). Yükseklik `100svh` değil `88svh` — altta bir sonraki bölümden bir şerit görünsün ki kaydırma daveti oluşsun.

**Hızlı arama kartı**
- Masaüstü: Hero'nun alt kenarına binen kart (mevcut davranış iyi).
- Mobil: Hero'nun **altında**, hero'ya binmeden. Sabit bar ve WhatsApp balonu bu kartı asla örtmez (K3).

**Oda kartları**
- ≥1024px: 3 sütun eşit grid. Mevcut "solda dev video + sağda liste" düzeni terk edilir (K1'in kaynağı).
- 768–1023px: 2 sütun.
- <768px: Tek sütun, tam genişlik görsel.

**Sabit öğeler (mobil), z-sırası ve konum**
1. Çerez bandı (en üstte, çözülene kadar diğerleri gizli)
2. Sabit rezervasyon barı — `bottom: 0`, 64px
3. WhatsApp — `bottom: 76px`, sağ
4. Ses düğmesi — sabit değil, hero içinde mutlak

---

## 9. Sonraki adım

Bu rapor faz 1'dir; **hiçbir kod değiştirilmedi.**

Uygulamaya geçilirse önerilen sıra:

| Aşama | İçerik | Gerekçe |
|---|---|---|
| **1** | **K1, K5, K2, K3** | Kırık düzen (Odalar + Galeri), okunamayan metin, çakışan mobil katmanlar. K1 ve K5 birer CSS düzeltmesi — tasarım yönünden tamamen bağımsız, en yüksek getiri/maliyet oranı |
| **2** | K4, Y1, Y2, Y11 | Görsel/video varlıkları: yazısız master, yatay kaynak, mobilde video kapalı, en-boy oranı düzeltmeleri |
| **3** | Y3, Y5, Y7, Y8, Y4 | Token temizliği, etiketlerin kaldırılması, erişilebilirlik |
| **4** | 8. bölümdeki tasarım yönü | Palet, tipografi, buton ve grid sisteminin uygulanması |
| **5** | Y9, Y10, O1–O7, D1–D3 | İçerik, e-posta tutarlılığı, görsel yönü |

**En hızlı kazanım:** K5 tek bir CSS kuralının kaldırılmasıyla çözülüyor ve ana sayfaya dört adet görünür fotoğraf kazandırıyor. K1 ise iki sınıf değişikliği. Bu ikisi birlikte, toplam birkaç satırlık değişiklikle ana sayfanın iki bölümünü çalışır hale getirir.

Aşama 1 ve 2, tasarım yönü onaylanmasa bile bağımsız olarak uygulanabilir — bunlar tercih değil, hata düzeltmesi.

**Onayınızı bekliyorum.** Hangi aşamalarla başlayalım ve 8. bölümdeki yön (özellikle Fraunces + Archivo tipografi önerisi ve krem zeminden taş grisine geçiş) sizce doğru yönde mi?
