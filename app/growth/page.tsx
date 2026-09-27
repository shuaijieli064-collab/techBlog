import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { GrowthStats } from "@/components/GrowthStats";
import { PageHeader } from "@/components/PageHeader";
import { GrowthTimeline } from "@/components/GrowthTimeline";
import { SkillLevels } from "@/components/SkillLevels";
import { growthEvents } from "@/lib/growth";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "成长中心",
  description: "技能画像与成长时间线，记录每一步里程碑。",
  ...pageMeta("/growth"),
};

export default function GrowthPage() {
  const totalEvents = growthEvents.length;
  const milestones = growthEvents.filter((e) => e.type === "milestone").length;

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Growth"
        title="成长中心"
        description="技能画像与成长时间线，记录每一步里程碑。"
      />

      <GrowthStats totalEvents={totalEvents} milestones={milestones} />

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
