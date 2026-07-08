import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import createIntlMiddleware from "next-intl/middleware";
import type { SessionData } from "@/lib/auth/session";
import { routing } from "@/i18n/routing";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}

const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "karadut-admin-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 8,
  },
};

// next-intl locale yönlendirme middleware'i. Yalnızca herkese açık sayfalarda
// çalışır; /admin ve /api yollarına ASLA dokunmaz (aşağıda erken return edilir).
const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ---------------------------------------------------------------------------
  // /admin ve /api: locale yönlendirmesinin TAMAMEN dışında. Mevcut oturum
  // koruması i18n öncesiyle birebir aynı davranır (regresyon riski yok).
  // ---------------------------------------------------------------------------

  // Protect /admin pages (but not /admin/login itself)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    try {
      const redirectResponse = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      const session = await getIronSession<SessionData>(
        request,
        redirectResponse,
        sessionOptions
      );

      if (!session.isLoggedIn) {
        return redirectResponse;
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect /api/admin routes — return 401 JSON
  if (pathname.startsWith("/api/admin")) {
    try {
      const dummyResponse = NextResponse.next();
      const session = await getIronSession<SessionData>(
        request,
        dummyResponse,
        sessionOptions
      );

      if (!session.isLoggedIn) {
        return NextResponse.json(
          { error: "Yetkisiz erişim." },
          { status: 401 }
        );
      }
    } catch {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }
  }

  // /admin ve /api yolları intl middleware'ine GİRMEZ — olduğu gibi geçer.
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Herkese açık sayfalar: locale çözümü + yönlendirme next-intl'e devredilir.
  return intlMiddleware(request);
}

export const config = {
  // _next, _vercel ve nokta içeren statik dosyalar (og.jpg, sitemap.xml,
  // robots.txt, favicon vb.) hariç TÜM yollar. /admin ve /api yukarıda erken
  // return ile ele alınır; kalan her şey herkese açık sayfa olarak intl'e gider.
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
