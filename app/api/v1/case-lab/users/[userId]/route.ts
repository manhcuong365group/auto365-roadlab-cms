import { apiErrorResponse } from "../../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../../server/case-lab-auth";
import { parseUserUpdateInput } from "../../../../../../server/case-lab-input";

type Context = { params: Promise<{ userId: string }> };

export async function PATCH(request: Request, context: Context) {
  try {
    const actor = await requireCaseLabActor(request);
    const { userId } = await context.params;
    const { updateUser } = await import("../../../../../../server/case-lab-operations");
    return Response.json(await updateUser(actor, userId, parseUserUpdateInput(await request.json())));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}
