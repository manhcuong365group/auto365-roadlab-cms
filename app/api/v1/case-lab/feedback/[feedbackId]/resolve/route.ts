import { apiErrorResponse } from "../../../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../../../server/case-lab-auth";

type Context = { params: Promise<{ feedbackId: string }> };

export async function POST(request: Request, context: Context) {
  try {
    const actor = await requireCaseLabActor(request);
    const { feedbackId } = await context.params;
    const { resolveCaseFeedback } = await import("../../../../../../../server/case-lab-operations");
    return Response.json(await resolveCaseFeedback(feedbackId, actor));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}
