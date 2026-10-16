"use client";

import { useMemo } from "react";
import { CalendarDays, Flame } from "lucide-react";

import { defaultData, defaultMastered } from "@/components/LearningRoadmap";
import { SectionRule } from "@/components/SectionRule";
import { RingProgress } from "@/components/viz/RingProgress";
import { Sparkline } from "@/components/viz/Sparkline";
import { computeStreak, makeSeedStudyRecords, type StudyRecord } from "@/lib/growth";
import { useWorkspace } from "@/lib/workspace/client";

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function WeekOverview() {
  const seeds = useMemo(() => makeSeedStudyRecords(), []);
  const [storedRecords] = useWorkspace<StudyRecord[]>("study-records", seeds);
  const [storedMastered] = useWorkspace<boolean[][]>("learning-mastered", defaultMastered);
  const [storedAlgorithms] = useWorkspace<typeof defaultData.algorithms>(
    "algorithms",
    defaultData.algorithms,
  );

  const records = useMemo(
    () => (Array.isArray(storedRecords) ? storedRecords : seeds),
    [storedRecords, seeds],
  );
  const mastered = useMemo(
    () =>
      Array.isArray(storedMastered) && storedMastered.length === defaultMastered.length
        ? storedMastered
        : defaultMastered,
    [storedMastered],
  );
  const algorithms = useMemo(
    () =>
      Array.isArray(storedAlgorithms) && storedAlgorithms.length === defaultData.algorithms.length
        ? storedAlgorithms
        : defaultData.algorithms,
    [storedAlgorithms],
  );

  const today = useMemo(() => new Date(), []);
  const thisMonday = useMemo(() => {
    const day = (today.getDay() + 6) % 7;
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() - day);
  }, [today]);

  const weekRecords = records.filter((r) => r.date >= isoDate(thisMonday));
  const weekHours = weekRecords.reduce((s, r) => s + r.hours, 0);

  const weekDensity = useMemo(() => {
    const days: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const key = isoDate(d);
      days.push(records.filter((r) => r.date === key).reduce((s, r) => s + r.hours, 0));
    }
    return days;
  }, [records, today]);

  const roadmapTotal = defaultData.roadmap.reduce((s, sec) => s + sec.items.length, 0);
  const roadmapDone = mastered
    .flat()
    .filter((v): v is boolean => typeof v === "boolean" && v).length;
  const roadmapRatio = roadmapTotal > 0 ? roadmapDone / roadmapTotal : 0;

  const algoTotal = algorithms.reduce((s, a) => s + (a.count || 0), 0);
  const algoDone = algorithms.reduce((s, a) => s + (a.mastered || 0), 0);
  const algoRatio = algoTotal > 0 ? algoDone / algoTotal : 0;

  const streak = computeStreak(records);

  return (
    <div id="week-overview" className="card p-6">
      <SectionRule
        title="本周概览"
        meta={`${isoDate(thisMonday)} → ${isoDate(today)}`}
        href="/learning"
        metaLabel="查看学习"
      />

      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="min-w-[220px]">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-4xl font-bold tabular-nums text-foreground">
              {weekHours.toFixed(1)}
            </span>
            <span className="font-mono text-xs text-muted">HOURS</span>
          </div>
          <p className="mt-1 text-xs text-print">
            本周学习 {weekRecords.length} 条记录 · 近 7 天时长趋势见下方
          </p>
          <div className="mt-3">
            <Sparkline data={weekDensity} height={48} width={240} label="本周每日学习时长" />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted">
            <span>近 7 天</span>
            <span>单位 h</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-hair p-3">
            <RingProgress
              value={roadmapRatio}
              size={76}
              stroke={6}
              center={`${Math.round(roadmapRatio * 100)}%`}
              sub="路线图"
              label="路线图总掌握"
            />
            <span className="font-mono text-[11px] text-print">
              {roadmapDone}/{roadmapTotal} 知识点
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border border-hair p-3">
            <RingProgress
              value={algoRatio}
              size={76}
              stroke={6}
              center={`${Math.round(algoRatio * 100)}%`}
              sub="算法"
              label="算法总掌握"
            />
            <span className="font-mono text-[11px] text-print">
              {algoTotal > 0 ? `${algoDone}/${algoTotal} 题` : `${algoDone} 已掌握`}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-hair p-3">
            <div className="flex items-center gap-1.5">
              <Flame size={18} className="text-signal" />
              <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
                {streak}
              </span>
            </div>
            <span className="font-mono text-[11px] text-print">连续学习天数</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-hair p-3">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={16} className="text-wire" />
              <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
                {weekRecords.length}
              </span>
            </div>
            <span className="font-mono text-[11px] text-print">本周记录</span>
          </div>
        </div>
      </div>
    </div>
  );
}
