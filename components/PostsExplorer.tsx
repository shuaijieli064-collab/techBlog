"use client";

import { useMemo, useState } from "react";
import { Search, Inbox } from "lucide-react";

import { PostCard } from "@/components/PostCard";
import { getPublishedPosts, searchPosts, type Post } from "@/lib/posts";

export function PostsExplorer() {
  const all = useMemo(() => getPublishedPosts(), []);
  const categories = useMemo(
    () => Array.from(new Set(all.map((p) => p.category))),
    [all],
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list: Post[] = all;
    if (category) list = list.filter((p) => p.category === category);
    return searchPosts(list, query);
  }, [all, category, query]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索标题、标签或正文…"
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            aria-label="搜索文章"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              category === null
                ? "border-sky-600 bg-sky-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            全部
            <span className="ml-1.5 text-xs opacity-70">{all.length}</span>
          </button>
          {categories.map((cat) => {
            const count = all.filter((p) => p.category === cat).length;
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(active ? null : cat)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-sky-600 bg-sky-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                {cat}
                <span className="ml-1.5 text-xs opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
          <Inbox size={40} className="mb-4 text-slate-400" />
          <p className="text-lg font-medium text-slate-700 dark:text-slate-200">没有匹配的文章</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            换个关键词，或点击「全部」清除筛选。
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory(null);
            }}
            className="mt-5 rounded-full bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-500"
          >
            重置筛选
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
