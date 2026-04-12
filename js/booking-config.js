/**
 * Dinamik rezervasyon (Next.js) tam URL’si (path dahil, örn. .../reservation).
 *
 * GitHub Pages sadece statiktir; bu rezervasyon formu burada ÇALIŞMAZ.
 *
 * Vercel’de "404 NOT_FOUND" + "DEPLOYMENT_NOT_FOUND" görüyorsanız:
 * bu hostname’de hiç deployment yok veya proje silinmiş demektir.
 * Çözüm: repoyu Vercel’e import edip en az bir kez başarılı deploy alın; sonra
 * Vercel Dashboard → Project → Settings → Domains / son deployment’ın URL’sini
 * kopyalayıp AŞAĞIDAKİ satırı onunla değiştirin (slug repo adından farklı olabilir).
 *
 * Ana alan adını (karaduttasotel.com) Vercel’de bu Next projesine bağlarsanız:
 * "https://karaduttasotel.com/reservation" kullanın.
 */
window.KARADUT_BOOKING_URL = "https://otel-web-app.vercel.app/reservation";
