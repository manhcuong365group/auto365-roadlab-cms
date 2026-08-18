import { env } from "cloudflare:workers";
import { apiErrorResponse, CaseLabApiError } from "../../../../../server/case-lab-api";
import { requireCaseLabActor } from "../../../../../server/case-lab-auth";

// Workers KV values are capped at 25MB; keep meaningful headroom under that.
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export async function POST(request: Request) {
  try {
    await requireCaseLabActor(request);

    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    if (!form || !(file instanceof File)) {
      throw new CaseLabApiError("VALIDATION_ERROR", "Thiếu tệp ảnh để tải lên.", 400);
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      throw new CaseLabApiError("VALIDATION_ERROR", "Chỉ hỗ trợ ảnh JPEG, PNG, WebP, GIF hoặc AVIF.", 400);
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new CaseLabApiError("VALIDATION_ERROR", "Ảnh vượt quá dung lượng tối đa 15MB.", 400);
    }

    const key = crypto.randomUUID();
    const bytes = await file.arrayBuffer();
    await env.MEDIA_KV.put(key, bytes, { metadata: { contentType: file.type, fileName: file.name } });

    return Response.json({ url: new URL(`/media/${key}`, request.url).toString() });
  } catch (error) {
    return apiErrorResponse(request, error);
  }
}
