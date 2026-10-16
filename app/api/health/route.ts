import { NextResponse } from "next/server";
import { countDomains } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check database connectivity
    const dbInitialized = countDomains() > 0;

    // Check AI provider configuration
    const aiConfigured = Boolean(process.env.MODELSCOPE_API_KEY);

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "0.1.0",
      checks: {
        database: { status: dbInitialized ? "ok" : "degraded", initialized: dbInitialized },
        ai: { status: aiConfigured ? "ok" : "degraded", configured: aiConfigured },
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}