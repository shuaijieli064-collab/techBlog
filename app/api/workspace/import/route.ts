import type { NextRequest } from "next/server";

import { countDomains, importDomains } from "@/lib/server/db";
import { isWorkspaceDomain, MAX_DOMAIN_BYTES } from "@/lib/workspace/types";
import type { Json, WorkspaceDomain } from "@/lib/workspace/types";

export const runtime = "nodejs";

/**
 * One-shot import of a browser's legacy localStorage snapshot.
 * Rejected once the database holds any data, so a stale browser can never
 * clobber newer state (import is idempotent by construction).
 */
export async function POST(req: NextRequest) {
  let body: { states?: unknown };
  try {
    body = (await req.json()) as { states?: unknown };
  } catch {
    return Response.json({ error: "invalid JSON body" }, { status: 400 });
  }
  const states = body.states;
  if (states === null || typeof states !== "object" || Array.isArray(states)) {
    return Response.json({ error: "states must be an object" }, { status: 400 });
  }

  if (countDomains() > 0) {
    return Response.json(
      { ok: false, reason: "already-initialized", imported: [] },
      { status: 409 },
    );
  }

  const accepted: Partial<Record<WorkspaceDomain, Json>> = {};
  const skipped: string[] = [];
  for (const [domain, data] of Object.entries(states as Record<string, unknown>)) {
    if (!isWorkspaceDomain(domain)) {
      skipped.push(domain);
      continue;
    }
    let serialized: string;
    try {
      serialized = JSON.stringify(data);
    } catch {
      skipped.push(domain);
      continue;
    }
    if (serialized === undefined || serialized.length > MAX_DOMAIN_BYTES) {
      skipped.push(domain);
      continue;
    }
    accepted[domain] = data as Json;
  }

  const imported = importDomains(accepted);
  return Response.json(
    { ok: true, imported, skipped },
    { headers: { "Cache-Control": "no-store" } },
  );
}
