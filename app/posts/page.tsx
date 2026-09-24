import Link from "next/link";
import type { Metadata } from "next";

import { PostsExplorer } from "@/components/PostsExplorer";

export const metadata: Metadata = {
  title: "文章列表",
  description: "学习笔记、项目复盘与成长记录的全部技术文章，支持搜索与分类筛选。",
};

export default function PostsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">
            文章列表
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            学习笔记与项目记录
          </h1>
        </div>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-sky-400"
        >
          返回首页
        </Link>
      </div>

      <PostsExplorer />
    </main>
  );
}
