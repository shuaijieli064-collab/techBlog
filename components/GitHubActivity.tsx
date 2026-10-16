"use client";

import { useEffect, useState } from "react";
import { GitCommit, GitPullRequest, MessageSquare, Star } from "lucide-react";

import { SectionRule } from "@/components/SectionRule";
import { HeatGrid } from "@/components/viz/HeatGrid";

type Activity = {
  id: string;
  type: "commit" | "pr" | "star" | "issue";
  repo: string;
  message: string;
  time: string;
};

const seedActivity: Activity[] = [
  {
    id: "a1",
    type: "commit",
    repo: "tech-blog",
    message: "feat: posts search + TOC + code highlight",
    time: "2 小时前",
  },
  {
    id: "a2",
    type: "pr",
    repo: "study-assistant",
    message: "Add learning plan API",
    time: "昨天",
  },
  {
    id: "a3",
    type: "commit",
    repo: "tech-blog",
    message: "feat: localStorage persistence for dashboard tasks",
    time: "2 天前",
  },
  {
    id: "a4",
    type: "star",
    repo: "algorithm-tracker",
    message: "Reached 10 stars",
    time: "上周",
  },
];

const icon = {
  commit: GitCommit,
  pr: GitPullRequest,
  star: Star,
  issue: MessageSquare,
};

type Status = "loading" | "live" | "fallback";

export function GitHubActivity() {
  const [items, setItems] = useState<Activity[]>(seedActivity);
  const [status, setStatus] = useState<Status>("loading");
  const [username, setUsername] = useState("Nox7th");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github/events", { cache: "no-store" })
      .then((res) => res.json())
      .then((body: { ok?: boolean; data?: Activity[]; username?: string; fallback?: boolean }) => {
        if (cancelled) return;
        if (body.ok && Array.isArray(body.data) && body.data.length > 0) {
          setItems(body.data);
          if (body.username) setUsername(body.username);
          setStatus("live");
        } else {
          setStatus("fallback");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("fallback");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const meta =
    status === "loading"
      ? "SYNC"
      : status === "live"
        ? `LIVE · ${username}`
        : "FALLBACK · 示例数据";

  return (
    <div className="card relative overflow-hidden p-6">
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-violet to-transparent opacity-50" />
      <SectionRule title="GitHub 活动" meta={meta} />
      <HeatGrid weeks={26} rows={7} className="mb-4" />
      <div className="space-y-2">
        {items.map((item) => {
          const Icon = icon[item.type] ?? GitCommit;
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-hair p-3 transition-colors hover:border-wire/60"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-hair text-print">
                <Icon size={12} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
                  <span className="truncate text-wire">{item.repo}</span>
                  <span>·</span>
                  <span>{item.time}</span>
                </div>
                <p className="mt-0.5 truncate font-mono text-xs text-print">{item.message}</p>
              </div>
            </div>
          );
        })}
      </div>
      {status === "fallback" && (
        <p className="mt-3 font-mono text-[11px] text-muted">
          {"//"} GitHub 接口暂不可用（未配置用户名或网络异常），展示示例数据。配置{" "}
          <span className="text-print">GITHUB_USERNAME</span> 环境变量后自动同步。
        </p>
      )}
      <a
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex font-mono text-xs text-print transition-colors hover:text-wire"
      >
        打开 GitHub
      </a>
    </div>
  );
}
