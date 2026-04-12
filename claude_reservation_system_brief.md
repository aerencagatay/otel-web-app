# Claude Code Implementation Brief
## Assos Karadut Taş Otel – Online Rezervasyon + Kapora Onay Sistemi

Bu doküman, mevcut otel web sitesine **telefonla rezervasyon yerine doğrudan online rezervasyon alma**, **kapora bekleyen rezervasyonları yönetme**, **Google Drive'daki rezervasyon dosyası ile senkron çalışma** ve **otel sahibinin admin panelinden rezervasyonu kesinleştirebilmesi** için hazırlanmış net bir implementasyon brief'idir.

---

## 1. Proje hedefi

Mevcut site şu an daha çok tanıtım amaçlı çalışıyor. Yeni hedef:

- Misafir site üzerinden tarih, oda tipi ve kişi bilgisi seçerek rezervasyon oluşturabilsin.
- Rezervasyon oluşturulduğu anda misafirin e-posta adresine otomatik mail gitsin.
- Mail içinde **IBAN / kapora bilgisi** ve rezervasyonun kapora sonrası kesinleşeceği açıkça yazsın.
- Rezervasyon site üzerinden oluşturulduğunda, Google Drive'daki rezervasyon dosyasına otomatik kayıt düşsün.
- Yeni gelen rezervasyonlar başlangıçta **yeşil** statüde oluşsun (`pending_deposit`).
- Otel sahibi admin panelinden “kapora geldi” diyerek rezervasyonu onaylayabilsin.
- Onaylanan rezervasyonlar dosyada **kırmızı** statüye geçsin (`confirmed`).
- Sistem dolu/boş oda kontrolünü Google Drive'daki dosyaya bakarak yapsın.

---

## 2. Temel iş mantığı

### Rezervasyon statüleri

- `pending_deposit` → rezervasyon oluşturuldu, kapora bekleniyor, dosyada **yeşil**
- `confirmed` → kapora onaylandı, dosyada **kırmızı**
- `cancelled` → iptal edildi, dosyadaki ilgili işaretler temizlenmeli

### Rezervasyon akışı

1. Kullanıcı check-in / check-out tarihi seçer.
2. Kullanıcı oda tipi ve kişi sayısı seçer.
3. Sistem uygun odaları Google Drive dosyasına göre hesaplar.
4. Kullanıcı formu doldurur.
5. Sistem rezervasyonu oluşturur.
6. İlgili oda ve tarih aralığı rezervasyon dosyasında **yeşil** olarak işaretlenir.
7. Kullanıcıya kapora talimatı içeren mail gider.
8. Otel sahibi admin panelinde bu rezervasyonu görür.
9. Kapora gelince admin panelinden onay verir.
10. Dosyadaki ilgili hücreler **kırmızı** olur.
11. Kullanıcıya “rezervasyonunuz kesinleşti” maili gider.

---

## 3. Kritik teknik karar (önerilen yaklaşım)

### Önerilen stack

Bu işi mevcut statik yapının üstüne yamamak yerine aşağıdaki yapıyla ilerle:

- **Next.js (App Router, TypeScript)**
- **Tailwind CSS**
- **shadcn/ui**
- **Vercel serverless routes / actions**
- **Google Sheets API / Google Drive API**
- **Mail provider abstraction** (`Resend` veya `SMTP/Nodemailer`)
- Basit ama güvenli **admin auth** (session cookie + server-side auth)

### Neden bu yaklaşım?

- Mevcut repo statik HTML/CSS/JS mantığında; bu yapı tek başına güvenli şekilde Google API secret, admin login, mail gönderimi ve rezervasyon yazma işini taşımaz.
- 21st.dev tarafındaki kaliteli booking UI bileşenleri React / Tailwind / Next.js odaklıdır. Bu yüzden yeni rezervasyon deneyimini modern component bazlı mimari ile kurmak daha mantıklı.
- Public içerik sayfaları mevcut tasarıma sadık kalabilir; ama rezervasyon sistemi en azından `/book`, `/booking-success`, `/admin` tarafında full-stack olmalı.

