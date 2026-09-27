import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { ProjectList } from "@/components/ProjectList";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "项目中心",
  description: "个人项目与开源实践，记录从想法到实现的完整过程。",
  ...pageMeta("/projects"),
};

export default function ProjectsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Projects"
        title="项目中心"
        description="我的个人项目与开源实践，记录从想法到实现的完整过程。点击标题查看详情。"
      />

      <ProjectList />
    </main>
  );
}
