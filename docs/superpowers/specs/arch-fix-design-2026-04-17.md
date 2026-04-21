# Mimari Düzeltme Tasarımı — K1 / K2 / K3

**Tarih:** 2026-04-17
**Kaynak rapor:** `docs/superpowers/specs/arch-report-2026-04-17.md`
**Kapsam:** Üç birbirine bağlı kritik bulgu — double-booking yarış koşulu (K1), aylar arası kısmi yazma (K2), monthly sheet ↔ `Web_Reservations` log desync (K3).

> Not: Bu dosya yalnızca tasarım önerisidir. Kod değişikliği uygulanmamıştır. Implementasyon `/impl-agent`'a bırakılır.

---

## 1. Mevcut Durum (Current State)

POST `/api/reservations` akışı bugün şu sırayla çalışır:

1. **Validasyon** — `src/app/api/reservations/route.ts:13-45` Zod ile body kontrolü.
2. **Aylık sheet yazımı** — `src/app/api/reservations/route.ts:49-54` `writePendingReservation()` çağrılır.
   - **Availability check** — `src/lib/sheets/reservations.ts:47-91` her oda için tüm aylar `parseMonthSheet()` ile fetch edilir, `isCellOccupied()` kontrol edilir.
   - **Hücre değer yazımı (per cell, per month)** — `src/lib/sheets/reservations.ts:115-122` her tarih için ayrı bir `spreadsheets.values.update` çağrısı yapılır (RAW). N gece için N HTTP çağrısı.
   - **Hücre format yazımı (per month)** — `src/lib/sheets/reservations.ts:152-157` o ayın tüm tarihleri için tek bir `spreadsheets.batchUpdate` ile `repeatCell` istekleri gönderilir.
   - **Çoklu ay döngüsü** — `src/lib/sheets/reservations.ts:98` her ay için yukarıdaki adımlar tekrar edilir; **aylar arasında atomiklik yoktur**.
