import { apiErrorResponse, CaseLabApiError } from "../../../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../../../server/case-lab-auth";
import type { CaseWorkflowAction } from "../../../../../../../server/case-lab-operations";

type Context = { params: Promise<{ caseId: string }> };

const VALID_ACTIONS = new Set<CaseWorkflowAction>(["submit_review", "approve_technical", "approve_seo", "request_changes", "publish", "archive", "restore"]);

function readStatusInput(value: unknown): { action: CaseWorkflowAction; expectedRevision: number; note?: string } {
  if (!value || typeof value !== "object") throw new CaseLabApiError("VALIDATION_ERROR", "Dữ liệu không hợp lệ.", 400);
  const input = value as Record<string, unknown>;
  if (typeof input.action !== "string" || !VALID_ACTIONS.has(input.action as CaseWorkflowAction)) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Hành động không hợp lệ.", 400);
  }
  if (!Number.isInteger(input.expectedRevision) || (input.expectedRevision as number) < 0) {
    throw new CaseLabApiError("VALIDATION_ERROR", "Revision đang thao tác không hợp lệ.", 400);
  }
  const note = typeof input.note === "string" ? input.note.slice(0, 1000) : undefined;
  return { action: input.action as CaseWorkflowAction, expectedRevision: input.expectedRevision as number, note };
}

export async function PUT(request: Request, context: Context) {
  try {
    const actor = await requireCaseLabActor(request);
    const { caseId } = await context.params;
    const { transitionCaseStatus } = await import("../../../../../../../server/case-lab-operations");
    return Response.json(await transitionCaseStatus(caseId, actor, readStatusInput(await request.json())));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}