### Uygulama notu

Tam site migration şart değil. Gerekirse:

- mevcut içerik sayfaları korunabilir,
- ama rezervasyon akışı yeni Next.js app içine taşınabilir,
- domain routing ile `/reservation` ve `/admin` yeni sistemden servis edilebilir.

---

## 4. Google Drive dosya stratejisi

### Çok önemli

**Tercih edilen çözüm:** Mevcut Excel dosyasını Google Drive içinde **Google Sheets formatına dönüştürmek**.

### Neden?

- Google Sheets API ile satır / hücre / renk güncellemesi çok daha stabil olur.
- Excel `.xlsx` dosyasını Drive üstünde indir-düzenle-yükle yaklaşımı yarış durumlarında daha risklidir.
- Aynı anda iki rezervasyon gelirse dosya overwrite riski doğar.

### Fallback (yalnızca zorunluysa)

Eğer dosya mutlaka `.xlsx` olarak kalacaksa:

- server-side dosyayı indir,
- lock al,
- openpyxl ile güncelle,
- tekrar Drive'a upload et,
- işlem bitene kadar ikinci yazmayı blokla.

Ama **primary recommendation = Google Sheets'e çevir**.

---

## 5. Verilen dosya yapısına göre implementasyon notları

Yüklenen örnek çalışma kitabında şu mantık var:

- `Rezervasyon tablosu 6ay`
- `Rezervasyon tablosu12ay`
- `Sayfa1`

### Gözlemlenen mantık

- `Sayfa1` oda envanterini / oda eşleşmelerini taşıyor.
- Aylık rezervasyon sekmelerinde her ay bloklar halinde duruyor.
- Ay başlık satırlarında tarih hücreleri var.
- Alt satırlarda oda satırları var.
- Tarih sütunundaki dolu hücre = o oda o gece için rezerve.
- Renk mevcut operasyon mantığının bir parçası.

### Kritik kural

**Yıl, satır numarası, ay başlangıç kolonu, sabit hücre konumu hardcode etme.**

Parser şu mantıkla çalışsın:

1. Ay bloklarını tarih içeren header satırlarını bularak tespit et.
2. Header satırındaki gerçek `Date` değerlerini okuyarak gün kolonlarını çıkar.
3. Altındaki oda satırlarını inventory ile eşleştir.
4. Belirli check-in / check-out aralığındaki gece hücrelerinin boş olup olmadığını kontrol et.

### Oda adı eşleme katmanı zorunlu

Public sitedeki oda isimleri ile dosyadaki operasyonel oda isimleri birebir aynı olmayabilir.
Bu yüzden bir config katmanı ekle:

```ts
const ROOM_TYPE_MAP = {
  deluxe_sea_view: {
    publicLabel: "Deluxe Deniz Manzaralı",
    sheetLabels: ["1+0 Panaromic"],
    maxGuests: 2,
    depositAmount: 5000,
  },
  traditional_room: {
    publicLabel: "Traditional Oda",
    sheetLabels: ["1+0 Traditional"],
    maxGuests: 2,
    depositAmount: 5000,
  },
  premium_family: {
    publicLabel: "1+1 Premium",
    sheetLabels: ["1+1 Premium", "1+1 5 kisi"],
    maxGuests: 4,
    depositAmount: 7000,
  },
};
```

> Public tarafta görünen oda kartları ile Google dosyasındaki gerçek operasyonel oda satırları bu map üzerinden bağlanmalı.

---

## 6. Kaynak doğruluk kuralı

### Source of truth

MVP için **Google rezervasyon dosyası source of truth** olsun.

Yani:

- availability hesapları bu dosyaya bakılarak yapılsın,
- yeni rezervasyonlar bu dosyaya yazılsın,
- admin onayı bu dosyayı güncellesin.

