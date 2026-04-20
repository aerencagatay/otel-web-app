import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import type { SessionData } from "@/lib/auth/session";

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
