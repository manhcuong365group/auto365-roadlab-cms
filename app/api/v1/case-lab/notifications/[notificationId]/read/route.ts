import { apiErrorResponse } from "../../../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../../../server/case-lab-auth";

type Context = { params: Promise<{ notificationId: string }> };

export async function POST(request: Request, context: Context) {
  try {
    const actor = await requireCaseLabActor(request);
    const { notificationId } = await context.params;
    const { markNotificationRead } = await import("../../../../../../../server/case-lab-operations");
    return Response.json(await markNotificationRead(notificationId, actor));
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}