### Buna ek olarak yeni bir log sekmesi ekle

Yeni bir sekme oluştur:

- `Web_Reservations`

Bu sekmede normalize kayıt tut:

- reservationId
- createdAt
- status
- source (`website` / `manual`)
- guestName
- email
- phone
- roomTypeRequested
- assignedRoomCode
- adults
- children
- checkIn
- checkOut
- nights
- depositAmount
- currency
- ibanSnapshot
- adminConfirmedAt
- notes

Bu sekme iki iş için gerekli:

1. Admin panelinde listeleme kolaylığı
2. Mail ve operasyon geçmişi

Ama availability için yine ana operasyonel truth aylık rezervasyon tablosu olacak.

---

## 7. Renk kuralları

Aylık rezervasyon tablosundaki hücre renkleri aşağıdaki şekilde kullanılmalı:

- **Yeşil** = web üzerinden geldi, kapora bekleniyor
- **Kırmızı** = kapora onaylandı, rezervasyon kesinleşti
- Mevcut sarı / başlık / diğer dekoratif renkler korunmalı

### Uygulama kuralı

Yeni rezervasyon geldiğinde ilgili gece hücreleri:

- value: kısa okunabilir rezervasyon etiketi
- fill: yeşil

Örnek hücre metni:

```text
WEB | Ahmet Yılmaz
```

Onay verildiğinde:

- aynı hücre metni kalabilir veya sonuna `| OK` eklenebilir
- fill kırmızıya dönmeli

Öneri:

```text
WEB | Ahmet Yılmaz
```

Metni sabit tut, sadece renk değiştir. Fazla uzun text hücreleri görsel olarak bozmasın.

---

## 8. Public kullanıcı tarafı – istenen sayfalar

### A. `/reservation` veya `/book`

Ana rezervasyon deneyimi burada olacak.

#### Bölümler

1. **Hero / intro**
   - kısa güven veren açıklama
   - “online rezervasyon + kapora ile kesinleşme” bilgisi

2. **Availability search bar**
   - check-in
   - check-out
   - oda tipi
   - yetişkin
   - çocuk
   - buton: `Uygunluğu Kontrol Et`

3. **Available room cards**
   - oda görseli
   - oda adı
   - kapasite
   - kısa özellikler
   - gecelik fiyat veya “fiyat bilgisi”
   - seç butonu

4. **Rezervasyon formu**
   - ad soyad
   - e-posta
   - telefon
   - not
   - KVKK/onay checkbox
   - kapora bilgisi ön bilgilendirmesi

5. **Sticky booking summary**
   - seçilen tarih
   - gece sayısı
   - oda tipi
   - kişi sayısı
   - kapora bilgisi

### B. `/booking-success`

Rezervasyon oluşturulduktan sonra kullanıcıya:

- rezervasyon alındı
- mail gönderildi
- IBAN'a kapora gönderilince kesinleşecek
- referans numarası

bilgileri gösterilsin.

### C. `/admin`

Admin dashboard.

İçerik:

- pending rezervasyon listesi
- confirmed rezervasyon listesi
- tarih filtresi
- oda filtresi
- rezervasyon detay drawer/modal
- `Kapora Onayla` butonu
- `İptal Et` butonu
- dosyadaki oda kodu ve tarih aralığı görünmeli

---

## 9. Availability algoritması

### Doğru gece mantığı

Rezervasyon aralığı:

- `checkIn` dahil
- `checkOut` hariç

Örnek:

- 10 Temmuz giriş
- 13 Temmuz çıkış

bloklanacak geceler:

- 10
- 11
- 12

### Oda müsaitlik kontrolü

Bir oda aşağıdaki durumda müsait sayılır:

- eşleşen tarih hücrelerinin tamamı boşsa

Aşağıdaki durumda dolu sayılır:

- hücre text içeriyorsa
- pending (yeşil) ise
- confirmed (kırmızı) ise

### Oda seçimi

MVP için otomatik oda atama yeterli:

