import { env } from "cloudflare:workers";

type Context = { params: Promise<{ key: string }> };

export async function GET(_request: Request, context: Context) {
  const { key } = await context.params;
  const result = await env.MEDIA_KV.getWithMetadata<{ contentType?: string }>(key, { type: "arrayBuffer" });
  if (!result.value) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(result.value, {
    headers: {
      "content-type": result.metadata?.contentType || "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
