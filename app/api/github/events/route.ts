import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 占位用户名：可通过环境变量 GITHUB_USERNAME 配置真实账号（当前为占位）
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "Nox7th";

export type GitHubActivityItem = {
  id: string;
  type: "commit" | "pr" | "star" | "issue";
  repo: string;
  message: string;
  time: string;
  rawDate: string;
};

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "未知时间";
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins} 分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} 周前`;
  return new Date(iso).toISOString().slice(0, 10);
}

type RawEvent = {
  id: string;
  type: string;
  created_at: string;
  repo?: { name?: string };
  payload?: {
    commits?: Array<{ message?: string }>;
    pull_request?: { title?: string; merged?: boolean };
    action?: string;
    issue?: { title?: string };
  };
};

function mapEvent(e: RawEvent): GitHubActivityItem | null {
  const repo = e.repo?.name?.split("/")[1] ?? "unknown";
  const base = { id: e.id, repo, rawDate: e.created_at, time: relativeTime(e.created_at) };
  switch (e.type) {
    case "PushEvent": {
      const commit = e.payload?.commits?.[0]?.message?.split("\n")[0];
      return {
        ...base,
        type: "commit",
        message: commit ? `commit: ${commit}` : "push 代码",
      };
    }
    case "PullRequestEvent": {
      const merged = e.payload?.pull_request?.merged;
      return {
        ...base,
        type: "pr",
        message: merged
          ? `merged: ${e.payload?.pull_request?.title ?? "PR"}`
          : `PR ${e.payload?.action ?? "opened"}: ${e.payload?.pull_request?.title ?? ""}`,
      };
    }
    case "WatchEvent":
      return { ...base, type: "star", message: "starred 这个仓库" };
    case "IssueCommentEvent":
      return {
        ...base,
        type: "issue",
        message: `comment: ${e.payload?.issue?.title ?? ""}`,
      };
    case "CreateEvent":
      return { ...base, type: "commit", message: "创建了分支或标签" };
    case "ForkEvent":
      return { ...base, type: "star", message: "fork 了这个仓库" };
    default:
      return null;
  }
}

export async function GET() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/events/public?per_page=30`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "nox7th-workspace",
        },
        signal: controller.signal,
        next: { revalidate: 300 },
      },
    );
    clearTimeout(timer);

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, fallback: true, error: `github api ${res.status}` },
        { status: 200, headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=120" } },
      );
    }

    const raw = (await res.json()) as RawEvent[];

    const items = raw
      .map(mapEvent)
      .filter((x): x is GitHubActivityItem => x !== null)
      .slice(0, 8);

    return NextResponse.json(
      { ok: true, username: GITHUB_USERNAME, data: items },
      { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" } },
    );
  } catch {
    return NextResponse.json(
      { ok: false, fallback: true, error: "network unavailable" },
      { status: 200, headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=120" } },
    );
  }
}
