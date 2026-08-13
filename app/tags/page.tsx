import Link from "next/link";

import { getTagStats } from "@/lib/posts";

export default function TagsPage() {
  const tagStats = getTagStats();

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">标签总览</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">按主题浏览文章</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tagStats.map((item) => (
          <Link
            key={item.tag}
            href={`/tags/${encodeURIComponent(item.tag)}`}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-sky-300 hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950"
          >
            <span className="font-medium text-slate-800 dark:text-slate-100">#{item.tag}</span>
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
              {item.count}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
