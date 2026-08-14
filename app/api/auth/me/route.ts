import { apiErrorResponse } from "../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../server/case-lab-auth";

export async function GET(request: Request) {
  try { return Response.json(await requireCaseLabActor(request)); }
  catch (error) { return apiErrorResponse(request, error); }
}
