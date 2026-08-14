import { apiErrorResponse } from "../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../server/case-lab-auth";

export async function GET(request: Request) {
  try {
    const actor = await requireCaseLabActor(request);
    const { getDashboard } = await import("../../../../../server/case-lab-operations");
    return Response.json(await getDashboard(actor));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}
