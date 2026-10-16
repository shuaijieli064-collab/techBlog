"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { defaultDailyTasks, type DailyTask } from "@/components/DailyTasks";
import { SectionRule } from "@/components/SectionRule";
import { makeSeedStudyRecords, type StudyRecord } from "@/lib/growth";
import { useWorkspace } from "@/lib/workspace/client";
import type { BoardTask } from "@/components/TaskBoard";

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const WEEKDAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export function WeekPlan() {
  const seeds = useMemo(() => makeSeedStudyRecords(), []);
  const [storedRecords] = useWorkspace<StudyRecord[]>("study-records", seeds);
  const [storedBoard] = useWorkspace<BoardTask[]>("task-board", []);
  const [storedDaily] = useWorkspace<DailyTask[]>("daily-tasks", defaultDailyTasks);

  const records = useMemo(
    () => (Array.isArray(storedRecords) ? storedRecords : seeds),
    [storedRecords, seeds],
  );
  const board = useMemo(() => (Array.isArray(storedBoard) ? storedBoard : []), [storedBoard]);
  const daily = useMemo(
    () => (Array.isArray(storedDaily) ? storedDaily : defaultDailyTasks),
    [storedDaily],
  );

  const today = useMemo(() => new Date(), []);
  const todayIso = isoDate(today);

  const days = useMemo(() => {
    const day = (today.getDay() + 6) % 7;
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - day);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const key = isoDate(d);
      return {
        key,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        weekday: WEEKDAYS[i],
        records: records.filter((r) => r.date === key),
        isToday: key === todayIso,
      };
    });
  }, [records, today, todayIso]);

  const todayTasks = daily.filter((t) => !t.done);
  const todayBoardCount = board.filter((t) => t.status === "today").length;

  return (
    <div className="card p-6">
      <SectionRule
        title="本周规划"
        meta="7 DAYS"
        href="/dashboard?focus=tasks"
        metaLabel="任务箱"
      />

      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[720px] grid-cols-7 gap-2">
          {days.map((d) => (
            <div
              key={d.key}
              className={`flex min-h-[150px] flex-col rounded-lg border p-2.5 ${
                d.isToday ? "border-wire/70 bg-wire/5" : "border-hair"
              }`}
            >
              <div className="mb-2 flex items-baseline justify-between">
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.12em] ${
                    d.isToday ? "text-wire" : "text-muted"
                  }`}
                >
                  {d.weekday}
                </span>
                <span className="font-mono text-[11px] text-print">{d.label}</span>
              </div>

              {d.isToday && (
                <div className="mb-2 space-y-1">
                  {todayTasks.slice(0, 2).map((t) => (
                    <p
                      key={t.id}
                      className="truncate border-l-2 border-wire/60 pl-1.5 font-mono text-[10px] text-print"
                      title={t.title}
                    >
                      {t.title}
                    </p>
                  ))}
                  {(todayTasks.length > 2 || todayBoardCount > 0) && (
                    <p className="pl-1.5 font-mono text-[10px] text-muted">
                      +{todayTasks.length - 2 + todayBoardCount} 项任务
                    </p>
                  )}
                  {todayTasks.length === 0 && todayBoardCount === 0 && (
                    <p className="pl-1.5 font-mono text-[10px] text-muted">今日无任务</p>
                  )}
                </div>
              )}

              <div className="mt-auto space-y-1">
                {d.records.slice(0, 2).map((r) => (
                  <p
                    key={r.id}
                    className="truncate font-mono text-[10px] text-print"
                    title={`${r.title} · ${r.hours}h`}
                  >
                    <span className="text-wire">●</span> {r.title}
                  </p>
                ))}
                {d.records.length > 2 && (
                  <p className="font-mono text-[10px] text-muted">
                    +{d.records.length - 2} 条学习记录
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <CalendarDays size={12} className="text-wire" /> 今日 {todayTasks.length} 项任务
        </span>
        <Link href="/learning" className="text-print transition-colors hover:text-wire">
          去记录学习 →
        </Link>
      </div>
    </div>
  );
}
