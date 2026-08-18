import { apiErrorResponse } from "../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../server/case-lab-auth";
import { parseCaseCreateInput } from "../../../../../server/case-lab-input";

export async function POST(request: Request) {
  try {
    const actor = await requireCaseLabActor(request);
    const { createCase } = await import("../../../../../server/case-lab-operations");
    return Response.json(await createCase(actor, parseCaseCreateInput(await request.json())));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}
