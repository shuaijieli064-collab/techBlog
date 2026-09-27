import Link from "next/link";
import type { Metadata } from "next";
import { TrendingUp, Calendar, Award, ArrowRight } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { GrowthTimeline } from "@/components/GrowthTimeline";
import { SkillLevels } from "@/components/SkillLevels";
import { growthEvents, skills } from "@/lib/growth";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "成长中心",
  description: "技能画像与成长时间线，记录每一步里程碑。",
  ...pageMeta("/growth"),
};

const stats = [
  {
    key: "avg",
    icon: TrendingUp,
    bg: "bg-wire/10",
    color: "text-wire",
    label: "平均技能水平",
  },
  {
    key: "events",
    icon: Calendar,
    bg: "bg-wire/10",
    color: "text-wire",
    label: "成长事件",
  },
  {
    key: "milestones",
    icon: Award,
    bg: "bg-wire/10",
    color: "text-wire",
    label: "关键里程碑",
  },
] as const;

export default function GrowthPage() {
  const totalEvents = growthEvents.length;
  const milestones = growthEvents.filter((e) => e.type === "milestone").length;
  const avgSkill = Math.round(skills.reduce((s, k) => s + k.level, 0) / skills.length);
  const values: Record<(typeof stats)[number]["key"], string | number> = {
    avg: `${avgSkill}%`,
    events: totalEvents,
    milestones,
  };

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Growth"
        title="成长中心"
        description="技能画像与成长时间线，记录每一步里程碑。"
      />

      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.key} className="card p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center ${stat.bg}`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{values[stat.key]}</div>
                <div className="text-xs text-print">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="section-title">技能画像</h2>
          <Link
            href="/learning"
            className="flex items-center gap-1 text-sm font-medium text-wire hover:opacity-80"
          >
            学习路线 <ArrowRight size={14} />
          </Link>
        </div>
        <SkillLevels />
      </div>

      <div>
        <h2 className="section-title mb-5">成长时间线</h2>
        <GrowthTimeline />
      </div>
    </main>
  );
}
