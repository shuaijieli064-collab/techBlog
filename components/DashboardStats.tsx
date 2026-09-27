"use client";

import { useMemo } from "react";

import { defaultDailyTasks } from "@/components/DailyTasks";
import { computeStreak, makeSeedStudyRecords, type StudyRecord } from "@/lib/growth";
import { useWorkspace } from "@/lib/workspace/client";

const statCards = [
  { code: "POSTS", label: "已发布文章", valueKey: "posts" as const, suffix: "篇" },
  { code: "TASKS", label: "今日任务", valueKey: "tasks" as const, suffix: "" },
  { code: "STREAK", label: "连续学习天数", valueKey: "streak" as const, suffix: "天" },
];

const pad2 = (n: number) => String(n).padStart(2, "0");

export function DashboardStats({ totalPosts }: { totalPosts: number }) {
  const [tasks] = useWorkspace("daily-tasks", defaultDailyTasks);
  const seeds = useMemo(() => makeSeedStudyRecords(), []);
  const [records, , recordsReady] = useWorkspace<StudyRecord[]>("study-records", seeds);

  const taskList = Array.isArray(tasks) ? tasks : defaultDailyTasks;
  const completed = taskList.filter((t) => t.done).length;
  const recordList = Array.isArray(records) ? records : [];
  const streak = computeStreak(recordList);

  const values: Record<(typeof statCards)[number]["valueKey"], string | number> = {
    posts: pad2(totalPosts),
    tasks: `${pad2(completed)}/${pad2(taskList.length)}`,
    streak: recordsReady ? pad2(streak) : "--",
  };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {statCards.map((stat) => (
        <div key={stat.label} className="card p-5">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[11px] tracking-[0.14em] text-muted">
              {stat.code}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-bold text-foreground">
              {values[stat.valueKey]}
            </span>
            {stat.suffix && (
              <span className="font-mono text-xs text-print">{stat.suffix}</span>
            )}
          </div>
          <div className="mt-1 text-xs text-print">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
