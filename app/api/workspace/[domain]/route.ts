import type { NextRequest } from "next/server";

import { readDomain, writeDomain, countDomains } from "@/lib/server/db";
import { applyMetricOp } from "@/lib/server/metrics";
import {
  isMetricOp,
  isWorkspaceDomain,
  MAX_DOMAIN_BYTES,
} from "@/lib/workspace/types";

export const runtime = "nodejs";

type Context = { params: Promise<{ domain: string }> };

const noStore = { "Cache-Control": "no-store" };

export async function GET(_req: NextRequest, ctx: Context) {
  const { domain } = await ctx.params;
  if (!isWorkspaceDomain(domain)) {
    return Response.json({ error: "unknown domain" }, { status: 404, headers: noStore });
  }
  return Response.json(
    { domain, data: readDomain(domain), initialized: countDomains() > 0 },
    { headers: noStore },
  );
}

export async function PUT(req: NextRequest, ctx: Context) {
  const { domain } = await ctx.params;
  if (!isWorkspaceDomain(domain)) {
    return Response.json({ error: "unknown domain" }, { status: 404 });
  }
  let body: { data?: unknown };
  try {
    body = (await req.json()) as { data?: unknown };
  } catch {
    return Response.json({ error: "invalid JSON body" }, { status: 400 });
  }
  if (body === null || typeof body !== "object" || !("data" in body)) {
    return Response.json({ error: "missing data" }, { status: 400 });
  }
  if (JSON.stringify(body.data).length > MAX_DOMAIN_BYTES) {
    return Response.json({ error: "payload too large" }, { status: 413 });
  }
  writeDomain(domain, body.data as Parameters<typeof writeDomain>[1]);
  return Response.json({ ok: true }, { headers: noStore });
}

export async function POST(req: NextRequest, ctx: Context) {
  const { domain } = await ctx.params;
  if (domain !== "post-metrics") {
    return Response.json({ error: "method not allowed for this domain" }, { status: 405 });
  }
  let body: { slug?: unknown; op?: unknown };
  try {
    body = (await req.json()) as { slug?: unknown; op?: unknown };
  } catch {
    return Response.json({ error: "invalid JSON body" }, { status: 400 });
  }
  const slug = typeof body.slug === "string" ? body.slug : "";
  const op = typeof body.op === "string" ? body.op : "";
  if (!slug || !isMetricOp(op)) {
    return Response.json({ error: "slug and op are required" }, { status: 400 });
  }
  const metric = applyMetricOp(slug, op);
  return Response.json({ metric }, { headers: noStore });
}
