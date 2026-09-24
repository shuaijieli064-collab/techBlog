import type { Metadata } from "next";

import { AlgorithmProgress } from "@/components/AlgorithmProgress";
import { LearningRoadmap } from "@/components/LearningRoadmap";

export const metadata: Metadata = {
  title: "学习中心",
  description: "系统化学习路线与算法练习追踪，记录每一步成长。",
};

export default function LearningPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Learning</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">学习中心</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          系统化学习路径与算法练习追踪。掌握状态可点击切换，进度保存在浏览器本地。
        </p>
      </div>

      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">学习路线图</h2>
        <LearningRoadmap />
      </div>

      <div>
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">算法练习</h2>
        <AlgorithmProgress />
      </div>
    </main>
  );
}
