import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;
export const dynamic = "force-dynamic";

const DEFAULT_MODEL = "Qwen/Qwen3.8-Flash-Next";
const DEFAULT_MAX_TOKENS = 1024;
const DEFAULT_TEMPERATURE = 0.7;
const UPSTREAM_TIMEOUT_MS = 90_000;

function getBaseUrl(): string {
  return (process.env.MODELSCOPE_BASE_URL || "https://api-inference.modelscope.cn/v1").replace(/\/$/, "");
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.MODELSCOPE_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error: "AI service not configured",
        detail: "MODELSCOPE_API_KEY environment variable is not set. Please configure it in your deployment environment or .env.local file.",
        docs: "https://modelscope.cn",
      },
      { status: 503 },
    );
  }

  let body: {
    messages?: unknown;
    model?: unknown;
    temperature?: unknown;
    max_tokens?: unknown;
    stream?: unknown;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages must be a non-empty array" }, { status: 400 });
  }

  const model = typeof body.model === "string" && body.model.length > 0 ? body.model : DEFAULT_MODEL;
  const temperature =
    typeof body.temperature === "number" && body.temperature >= 0 && body.temperature <= 2
      ? body.temperature
      : DEFAULT_TEMPERATURE;
  const maxTokens =
    typeof body.max_tokens === "number" && body.max_tokens > 0 ? body.max_tokens : DEFAULT_MAX_TOKENS;
  const stream = body.stream === true;

  const upstreamUrl = `${getBaseUrl()}/chat/completions`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        Accept: stream ? "text/event-stream" : "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream,
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(text, {
        status: upstream.status,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      });
    }

    if (stream) {
      // 用 TransformStream 手动转发 SSE 流，避免直接透传 body 在开发模式下被中断
      const transformer = new TransformStream({
        transform(chunk, controller) {
          controller.enqueue(chunk);
        },
      });
      upstream.body?.pipeTo(transformer.writable).catch(() => {
        /* 流关闭，忽略 */
      });
      return new Response(transformer.readable, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
        },
      });
    }

    const text = await upstream.text();
    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      return Response.json({ error: "upstream request timed out" }, { status: 504 });
    }
    const message = err instanceof Error ? err.message : "unknown upstream error";
    return Response.json(
      { error: `upstream request failed: ${message}` },
      { status: 502 },
    );
  }
}
