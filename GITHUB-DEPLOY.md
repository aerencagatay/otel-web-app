# GitHub'a Yükleme ve GitHub Pages ile Yayınlama

## 1. GitHub'da yeni repo oluştur

1. https://github.com adresine git, giriş yap.
2. Sağ üst **"+"** → **"New repository"**.
3. **Repository name:** `otel-website` (veya istediğin isim, boşluksuz).
4. **Public** seçili kalsın.
5. **"Add a README"**, **".gitignore"**, **"License"** ekleme — hepsini boş bırak (zaten projede var).
6. **"Create repository"** tıkla.

---

## 2. Projeyi GitHub'a gönder (Terminal / PowerShell)

Repo oluşturduktan sonra GitHub sana bir sayfa gösterecek. Orada **repo URL'si** yazar (örn. `https://github.com/KULLANICI_ADIN/otel-website.git`).

Aşağıdaki komutlarda `KULLANICI_ADIN` ve `otel-website` kısımlarını kendi GitHub kullanıcı adın ve repo adınla değiştir.

Proje klasöründe (`otel website` klasöründe) sırayla:

```powershell
git remote add origin https://github.com/KULLANICI_ADIN/otel-website.git
git branch -M main
git push -u origin main
```

İlk push'ta tarayıcı veya terminalde GitHub girişi istenebilir; giriş yap.

---

## 3. GitHub Pages'i aç (site yayında olsun)

1. GitHub'da repo sayfanda **"Settings"** sekmesine gir.
2. Sol menüden **"Pages"** seç.
3. **"Source"** kısmında **"Deploy from a branch"** seç.
4. **Branch:** `main`, **Folder:** `/ (root)` seç.
5. **Save** tıkla.

Birkaç dakika içinde site yayında olur.

**Canlı site adresi:**  
`https://KULLANICI_ADIN.github.io/otel-website/`  
(Repo adını farklı yazdıysan onu kullan.)

---

## 4. Sonraki güncellemeler

Kodda değişiklik yaptıktan sonra:

```powershell
cd "c:\Users\ahmet\OneDrive\Desktop\otel website"
git add .
git commit -m "Ne değiştirdiysen kısa yaz"
git push
```

Push'tan sonra GitHub Pages birkaç dakika içinde güncellenir.

---

## 5. Online rezervasyon (Next.js) — Vercel şart

GitHub Pages **Next.js sunucusu çalıştırmaz**; `/reservation`, `/api/*`, Google Sheets ve e-posta sadece **Vercel** (veya benzeri Node/serverless) üzerinde çalışır.

1. [vercel.com](https://vercel.com) → giriş yap → **Add New… → Project**.
2. GitHub reponuzu seçin (`otel-web-app` vb.) → **Import**.
3. **Framework Preset:** Next.js otomatik seçilir → **Deploy** deyin.
4. Deploy bitince üstte çıkan adresi kopyalayın (örn. `https://xxx.vercel.app`).  
   Bu adres, import sırasında verdiğiniz **proje adına** göre oluşur; `otel-web-app.vercel.app` diye bir deployment yoksa ekranda gördüğünüz URL farklı olur.
5. Statik sitedeki butonların doğru yere gitmesi için `js/booking-config.js` içindeki  
   `KARADUT_BOOKING_URL` değerini şu şekilde güncelleyin:  
   `https://SIZIN-VERCEL-ADRESINIZ.vercel.app/reservation`
6. Vercel’de **Environment Variables** bölümüne `.env.example` dosyasındaki gibi  
   `GOOGLE_*`, `ADMIN_*`, mail ve `SESSION_SECRET` değerlerini ekleyin; yoksa rezervasyon API’leri çalışmaz.

**`DEPLOYMENT_NOT_FOUND` hatası:** O `.vercel.app` adresinde hiç proje yok demektir — önce yukarıdaki gibi deploy edin, sonra `booking-config.js`’i gerçek production URL ile güncelleyin.
