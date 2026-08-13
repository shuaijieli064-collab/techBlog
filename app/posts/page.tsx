import Link from "next/link";

import { PostsExplorer } from "@/components/PostsExplorer";
import { getAllCategories, getAllTags, getSortedPosts } from "@/lib/posts";

export default function PostsPage() {
  const allPosts = getSortedPosts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">文章列表</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">学习笔记与项目记录</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">支持关键词搜索、分类标签筛选、排序与分页浏览。</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-sky-400"
        >
          返回首页
        </Link>
      </div>

      <PostsExplorer allPosts={allPosts} categories={getAllCategories()} tags={getAllTags()} />
    </main>
  );
}
