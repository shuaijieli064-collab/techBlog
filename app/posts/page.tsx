import type { Metadata } from "next";

import { PageHeader, BackHome } from "@/components/PageHeader";
import { PostsExplorer } from "@/components/PostsExplorer";

export const metadata: Metadata = {
  title: "文章列表",
  description: "学习笔记、项目复盘与成长记录的全部技术文章，支持搜索与分类筛选。",
};

export default function PostsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="文章列表"
        title="学习笔记与项目记录"
        action={<BackHome />}
      />

      <PostsExplorer />
    </main>
  );
}