- filtrelenen uygun odalar içinden ilk uygun oda verilebilir
- sonra admin isterse override yapabilmeli

### Çok önemli edge case'ler

- rezervasyon iki ayrı ay bloğuna taşıyorsa düzgün bölünmeli
- check-in < check-out validasyonu zorunlu
- aynı anda iki kullanıcı son boş odayı almaya çalışırsa race condition engellenmeli

### Race condition çözümü

`createReservation()` içinde:

1. tekrar availability check yap
2. lock / mutex al
3. sheet'e yaz
4. lock bırak

UI'da gördüğü müsaitlik sonucu tek başına yeterli sayılmasın.
Final create işleminde tekrar server-side kontrol yapılmalı.

---

## 10. Rezervasyon oluşturma sırasında yapılacaklar

`POST /api/reservations`

### Input

```ts
{
  checkIn: string;
  checkOut: string;
  roomType: string;
  adults: number;
  children?: number;
  guestName: string;
  email: string;
  phone: string;
  notes?: string;
}
```

### Server-side flow

1. input validate et
2. availability tekrar kontrol et
3. uygun oda kodunu seç
4. unique `reservationId` üret
5. ilgili aylık rezervasyon tablosuna yeşil hücreleri yaz
6. `Web_Reservations` sekmesine kayıt ekle
7. kullanıcıya pending mail gönder
8. response dön

### Response

```ts
{
  success: true,
  reservationId: string,
  status: "pending_deposit",
}
```

---

## 11. Kapora onayı akışı

`POST /api/admin/reservations/:id/confirm-deposit`

### Yapılacaklar

1. `Web_Reservations` içinden reservation kaydını bul
2. status `pending_deposit` mi kontrol et
3. ilgili aylık hücreleri bul
4. yeşil fill'i kırmızıya çevir
5. log sekmesinde status'ü `confirmed` yap
6. `adminConfirmedAt` doldur
7. kullanıcıya confirmation mail gönder

### İptal akışı

`POST /api/admin/reservations/:id/cancel`

1. reservation kaydını bul
2. ilgili takvim hücrelerini temizle
3. log status = `cancelled`
4. istenirse kullanıcıya iptal maili gönder

---

## 12. Mail içeriği

Mail şablonları sade, güven verici ve mobil uyumlu olmalı.

### A. Pending reservation mail

Konu örneği:

```text
Rezervasyonunuz alındı – Kapora ile kesinleştirme gerekli
```

İçerik:

