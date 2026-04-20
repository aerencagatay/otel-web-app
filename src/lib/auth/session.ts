import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export interface SessionData {
  isLoggedIn: boolean;
  email?: string;
}

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
    maxAge: 60 * 60 * 8, // 8 hours
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function verifyCredentials(
  email: string,
  password: string
): Promise<boolean> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      console.error("Admin credentials not configured (ADMIN_EMAIL or ADMIN_PASSWORD_HASH missing)");
      return false;
    }

    if (email !== adminEmail) return false;

    return await bcrypt.compare(password, adminPasswordHash);
  } catch (err) {
    console.error("verifyCredentials error:", err);
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn === true;
}
