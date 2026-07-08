This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Rate limiting & bot protection (optional in dev)

Copy `.env.example` to `.env.local` and fill in the base env vars (Google Sheets, mail, admin auth) as usual. Two more integrations protect the public reservation/login endpoints from abuse:

- **Upstash Redis** (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) — backs IP/e-mail based rate limiting for the reservation, availability and login APIs. Create a free Redis database at [upstash.com](https://upstash.com) and copy the REST URL/token from the dashboard.
- **Cloudflare Turnstile** (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`) — invisible captcha on the booking form. Create a widget at the [Cloudflare Turnstile dashboard](https://dash.cloudflare.com/?to=/:account/turnstile) and copy the site/secret keys.

If either pair of env vars is missing, the corresponding protection no-ops locally (with a console warning) so `npm run dev` / `npm run build` keep working without external accounts. Both must be configured in production.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## SEO / Yapılandırılmış Veri (JSON-LD)

Site şu şemaları yayınlar (`src/components/seo/json-ld.tsx`):

- Tüm sayfalar: `Hotel` (ad, adres, geo, olanaklar, check-in/out, fiyat aralığı)
- `/rooms`: her oda tipi için `HotelRoom` + `Offer` (fiyat `pricing.ts`'ten)
- `/contact`: `ContactPage`

Deploy sonrası manuel doğrulama:

1. [Google Rich Results Test](https://search.google.com/test/rich-results) — ana sayfa (`Hotel`) ve `/rooms` (`HotelRoom`+`Offer`) hatasız çıkmalı.
2. [Schema Markup Validator](https://validator.schema.org/) — genel şema doğrulaması.
3. [opengraph.xyz](https://www.opengraph.xyz/) — `og.jpg` önizlemesi (≤200KB) hızlı gelmeli.

Not: `reviews.ts` (Task 03) dolduğunda `AggregateRating` alanı
`hotelJsonLd()` içine koşullu eklenmelidir — yorum verisi yokken eklemeyin.

## Medya optimizasyonu

```bash
node scripts/optimize-images.mjs          # idempotent; sadece bayat türevleri üretir
node scripts/optimize-images.mjs --force  # her şeyi yeniden üret
```

Ham (5-8MB) fotoğraf kaynakları `assets-raw/img/` altında tutulur ve
`.vercelignore` ile deploy dışıdır; sayfalar yalnızca `-web` türevlerini kullanır.

## Analytics / Hata izleme

- Plausible: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env değişkeni tanımlıysa yüklenir (cookie'siz).
- Sentry (yalnızca server): `SENTRY_DSN` tanımlıysa aktif; yoksa tamamen devre dışı.
