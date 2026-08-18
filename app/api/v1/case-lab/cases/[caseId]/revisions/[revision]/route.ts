import { apiErrorResponse, CaseLabApiError } from "../../../../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../../../../server/case-lab-auth";

type Context = { params: Promise<{ caseId: string; revision: string }> };

export async function GET(request: Request, context: Context) {
  try {
    const actor = await requireCaseLabActor(request);
    const { caseId, revision } = await context.params;
    const revisionNumber = Number(revision);
    if (!Number.isInteger(revisionNumber) || revisionNumber < 1) {
      throw new CaseLabApiError("VALIDATION_ERROR", "Số revision không hợp lệ.", 400);
    }
    const { getCaseRevisionContent } = await import("../../../../../../../../server/case-lab-operations");
    return Response.json(await getCaseRevisionContent(caseId, actor, revisionNumber));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}
