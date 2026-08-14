import { and, eq } from "drizzle-orm";
import type { AuthenticatedActor } from "./case-lab-contract";

const userEmailHeader = "oai-authenticated-user-email";

export class CaseLabAuthError extends Error {
  readonly code: "UNAUTHENTICATED" | "FORBIDDEN_ROLE";

  constructor(
    code: "UNAUTHENTICATED" | "FORBIDDEN_ROLE",
    message: string,
  ) {
    super(message);
    this.code = code;
  }
}

export async function requireCaseLabActor(request: Request): Promise<AuthenticatedActor> {
  const email = request.headers.get(userEmailHeader)?.trim().toLowerCase();
  if (!email) {
    throw new CaseLabAuthError("UNAUTHENTICATED", "Thiếu phiên đăng nhập Case Lab.");
  }

  const [{ getDb }, { userRoles, users }] = await Promise.all([
    import("../db/index"),
    import("../db/schema"),
  ]);
  const db = getDb();
  const [user] = await db
    .select({ id: users.id, email: users.email, displayName: users.displayName })
    .from(users)
    .where(and(eq(users.email, email), eq(users.status, "active")))
    .limit(1);

  if (!user) {
    throw new CaseLabAuthError("FORBIDDEN_ROLE", "Tài khoản chưa được cấp quyền Case Lab.");
  }

  const roles = await db
    .select({ role: userRoles.role, branchRef: userRoles.branchRef })
    .from(userRoles)
    .where(eq(userRoles.userId, user.id));

  if (!roles.length) {
    throw new CaseLabAuthError("FORBIDDEN_ROLE", "Tài khoản chưa có phạm vi làm việc.");
  }

  return {
    ...user,
    roles: roles as AuthenticatedActor["roles"],
  };
}
