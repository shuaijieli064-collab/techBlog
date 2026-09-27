"use client";

import { TrendingUp, Calendar, Award } from "lucide-react";

import { defaultSkillLevels, skills } from "@/lib/growth";
import { useWorkspace } from "@/lib/workspace/client";

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

export function GrowthStats({
  totalEvents,
  milestones,
}: {
  totalEvents: number;
  milestones: number;
}) {
  const [stored] = useWorkspace<Record<string, number>>("skill-levels", defaultSkillLevels);
  const levels =
    stored && typeof stored === "object" && !Array.isArray(stored) ? stored : defaultSkillLevels;
  const avgSkill = Math.round(
    skills.reduce((s, k) => s + Math.min(100, Math.max(0, levels[k.name] ?? k.level)), 0) /
      skills.length,
  );

  const values: Record<(typeof stats)[number]["key"], string | number> = {
    avg: `${avgSkill}%`,
    events: totalEvents,
    milestones,
  };

  return (
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
  );
}
