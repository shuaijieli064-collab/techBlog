import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { AlgorithmProgress } from "@/components/AlgorithmProgress";
import { LearningRoadmap } from "@/components/LearningRoadmap";
import { StudyRecords } from "@/components/StudyRecords";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "学习中心",
  description: "系统化学习路线与算法练习追踪，记录每一步成长。",
  ...pageMeta("/learning"),
};

export default function LearningPage() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Learning"
        title="学习中心"
        description="系统化学习路径与算法练习追踪。掌握状态可点击切换，进度保存在浏览器本地。"
      />

      <div className="mb-12">
        <h2 className="section-title mb-5">学习路线图</h2>
        <LearningRoadmap />
      </div>

      <div className="mb-12">
        <h2 className="section-title mb-5">算法练习</h2>
        <AlgorithmProgress />
      </div>

      <div>
        <StudyRecords />
      </div>
    </main>
  );
}
