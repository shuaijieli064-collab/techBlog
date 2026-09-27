import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { NotesExplorer } from "@/components/NotesExplorer";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "笔记地图",
  description: "按技术栈整理的 Java 与后端知识地图。",
  ...pageMeta("/notes"),
};

export default function NotesPage() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="学习笔记"
        title="Java 与后端技术栈知识地图"
        description="这里的内容按技术栈整理，让我可以按主题快速回顾：Java 基础、框架、数据库、缓存与消息队列的学习脉络会更加清晰。"
      />

      <NotesExplorer />
    </main>
  );
}
