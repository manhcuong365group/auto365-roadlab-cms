import { apiErrorResponse } from "../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../server/case-lab-auth";
import { parseProfileInput } from "../../../../../server/case-lab-input";

export async function GET(request: Request) {
  try {
    const actor = await requireCaseLabActor(request);
    const { getMyProfile } = await import("../../../../../server/case-lab-operations");
    return Response.json(await getMyProfile(actor));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}

export async function PATCH(request: Request) {
  try {
    const actor = await requireCaseLabActor(request);
    const { updateMyProfile } = await import("../../../../../server/case-lab-operations");
    return Response.json(await updateMyProfile(actor, parseProfileInput(await request.json())));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}
