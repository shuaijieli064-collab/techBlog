import Link from "next/link";
import type { Metadata } from "next";
import { TrendingUp, Calendar, Award, ArrowRight } from "lucide-react";

import { GrowthTimeline } from "@/components/GrowthTimeline";
import { SkillLevels } from "@/components/SkillLevels";
import { growthEvents, skills } from "@/lib/growth";

export const metadata: Metadata = {
  title: "成长中心",
  description: "技能画像与成长时间线，记录每一步里程碑。",
};

export default function GrowthPage() {
  const totalEvents = growthEvents.length;
  const milestones = growthEvents.filter((e) => e.type === "milestone").length;
  const avgSkill = Math.round(skills.reduce((s, k) => s + k.level, 0) / skills.length);

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Growth</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">成长中心</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          技能画像与成长时间线，记录每一步里程碑。
        </p>
      </div>

      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-900/30">
              <TrendingUp size={20} className="text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{avgSkill}%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">平均技能水平</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/30">
              <Calendar size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{totalEvents}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">成长事件</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/30">
              <Award size={20} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{milestones}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">关键里程碑</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">技能画像</h2>
          <Link href="/learning" className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-500">
            学习路线 <ArrowRight size={14} />
          </Link>
        </div>
        <SkillLevels />
      </div>

      <div>
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">成长时间线</h2>
        <GrowthTimeline />
      </div>
    </main>
  );
}
