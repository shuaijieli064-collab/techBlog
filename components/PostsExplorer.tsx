"use client";

import { useMemo, useState } from "react";
import { Search, Inbox } from "lucide-react";

import { PostCard } from "@/components/PostCard";
import { getPublishedPosts, searchPosts, userPostsFrom, type AnyPost } from "@/lib/posts";
import { useWorkspace } from "@/lib/workspace/client";
import type { Json } from "@/lib/workspace/types";

export function PostsExplorer() {
  const [raw] = useWorkspace<Json[]>("blog-posts", []);
  const userPosts = useMemo(() => userPostsFrom(raw), [raw]);
  const all = useMemo(() => getPublishedPosts(userPosts), [userPosts]);
  const categories = useMemo(
    () => Array.from(new Set(all.map((p) => p.category))),
    [all],
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list: AnyPost[] = all;
    if (category) list = list.filter((p) => p.category === category);
    return searchPosts(list, query);
  }, [all, category, query]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索标题、标签或正文…"
            className="input-base pl-11!"
            aria-label="搜索文章"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`press rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              category === null
                ? "border-wire bg-wire text-[#04131b]"
                : "border-hair bg-panel text-print hover:border-wire hover:text-wire"
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
                className={`press rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-wire bg-wire text-[#04131b]"
                    : "border-hair bg-panel text-print hover:border-wire hover:text-wire"
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
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-hair bg-panel/50 py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-hair bg-background">
            <Inbox size={22} className="text-muted" />
          </div>
          <p className="font-display text-base font-semibold text-foreground">没有匹配的文章</p>
          <p className="mt-1.5 max-w-sm text-sm leading-6 text-print">
            换个关键词，或点击「全部」清除筛选。
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory(null);
            }}
            className="btn-primary mt-5"
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