3. **Log yazımı** — `src/app/api/reservations/route.ts:70-89` `appendReservationLog()` ayrı bir endpoint olan `spreadsheets.values.append` ile `Web_Reservations` sayfasına satır ekler (`src/lib/sheets/log.ts:56-61`).
4. **Mail** — `src/app/api/reservations/route.ts:92-108` (catch'lenmiş, başarısız olursa rezervasyon yine de döner).

**Özet zafiyetler:**
- K1: Availability check (`reservations.ts:47-91`) ile ilk hücre yazımı (`:116-121`) arasında tek bir Node event-loop turunda bile dakikalar geçebilir (10+ HTTP çağrısı). İki concurrent POST aynı odayı görüp ikisi de yazar.
- K2: `reservations.ts:98-158` döngüsü her ay için ayrı `batchUpdate` yollar. Temmuz başarılı, Ağustos `429`/network hatası alırsa Temmuz hücreleri yazılı ama Ağustos boş kalır; `try/catch` veya rollback yok.
- K3: `route.ts:49` (sheet) başarılı + `route.ts:70` (log) başarısız → admin paneli `getReservationLogs()` (`log.ts:67-98`) ile log'tan okuduğu için rezervasyonu hiç görmez; aylık tablo dolu, kapora gelse de eşleştirilemez.

---

## 2. Önerilen Atomik Yazma Stratejisi

### Karar: Tek `spreadsheets.batchUpdate` çağrısı — tüm aylık hücreler (değer + format) + log satırı `appendCells`

`googleapis` v4 `Schema$BatchUpdateSpreadsheetRequest` çoklu sheet'e yazan `repeatCell`, `updateCells`, `appendCells` request türlerini aynı `requests` dizisinde kabul ediyor (`node_modules/googleapis/build/src/apis/sheets/v4.d.ts:3575, 3707, 3743`). Sheets API tek `batchUpdate`'i **server tarafında atomik** uygular — ya hepsi yazılır ya hiçbiri (request düzeyinde tek transaction).

> **Not:** Bu, K1 yarış koşulunu **çözmez** (TOCTOU hâlâ vardır), ama K2 ve K3'ü tek hamlede kapatır ve K1 için yarış penceresini "iki ayrı API turu" yerine "tek batchUpdate çağrısı"na (~ms) indirir.

### Önerilen request shape (sözde-kod)

```ts
// writePendingReservation içinde, availability check'ten sonra:
const requests: sheets_v4.Schema$Request[] = [];

// (a) Tüm aylar, tüm tarihler için DEĞER yazımı — updateCells (repeatCell yerine)
for (const group of monthGroups) {
  for (const date of group.dates) {
    requests.push({
      updateCells: {
        rows: [{ values: [{
          userEnteredValue: { stringValue: cellText },        // "WEB | Ad Soyad"
          userEnteredFormat: { backgroundColor: GREEN },      // değer + format aynı request'te
        }]}],
        fields: "userEnteredValue,userEnteredFormat.backgroundColor",
        start: { sheetId: gidByMonth[group.month],
                 rowIndex: room.rowIndex,
                 columnIndex: dc.colIndex },
      },
    });
  }
}

// (b) Web_Reservations log satırı — appendCells (aynı batch)
requests.push({
  appendCells: {
    sheetId: WEB_RESERVATIONS_GID,
    rows: [{ values: logRowCells.map(v => ({ userEnteredValue: { stringValue: String(v) } })) }],
    fields: "userEnteredValue",
  },
});

await sheets.spreadsheets.batchUpdate({
  spreadsheetId: sheetId,
  requestBody: { requests },
});
```

Bu yaklaşımla:
- **K2 çözüldü:** Tüm aylar tek request → ya hepsi yazılır ya hiçbiri (Sheets server-side garantisi).
- **K3 çözüldü:** Log satırı aynı `batchUpdate` içinde `appendCells` ile gider; `values.append` (REST) çağrısına ihtiyaç kalmaz.
- **K1 daraltıldı:** Read-then-write pencere ~10 HTTP turundan tek HTTP turuna düşer.

### Ön hazırlık (tek seferlik fetch)

Mevcut kodda her ay için `parseMonthSheet()` zaten çağrılıyor (`reservations.ts:50, 63, 101`). Aynı Sheets `spreadsheets.get` çağrısı kullanılıyor. `getSheetGid()` (`reservations.ts:301-315`) her ay için ayrı bir `spreadsheets.get` daha yapıyor — N+1. Bunu tek `spreadsheets.get` ile (tüm sheet metadata'sı) bir kere alıp `Map<tabName, gid>` olarak cache'lemek gerekir. Aksi halde "atomik yazımdan önce 5 HTTP read" hâlâ K1 penceresini büyütür.

---

## 3. Yarış Koşulu Stratejisi (K1 — TOCTOU)

### Dürüst gerçek

Google Sheets'te **native locking yok**. `developerMetadata` mevcut ama optimistic concurrency token (ETag/If-Match) **API tarafında batchUpdate için desteklenmiyor**. Yani gerçek bir mutex elde edemeyiz; ya yarış penceresini daraltırız ya da uygulama düzeyinde dedupe ekleriz.

### Önerilen kombinasyon: "Daralt + Idempotency"

**A. Yarış penceresini daralt (zorunlu, mevcut tasarımın bir parçası)**
- Bölüm 2'deki tek `batchUpdate` zaten okuma sonrası yazma penceresini ~ms düzeyine düşürür.
- Ek olarak: `parseMonthSheet()` çağrılarını paralel `Promise.all` ile yap (mevcut kodda seri).

**B. Idempotency anahtarı (önerilen, ucuz)**
- `reservationId` POST handler'ında **yazımdan önce** üret (`route.ts:66`'dan yukarı taşı).
- Hücre değerini `"WEB | <ad soyad> | <reservationId>"` formatına çevir. Bu sayede aynı isteğin retry'ı aynı hücreye aynı içerikle yazar — yan etki yok.
- POST handler'ında client'tan gelen opsiyonel `Idempotency-Key` header'ı varsa, log'a aramadan önce bu key ile dedupe et (kısa devre 200 dön). Yoksa zorunlu değil.

**C. Post-write doğrulama (önerilen, küçük ek maliyet)**
- `batchUpdate` döndükten sonra **aynı hücreleri tekrar oku**.
- Hücre değeri `reservationId`'mizi içeriyorsa biziz, ok.
- Başka bir `WEB | ...` değeri varsa (bizim olmayan) — yarış kaybedildi: bizim yazdığımız değerleri **temizle** (`reservations.ts:222-288`'deki `cancelReservation` mantığı), 409 döndür, log'a yazma.
- Bu, gerçek bir mutex değil ama "her iki taraf da kazandı" senaryosunu **deterministik kaybedene** çevirir. Maliyet: 1 ek `spreadsheets.values.get` + nadiren rollback.

**D. Lock-row alternatifi (önerilmez)**
- Ayrı bir `Locks` sheet'inde `reservationId | roomLabel | dates | createdAt` satırı yazıp re-check yapmak teorik olarak çalışır ama:
  - Lock sheet'in kendisi `values.append` ile atomik değil — meta-yarış başlar.
  - Crash sonrası stale lock temizliği gerekir (TTL job).
  - Karmaşıklık seçeneğin getirisinden büyük. **Reddedildi.**

### Artık (residual) risk

C ile beraber bile **iki istek aynı milisaniyede aynı odayı yazarsa** ikisi de "ben yazdım" doğrulaması alabilir (hücre değeri "son yazılan kazanır" kuralıyla bir kişiye ait olur, diğer rollback'i yapamaz). Otelin günlük rezervasyon hızı (telefon dominant, online ikincil) düşünüldüğünde bu pencere **ihmal edilebilir**. Mutlak garanti isteniyorsa Postgres/Redis SETNX gibi bir kilit servisi gerekir — ki bu storage değişimi demektir.

---

## 4. K3 Log Desync Stratejisi

**Karar:** Bölüm 2'deki tek `batchUpdate` içine `appendCells` request'i olarak log satırını dahil et.

### Neden `values.append` değil

- `values.append` ayrı bir REST endpoint'idir (`spreadsheets.values:append`), `batchUpdate` ile aynı transaction'a giremez.
- Bunu kullanmaya devam edersek desync'i tamamen kapatamayız; en iyi durumda "log önce, sheet sonra" sıralamasıyla **ters yönlü** (orphan log) hata profiline döneriz.

### Reddedilen alternatifler

| Alternatif | Neden değil |
|---|---|
| Log'u önce yaz, monthly cells'i sonra | Sheet hata verirse log'da "fantom" rezervasyon kalır; admin kapora bekler ama aylık tablo boş. |
| Status kolonu `pending → committed` 2-faz commit | İki ekstra yazımlık iş, hâlâ orta adımda crash riski; gerçek 2PC değil çünkü rollback kanalı yok. |
| `developerMetadata` ile bağ kurma | API çağrı sayısını artırır, atomiklik vermez. |
| `appendCells` aynı batchUpdate içinde (önerilen) | Sheets server-side tek transaction; ya hepsi ya hiçbiri. |

### Bonus

`appendReservationLog` mevcut imzasını koruyoruz, ama içeriği `batchUpdate` request'i döndüren saf bir `buildLogAppendRequest(log): Schema$Request` helper'ına ayırırız. Eski `appendReservationLog` (standalone) ileride admin manuel düzeltmeleri için durabilir.

---

## 5. Trade-off Karşılaştırması

| Strateji | K1 (race) | K2 (multi-month) | K3 (log desync) | Karmaşıklık | Artık risk |
|---|---|---|---|---|---|
| **Mevcut kod** | Yüksek (saniyeler) | Var | Var | — | Çok yüksek |
| Tek `batchUpdate` (sadece monthly cells) | Düşük (ms) | Çözüldü | Var | Düşük | Log desync kalır |
| **Tek `batchUpdate` + `appendCells` log + idempotency + post-write doğrulama (ÖNERİLEN)** | Çok düşük (ms + rollback) | Çözüldü | Çözüldü | Orta | Sub-ms eşzamanlı yazımlar |
| Lock sheet pattern | Düşük ama meta-yarış | Çözüldü | Çözülmez (ayrı problem) | Yüksek | Stale lock, TTL bakımı |
| Storage değişimi (Postgres + Sheets sync) | Sıfır | Sıfır | Sıfır | Çok yüksek | — (kapsam dışı) |

---

## 6. Estimated Impact

### Etkilenen dosyalar

| Dosya | Değişiklik | Tahmini satır |
|---|---|---|
| `src/lib/sheets/reservations.ts` | `writePendingReservation` baştan yazılır: tek `batchUpdate`, paralel `parseMonthSheet`, post-write doğrulama, idempotent cell text. `getSheetGid` cache'lenir veya kaldırılır. | ~120 net (mevcut 130 → ~150) |
| `src/lib/sheets/log.ts` | `buildLogAppendRequest(log): Schema$Request` helper eklenir. `appendReservationLog` standalone fallback olarak kalabilir. | +25 |
| `src/app/api/reservations/route.ts` | `reservationId` üretimi sheet yazımından **önce**ye taşınır. `appendReservationLog` çağrısı kaldırılır (artık `writePendingReservation` log'u da yazıyor). 409 dönüş yolu post-write rollback için güncellenir. | ~15 değişen |
| `src/lib/sheets/client.ts` | (Opsiyonel) `getAllSheetMetadata()` cache helper'ı, N+1'i önler. | +20 |

**Toplam:** ~180-200 net satır değişimi, 4 dosya.

### Test kapsamı (zorunlu)

1. **Unit:** `buildLogAppendRequest` çıktısı için snapshot.
2. **Unit:** `splitByMonth` + request builder — multi-month bir rezervasyonun tek `requests` dizisinde N gün × M ay request ürettiğini doğrula.
3. **Integration (Sheets sandbox):**
   - Tek-ay rezervasyon: aylık hücreler + log satırı yazıldı.
   - Multi-month rezervasyon (örn. 2026-07-30 → 2026-08-02): tek batchUpdate, hata enjekte edildiğinde **hiçbir** ay yazılmamış olmalı.
   - Concurrent (Promise.all ile 2 paralel istek aynı oda+tarih): biri 200, diğeri 409 dönmeli; aylık tabloda tek bir `WEB | ...` satırı olmalı; log'da tek satır.
4. **Manuel:** Hücre formatının (yeşil arka plan) tek `updateCells.userEnteredFormat` ile geldiğinin Sheets UI'da doğrulanması.

### Risk notları

- `updateCells` ile yazılan format `repeatCell`'in `fields: "userEnteredFormat.backgroundColor"` davranışıyla aynı; `fields` mask doğru kurulmazsa diğer formatlar (border vb.) silinebilir — test'te kontrol et.
- Sheets `batchUpdate` request boyut limiti var (~10MB / pratikte yüzlerce request). Tek rezervasyonda max ~62 hücre (2 ay × 31 gün) + 1 log = 63 request — limit dahilinde, sorun değil.
- `Idempotency-Key` header'ı (opsiyonel) eklenirse, frontend'de tek "Rezervasyon Yap" butonu için `crypto.randomUUID()` yeterli; ileri faz, bu PR'da zorunlu değil.

---

## 7. Önerilen Uygulama Sırası

1. `getAllSheetMetadata()` cache helper (test edilmesi kolay, bağımsız).
2. `buildLogAppendRequest` ayrımı (saf fonksiyon, snapshot test).
3. `writePendingReservation` refactor (tek `batchUpdate`).
4. POST handler'da `reservationId`'yi öne taşı + standalone `appendReservationLog` çağrısını kaldır.
5. Post-write doğrulama + rollback yolu.
6. Concurrent integration test (en son, çünkü diğerlerini de doğrular).

Tüm adımlar tek PR'da gidebilir; toplam efor ~½ - 1 gün geliştirme + test.
