import { cookies } from "next/headers";
import crypto from "crypto";
import { connectDB } from "./mongodb";
import { Session } from "./models/session";
import { User } from "./models/user";

const SESSION_COOKIE = "civic_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function generateSessionId(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: string, role: string) {
  await connectDB();
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await Session.create({
    sessionId,
    userId,
    role,
    createdAt: new Date(),
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION / 1000,
  });

  return sessionId;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) return null;

  await connectDB();
  const session = await Session.findOne({
    sessionId,
    expiresAt: { $gt: new Date() },
  });

  if (!session) return null;

  const user = await User.findById(session.userId).select("-password");
  if (!user) return null;

  return {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role as "resident" | "official",
  };
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    await connectDB();
    await Session.deleteOne({ sessionId });
  }

  cookieStore.delete(SESSION_COOKIE);
}
