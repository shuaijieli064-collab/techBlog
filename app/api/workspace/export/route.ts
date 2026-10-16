import { NextResponse } from "next/server";

import { readDomain } from "@/lib/server/db";
import { WORKSPACE_DOMAINS, type WorkspaceDomain } from "@/lib/workspace/types";

export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store" };

/**
 * Export every workspace domain as a single JSON snapshot.
 * Used by the "导出全部数据" button — the free-use escape hatch:
 * data is never locked inside the local database.
 */
export async function GET() {
  const snapshot: Record<string, unknown> = {};
  for (const domain of WORKSPACE_DOMAINS) {
    snapshot[domain] = readDomain(domain as WorkspaceDomain);
  }
  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    domains: snapshot,
  };
  const json = JSON.stringify(payload, null, 2);
  return new NextResponse(json, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="workspace-export-${new Date().toISOString().slice(0, 10)}.json"`,
      ...noStore,
    },
  });
}
