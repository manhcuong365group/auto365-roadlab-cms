import { apiErrorResponse } from "../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../server/case-lab-auth";

export async function GET(request: Request) {
  try {
    const actor = await requireCaseLabActor(request);
    const { listMyNotifications } = await import("../../../../../server/case-lab-operations");
    return Response.json(await listMyNotifications(actor));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}
