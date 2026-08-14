import { apiErrorResponse, CaseLabApiError } from "../../../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../../../server/case-lab-auth";
import { normalizeRoadLabDraft } from "../../../../../../../lib/road-lab-draft";

type Context = { params: Promise<{ caseId: string }> };

function readDraftInput(value: unknown) {
  if (!value || typeof value !== "object") throw new CaseLabApiError("VALIDATION_ERROR", "Dữ liệu bản nháp không hợp lệ.", 400);
  const input = value as Record<string, unknown>;
  const content = normalizeRoadLabDraft(input.content);
  const expectedRevision = input.expectedRevision;
  if (content.publication.title.trim().length < 3 || content.publication.title.length > 180) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Tiêu đề cần từ 3 đến 180 ký tự.", 400);
  }
  if (content.publication.summary.length > 600 || content.publication.answerFirst.length > 5_000 || content.evidence.resultSummary.length > 5_000) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Nội dung Road Lab vượt giới hạn cho phép.", 400);
  }
  if (!Number.isInteger(expectedRevision) || (expectedRevision as number) < 1) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Revision đang chỉnh sửa không hợp lệ.", 400);
  }
  return { content, expectedRevision: expectedRevision as number };
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
