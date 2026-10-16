"use client";

import { useEffect, useMemo, useState } from "react";

import { defaultDailyTasks } from "@/components/DailyTasks";
import { RingProgress } from "@/components/viz/RingProgress";
import { Sparkline } from "@/components/viz/Sparkline";
import { computeStreak, makeSeedStudyRecords, type StudyRecord } from "@/lib/growth";
import { useWorkspace } from "@/lib/workspace/client";

const pad2 = (n: number) => String(n).padStart(2, "0");

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// One-shot count-up (rAF, not persistent). Jumps straight to target under
// prefers-reduced-motion or before the data is ready.
function useCountUp(target: number, active: boolean, duration = 750): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(reduce || !active ? target : target * eased);
      if (p < 1 && !(reduce || !active)) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return v;
}

export function DashboardStats({ totalPosts }: { totalPosts: number }) {
  const [tasks] = useWorkspace("daily-tasks", defaultDailyTasks);
  const seeds = useMemo(() => makeSeedStudyRecords(), []);
  const [records, , recordsReady] = useWorkspace<StudyRecord[]>("study-records", seeds);

  const taskList = Array.isArray(tasks) ? tasks : defaultDailyTasks;
  const completed = taskList.filter((t) => t.done).length;
  const recordList = Array.isArray(records) ? records : [];
  const streak = computeStreak(recordList);
  const taskRatio = taskList.length ? completed / taskList.length : 0;

  // Real 14-day study density from study-records
  const density = useMemo(() => {
    const list = Array.isArray(records) ? records : [];
    const byDay = new Map<string, number>();
    for (const r of list) {
      byDay.set(r.date, (byDay.get(r.date) ?? 0) + (typeof r.hours === "number" ? r.hours : 0));
    }
    const out: number[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      out.push(byDay.get(iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i))) ?? 0);
    }
    return out;
  }, [records]);

  const totalHours = recordList.reduce(
    (a, r) => a + (typeof r.hours === "number" ? r.hours : 0),
    0,
  );

  const postsCount = useCountUp(totalPosts, true);
  const streakCount = useCountUp(streak, recordsReady);
  const hoursCount = useCountUp(totalHours, recordsReady);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="card hud-corners group relative overflow-hidden p-5 transition-all duration-300 hover:shadow-[0_0_28px_-8px_rgba(92,225,255,0.4)]">
        <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-wire to-transparent" />
        <span className="label-mono">POSTS</span>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-bold tabular-nums text-foreground">
            {pad2(Math.round(postsCount))}
          </span>
          <span className="font-mono text-xs text-print">篇</span>
        </div>
        <div className="mt-1 text-xs text-print">已发布文章</div>
      </div>

      <div className="card hud-corners group relative flex flex-col items-center justify-center gap-2 overflow-hidden p-5 transition-all duration-300 hover:shadow-[0_0_28px_-8px_rgba(167,139,250,0.4)]">
        <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-violet to-transparent" />
        <span className="label-mono self-start">TASKS</span>
        <RingProgress
          value={taskRatio}
          center={`${pad2(completed)}/${pad2(taskList.length)}`}
          sub="DONE"
          label="今日任务"
          size={92}
          stroke={6}
        />
        <div className="text-xs text-print">今日任务</div>
      </div>

      <div className="card hud-corners group relative overflow-hidden p-5 transition-all duration-300 hover:shadow-[0_0_28px_-8px_rgba(255,180,84,0.4)]">
        <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-signal to-transparent" />
        <span className="label-mono">STREAK</span>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-bold tabular-nums text-foreground">
            {recordsReady ? pad2(Math.round(streakCount)) : "--"}
          </span>
          <span className="font-mono text-xs text-print">天</span>
        </div>
        <div className="mt-1 text-xs text-print">连续学习天数</div>
        <div className="mt-3">
          <Sparkline data={density} label="近 14 天学习密度" width={128} height={34} />
        </div>
      </div>

      <div className="card hud-corners group relative overflow-hidden p-5 transition-all duration-300 hover:shadow-[0_0_28px_-8px_rgba(92,225,255,0.4)]">
        <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-wire to-transparent" />
        <span className="label-mono">HOURS</span>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-bold tabular-nums text-foreground">
            {recordsReady ? hoursCount.toFixed(1) : "--"}
          </span>
          <span className="font-mono text-xs text-print">h</span>
        </div>
        <div className="mt-1 text-xs text-print">累计学习时长</div>
      </div>
    </div>
  );
}
