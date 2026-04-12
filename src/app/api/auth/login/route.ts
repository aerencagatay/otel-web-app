import { NextRequest, NextResponse } from "next/server";
import { getSession, verifyCredentials } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-posta ve şifre gereklidir." },
        { status: 400 }
      );
    }

    const valid = await verifyCredentials(email, password);
    if (!valid) {
      return NextResponse.json(
        { error: "Geçersiz e-posta veya şifre." },
        { status: 401 }
      );
    }

    const session = await getSession();
    session.isLoggedIn = true;
    session.email = email;
    await session.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Login error:", err);
    // Return 401 for any unexpected error to avoid leaking stack traces
    return NextResponse.json(
      { error: "Geçersiz e-posta veya şifre." },
      { status: 401 }
    );
  }
}
