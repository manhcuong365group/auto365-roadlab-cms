import { requireCaseLabActor } from "../../../../../../../server/case-lab-auth";
import { apiErrorResponse } from "../../../../../../../server/case-lab-api";
import { parseAssignmentInput } from "../../../../../../../server/case-lab-input";

type Context = { params: Promise<{ caseId: string }> };

export async function GET(request: Request, context: Context) {
  try {
    const actor = await requireCaseLabActor(request);
    const { caseId } = await context.params;
    const { listCaseAssignments } = await import("../../../../../../../server/case-lab-operations");
    return Response.json(await listCaseAssignments(caseId, actor));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    const actor = await requireCaseLabActor(request);
    const { caseId } = await context.params;
    const { assignCaseReviewer } = await import("../../../../../../../server/case-lab-operations");
    return Response.json(await assignCaseReviewer(caseId, actor, parseAssignmentInput(await request.json())));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}
