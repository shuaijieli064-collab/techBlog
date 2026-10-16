import { DEFAULT_MODEL, modelOptions } from "@/lib/ai";

export const runtime = "nodejs";

/**
 * Read-only AI provider status. Never returns the API key itself —
 * only whether it is configured, plus the resolved base URL and model list.
 */
export async function GET() {
  const baseUrl = (process.env.MODELSCOPE_BASE_URL || "https://api-inference.modelscope.cn/v1").replace(/\/$/, "");
  return Response.json(
    {
      provider: "modelscope",
      configured: Boolean(process.env.MODELSCOPE_API_KEY),
      baseUrl,
      defaultModel: DEFAULT_MODEL,
      models: modelOptions.map((m) => ({ id: m.id, label: m.label, short: m.short })),
    },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" } },
  );
}
