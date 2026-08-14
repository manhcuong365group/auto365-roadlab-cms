import { deleteSession, sessionCookie } from "../../../../server/case-lab-session";

export async function POST(request: Request) {
  await deleteSession(request);
  const secure = new URL(request.url).protocol === "https:";
  return new Response(null, { status: 204, headers: { "Set-Cookie": sessionCookie("", 0, secure) } });
}
