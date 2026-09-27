import { GitCommit, GitPullRequest, Star } from "lucide-react";

import { SectionRule } from "@/components/SectionRule";

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
      <SectionRule title="GitHub 活动" meta="MOCK" />
      <div className="space-y-2">
        {seedActivity.map((item) => {
          const Icon = icon[item.type];
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 border border-hair p-3 transition-colors hover:border-wire/60"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-hair text-print">
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
      <p className="mt-3 font-mono text-[11px] text-muted">接入 GitHub API 后自动同步</p>
      <a
        href="https://github.com"
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex font-mono text-xs text-print transition-colors hover:text-wire"
      >
        打开 GitHub
      </a>
    </div>
  );
}