- misafir adı
- rezervasyon numarası
- check-in / check-out
- oda tipi
- kişi sayısı
- kapora tutarı (config'den)
- IBAN bilgisi
- açıklama / transfer notu
- “Kapora ulaştığında rezervasyonunuz kesinleşecektir” metni
- iletişim telefonu

### B. Confirmed reservation mail

Konu örneği:

```text
Rezervasyonunuz kesinleşti
```

İçerik:

- rezervasyon numarası
- tarih aralığı
- oda tipi
- kapora onayı alındı bilgisi
- check-in / check-out saatleri
- iletişim bilgisi

### C. Mail provider abstraction

Kod mail provider'a kilitlenmesin:

```ts
interface MailService {
  sendPendingDepositEmail(input: PendingMailInput): Promise<void>;
  sendConfirmedEmail(input: ConfirmedMailInput): Promise<void>;
}
```

---

## 13. Admin auth

MVP için basit ama güvenli yapı yeterli.

### Gerekenler

- admin login page
- server-side session
- password hash env'de tutulmalı
- route protection yapılmalı
- Google credentials ve IBAN bilgileri client'a asla sızmamalı

### Basit MVP

- tek admin kullanıcı
- env:
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD_HASH`
  - `SESSION_SECRET`

---

## 14. Environment variables

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
GOOGLE_DRIVE_FILE_ID=

ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
SESSION_SECRET=

MAIL_PROVIDER=resend
RESEND_API_KEY=
MAIL_FROM=

HOTEL_IBAN=
HOTEL_BANK_NAME=
HOTEL_ACCOUNT_HOLDER=
HOTEL_PHONE=
HOTEL_EMAIL=

DEFAULT_CURRENCY=TRY
```

> Eğer `.xlsx` fallback yapılacaksa ayrıca Drive file update erişimi gerekir.

---

## 15. Dosya / servis mimarisi

Önerilen klasör yapısı:

```text
src/
  app/
    (public)/
      page.tsx
      rooms/page.tsx
      reservation/page.tsx
      booking-success/page.tsx
    admin/
      login/page.tsx
      page.tsx
  components/
    booking/
      availability-search.tsx
      room-card.tsx
      booking-form.tsx
      booking-summary.tsx
      reservation-status-badge.tsx
    admin/
      reservations-table.tsx
      reservation-detail-sheet.tsx
  lib/
    auth/
      session.ts
    sheets/
      inventory.ts
      availability.ts
      reservations.ts
      colors.ts
      parser.ts
    mail/
      index.ts
      resend.ts
      smtp.ts
    config/
      room-types.ts
      hotel.ts
    utils/
      dates.ts
      ids.ts
      validation.ts
```

---

## 16. Parser / sheets service kuralları

### Parser sorumlulukları

- ay bloklarını bulmak
- tarih kolonlarını çıkarmak
- oda satırlarını eşleştirmek
- bir rezervasyonun hangi hücrelere yazılacağını hesaplamak

### Availability service sorumlulukları

- verilen tarih aralığı için uygun oda listesi döndürmek
- room type map uygulamak
- pending + confirmed ikisini de unavailable saymak

### Reservation write service sorumlulukları

- yeşil hücre yazmak
- kırmızıya çevirmek
- temizlemek
- log sekmesine append/update yapmak

### Kesin kural

UI içinde Google API çağrısı yapma.
Tüm sheet işlemleri server-side olsun.

---

## 17. 21st.dev tasarım yönü

UI tarafı mevcut taş otel kimliğini bozmasın. Fazla SaaS gibi görünmesin.

### İstenen görsel ton

- sıcak bej / kırık beyaz / taş tonları
- koyu kömür metin
- hafif deniz mavisi veya zeytin vurgusu
- premium ama sakin görünüm
- fazla neon, fazla parlak glassmorphism, fazla dashboard hissi olmasın

### UI pattern önerileri

- üstte zarif booking search bar
- oda listesinde görsel ağırlıklı kartlar
- sağda veya altta sticky reservation summary
- admin tarafında temiz tablo + status badge + hızlı aksiyon

### 21st.dev esinlenme noktaları

Aşağıdaki component tiplerinden esinlen:

- Booking Form
- Hotel Card
- Trip Details Card
- Visualize Booking

Ama birebir kopya gibi değil; markaya uygun şekilde sadeleştir.

---

## 18. Claude / 21st.dev prompt önerileri

Aşağıdaki promptlar UI üretiminde kullanılabilir.

### Prompt 1 – public booking search

```text
Create a premium boutique hotel booking section for a stone hotel in Assos. Use a warm Mediterranean palette, elegant typography, soft shadows, rounded-xl cards, and a calm luxury aesthetic. Include check-in, check-out, room type, adults, children, and a strong CTA. The component should feel like a refined hotel website, not a SaaS dashboard.
```

### Prompt 2 – room cards

```text
Create responsive hotel room cards for a boutique coastal hotel. Each card should include a large image, room title, guest capacity, small amenity chips, optional starting price, and a select button. Keep the style warm, editorial, and premium with stone, sand, and charcoal tones.
```

### Prompt 3 – booking summary

```text
Create a sticky booking summary card for a hotel reservation flow. Show selected dates, nights, guest count, room type, deposit reminder, and a submit action. The design should feel trustworthy, minimal, and luxurious.
```

### Prompt 4 – admin reservations table

```text
Create an admin reservation management interface for a small hotel. Show pending deposit and confirmed reservations, clean status badges, reservation details, date range, room code, guest contact info, and quick actions like confirm deposit or cancel. Keep it modern and clear, but not overly enterprise.
```

---

## 19. UX metin yönlendirmesi

Public tarafta kullanıcıya çok net anlat:

- “Rezervasyonunuz oluşturulduktan sonra size kapora bilgisi içeren bir e-posta gönderilecektir.”
- “Kapora tarafımıza ulaştığında rezervasyonunuz kesinleşir.”
- “Müsaitlik bilgisi anlık olarak otel rezervasyon takviminden kontrol edilir.”

Bu metinler kullanıcı güveni için önemli.

---

## 20. Non-goals (şimdilik yapılmayacaklar)

Bu MVP'de şunlar **zorunlu değil**:

- online kredi kartı ile tam ödeme
- dinamik fiyat motoru
- kupon sistemi
- çoklu admin rolleri
- misafir paneli
- self-service kapora dekont upload
- kanal yöneticisi / OTA senkronizasyonu

Ama mimari bunlara büyüyebilecek şekilde kurulmalı.

---

## 21. Kabul kriterleri

Aşağıdakiler çalışıyorsa iş kabul edilebilir:

1. Kullanıcı site üzerinden rezervasyon oluşturabiliyor.
2. Sistem dolu odaları doğru şekilde eliyor.
3. Yeni rezervasyon Google dosyasına **yeşil** olarak yazılıyor.
4. Kullanıcıya kapora / IBAN maili gidiyor.
5. Admin pending rezervasyonları panelde görüyor.
6. Admin tek tıkla kapora onayı verebiliyor.
7. Onay sonrası dosya **kırmızı** oluyor.
8. Kullanıcıya ikinci “kesinleşti” maili gidiyor.
9. Aynı oda / aynı tarih için double booking olmuyor.
10. Mobilde kullanılabilir UI var.

---

## 22. Test senaryoları

### Zorunlu testler

- tek gecelik rezervasyon
- çok gecelik rezervasyon
- ay değişimini geçen rezervasyon
- son boş odanın alınması
- aynı anda iki rezervasyon denemesi
- pending rezervasyonun confirmed'a çevrilmesi
- pending rezervasyonun iptal edilmesi
- yanlış tarih input'u
- eksik email / telefon validasyonu

---

## 23. Claude için net implementasyon önceliği

Aşağıdaki sırayla ilerle:

### Faz 1

- Next.js iskeleti
- design system / tailwind / shadcn
- public booking page UI

### Faz 2

- Google Sheets parser
- availability service
- room type mapping

### Faz 3

- reservation create API
- sheet'e yeşil yazma
- pending mail

### Faz 4

- admin login
- admin dashboard
- confirm deposit flow
- sheet'i kırmızıya çevirme
- confirmed mail

### Faz 5

- responsive polish
- edge cases
- loading / error states
- deployment docs

---

## 24. Kod kalitesi kuralları

- TypeScript strict mode kullan
- server/client ayrımını temiz tut
- config değerlerini hardcode etme
- Google Sheets logic'ini UI component'lerinin içine gömme
- booking flow için reusable service yaz
- date işlemlerinde timezone hatasına dikkat et
- Türkiye tarihi / locale gösterimini düzgün yap

---

## 25. Son not

Bu proje bir “reservation request form” değil; gerçek operasyonel rezervasyon akışı.
Yani form submit olunca sadece email düşmek yetmez.

**Asıl kritik çıktı şudur:**

- availability doğru hesaplanmalı,
- rezervasyon dosyasına doğru yazılmalı,
- pending ve confirmed renk mantığı düzgün çalışmalı,
- admin paneli ile kapora onayı gerçek operasyonu hızlandırmalı.

Bu mantığı bozmadan, mevcut otelin premium ve sıcak görsel diline uygun bir deneyim üret.

