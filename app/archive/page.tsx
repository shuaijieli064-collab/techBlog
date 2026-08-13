import Link from "next/link";

import { getSortedPosts } from "@/lib/posts";

export default function ArchivePage() {
  const groupedPosts = getSortedPosts().reduce<Record<string, ReturnType<typeof getSortedPosts>>>((acc, post) => {
    const year = new Date(post.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(groupedPosts).sort((a, b) => Number(b) - Number(a));

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">归档</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">时间线里的成长记录</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">按年份查看所有文章，快速回顾每个阶段的学习主题。</p>
      </div>

      <div className="space-y-10">
        {years.map((year) => (
          <section key={year} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{year}</h2>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                {groupedPosts[year].length} 篇
              </span>
            </div>

            <div className="space-y-4">
              {groupedPosts[year].map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-700"
                >
                  <div className="text-sm font-medium uppercase tracking-[0.18em] text-sky-600">{post.category}</div>
                  <div className="text-xl font-semibold text-slate-900 dark:text-slate-50">{post.title}</div>
                  <time dateTime={post.date} className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(post.date).toLocaleDateString("zh-CN", {
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
