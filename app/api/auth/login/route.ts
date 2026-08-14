import { eq } from "drizzle-orm";
import { getDb } from "../../../../db/index";
import { users } from "../../../../db/schema";
import { createSession, sessionCookie } from "../../../../server/case-lab-session";
import { verifyPassword } from "../../../../server/password-auth";

export async function POST(request: Request) {
  let input: { email?: unknown; password?: unknown };
  try { input = await request.json(); } catch { return Response.json({ error: { message: "Dữ liệu đăng nhập không hợp lệ." } }, { status: 400 }); }
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";
  const [user] = await getDb().select({ id: users.id, email: users.email, displayName: users.displayName, passwordHash: users.passwordHash, status: users.status })
    .from(users).where(eq(users.email, email)).limit(1);
  if (!user || user.status === "suspended" || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    return Response.json({ error: { message: "Email hoặc mật khẩu không đúng." } }, { status: 401 });
  }
  const { token } = await createSession(user.id);
  const secure = new URL(request.url).protocol === "https:";
  return Response.json({ user: { id: user.id, email: user.email, displayName: user.displayName } }, { headers: { "Set-Cookie": sessionCookie(token, undefined, secure) } });
}
