import { and, eq, gt } from "drizzle-orm";
import { getDb } from "../db/index";
import { authSessions, users } from "../db/schema";
import { createSessionToken, hashToken } from "./password-auth";

export const sessionCookieName = "case_lab_session";
export const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

export function readSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  for (const part of cookieHeader.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");
    if (name === sessionCookieName) return valueParts.join("=") || null;
  }
  return null;
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: string }> {
  const token = createSessionToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + sessionMaxAgeSeconds * 1000).toISOString();
  await getDb().insert(authSessions).values({
    id: crypto.randomUUID(), userId, tokenHash: await hashToken(token),
    expiresAt, createdAt: now.toISOString(), lastUsedAt: now.toISOString(),
  });
  return { token, expiresAt };
}

export async function getSessionEmail(request: Request): Promise<string | null> {
  const token = readSessionToken(request);
  if (!token) return null;
  const [row] = await getDb().select({ email: users.email })
    .from(authSessions).innerJoin(users, eq(users.id, authSessions.userId))
    .where(and(eq(authSessions.tokenHash, await hashToken(token)), gt(authSessions.expiresAt, new Date().toISOString()), eq(users.status, "active")))
    .limit(1);
  return row?.email ?? null;
}

export async function deleteSession(request: Request): Promise<void> {
  const token = readSessionToken(request);
  if (!token) return;
  await getDb().delete(authSessions).where(eq(authSessions.tokenHash, await hashToken(token)));
}

export function sessionCookie(token: string, maxAge = sessionMaxAgeSeconds, secure = true): string {
  return `${sessionCookieName}=${token}; Path=/; HttpOnly;${secure ? " Secure;" : ""} SameSite=Lax; Max-Age=${maxAge}`;
}
