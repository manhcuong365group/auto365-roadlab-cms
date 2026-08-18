import { apiErrorResponse } from "../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../server/case-lab-auth";
import { parseUserCreateInput } from "../../../../../server/case-lab-input";

export async function GET(request: Request) {
  try {
    const actor = await requireCaseLabActor(request);
    const { listUsers } = await import("../../../../../server/case-lab-operations");
    return Response.json(await listUsers(actor));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireCaseLabActor(request);
    const { createUser } = await import("../../../../../server/case-lab-operations");
    return Response.json(await createUser(actor, parseUserCreateInput(await request.json())));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}
