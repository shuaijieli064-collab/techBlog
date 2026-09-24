import Link from "next/link";
import type { Metadata } from "next";

import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "文章归档",
  description: "按年份归档的全部文章时间线。",
};

export default function ArchivePage() {
  const groupedPosts = posts.reduce<Record<string, typeof posts>>((acc, post) => {
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
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
          归档
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          时间线里的成长记录
        </h1>
      </div>

      <div className="space-y-10">
        {years.map((year) => (
          <section key={year}>
            <h2 className="mb-5 text-2xl font-bold text-slate-900 dark:text-slate-50">{year}</h2>
            <div className="space-y-4">
              {groupedPosts[year].map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-sky-300 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-700 dark:hover:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="text-sm font-medium uppercase tracking-[0.18em] text-sky-600">
                      {post.category}
                    </div>
                    <div className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50">
                      {post.title}
                    </div>
                  </div>
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
