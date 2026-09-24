"use client";

import { GitCommit, GitPullRequest, Star, ExternalLink } from "lucide-react";

type Activity = {
  id: string;
  type: "commit" | "pr" | "star";
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
};

export function GitHubActivity() {
  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">GitHub 活动</h2>
        <span className="text-[10px] uppercase tracking-wider text-slate-400">mock</span>
      </div>
      <div className="space-y-3">
        {seedActivity.map((item) => {
          const Icon = icon[item.type];
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Icon size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                    {item.repo}
                  </span>
                  <span>·</span>
                  <span>{item.time}</span>
                </div>
                <p className="mt-0.5 truncate text-sm text-slate-700 dark:text-slate-200">
                  {item.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-slate-400">
        接入 GitHub API 后自动同步
      </p>
      <a
        href="https://github.com"
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400"
      >
        打开 GitHub <ExternalLink size={13} />
      </a>
    </div>
  );
}
