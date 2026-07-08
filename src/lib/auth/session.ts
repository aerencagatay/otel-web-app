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

// Used as the compare target when the email doesn't match, so an attacker
// can't distinguish "unknown email" from "wrong password" via response
// timing (bcrypt.compare always runs, whether the email exists or not).
const DUMMY_HASH =
  "$2a$10$CwTycUXWue0Thq9StjUM0uJ8Fp8CG1E5BuGqNb.wQvUpMhF8pLaxa";

export async function verifyCredentials(
  email: string,
  password: string
): Promise<boolean> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      console.error("Admin credentials not configured (ADMIN_EMAIL or ADMIN_PASSWORD_HASH missing)");
      // Still run a dummy compare so this path takes roughly the same time
      // as the success/failure paths below (timing side-channel defense).
      await bcrypt.compare(password, DUMMY_HASH);
      return false;
    }

    const emailMatches = email === adminEmail;
    // Always compare against a real bcrypt hash, whether or not the email
    // matched, so response time doesn't leak which part failed.
    const passwordMatches = await bcrypt.compare(
      password,
      emailMatches ? adminPasswordHash : DUMMY_HASH
    );

    return emailMatches && passwordMatches;
  } catch (err) {
    console.error("verifyCredentials error:", err);
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn === true;
}
