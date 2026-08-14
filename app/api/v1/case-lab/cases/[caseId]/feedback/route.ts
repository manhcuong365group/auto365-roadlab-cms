import { apiErrorResponse } from "../../../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../../../server/case-lab-auth";
import { parseFeedbackInput } from "../../../../../../../server/case-lab-input";

type Context = { params: Promise<{ caseId: string }> };

export async function GET(request: Request, context: Context) {
  try {
    const actor = await requireCaseLabActor(request);
    const { caseId } = await context.params;
    const { listCaseFeedback } = await import("../../../../../../../server/case-lab-operations");
    return Response.json(await listCaseFeedback(caseId, actor));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}

export async function POST(request: Request, context: Context) {
  try {
    const actor = await requireCaseLabActor(request);
    const { caseId } = await context.params;
    const { createCaseFeedback } = await import("../../../../../../../server/case-lab-operations");
    return Response.json(await createCaseFeedback(caseId, actor, parseFeedbackInput(await request.json())), { status: 201 });
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}
