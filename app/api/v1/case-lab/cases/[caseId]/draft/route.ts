import { apiErrorResponse, CaseLabApiError } from "../../../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../../../server/case-lab-auth";

type Context = { params: Promise<{ caseId: string }> };

function readDraftInput(value: unknown) {
  if (!value || typeof value !== "object") throw new CaseLabApiError("VALIDATION_ERROR", "Dữ liệu bản nháp không hợp lệ.", 400);
  const input = value as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const summary = typeof input.summary === "string" ? input.summary.trim() : "";
  const body = typeof input.body === "string" ? input.body.trim() : "";
  const expectedRevision = input.expectedRevision;
  if (title.length < 3 || title.length > 180) throw new CaseLabApiError("VALIDATION_ERROR", "Tiêu đề cần từ 3 đến 180 ký tự.", 400);
  if (summary.length > 600 || body.length > 20_000) throw new CaseLabApiError("VALIDATION_ERROR", "Nội dung bản nháp vượt giới hạn cho phép.", 400);
  if (!Number.isInteger(expectedRevision) || (expectedRevision as number) < 1) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Revision đang chỉnh sửa không hợp lệ.", 400);
  }
  return { title, summary, body, expectedRevision: expectedRevision as number };
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
