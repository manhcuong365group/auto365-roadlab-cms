import { apiErrorResponse, CaseLabApiError } from "../../../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../../../server/case-lab-auth";

type Context = { params: Promise<{ caseId: string }> };

/**
 * The case's content type (and therefore which draft shape applies) is only
 * known once `saveCaseDraft` loads the case row, so this only checks the
 * request envelope. `saveCaseDraft` normalizes `content` against the right
 * template and enforces the shared length limits via `assertCaseDraftWithinLimits`.
 */
function readDraftInput(value: unknown) {
  if (!value || typeof value !== "object") throw new CaseLabApiError("VALIDATION_ERROR", "Dữ liệu bản nháp không hợp lệ.", 400);
  const input = value as Record<string, unknown>;
  const expectedRevision = input.expectedRevision;
  if (!input.content || typeof input.content !== "object") {
    throw new CaseLabApiError("VALIDATION_ERROR", "Dữ liệu bản nháp không hợp lệ.", 400);
  }
  if (!Number.isInteger(expectedRevision) || (expectedRevision as number) < 1) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Revision đang chỉnh sửa không hợp lệ.", 400);
  }
  return { content: input.content, expectedRevision: expectedRevision as number };
}

export async function GET(request: Request, context: Context) {
  try {
    const actor = await requireCaseLabActor(request);
    const { caseId } = await context.params;
    const { getCaseDraft } = await import("../../../../../../../server/case-lab-operations");
    return Response.json(await getCaseDraft(caseId, actor));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    const actor = await requireCaseLabActor(request);
    const { caseId } = await context.params;
    const { saveCaseDraft } = await import("../../../../../../../server/case-lab-operations");
    return Response.json(await saveCaseDraft(caseId, actor, readDraftInput(await request.json())));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}
