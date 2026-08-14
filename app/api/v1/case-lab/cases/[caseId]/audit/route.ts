import { apiErrorResponse } from "../../../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../../../server/case-lab-auth";

type Context = { params: Promise<{ caseId: string }> };

export async function GET(request: Request, context: Context) {
  try {
    const actor = await requireCaseLabActor(request);
    const { caseId } = await context.params;
    const { listCaseAudit } = await import("../../../../../../../server/case-lab-operations");
    return Response.json(await listCaseAudit(caseId, actor));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}
