"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { noteGroups, searchNotes } from "@/lib/notes";
import { getPublishedPosts } from "@/lib/posts";

export function NotesExplorer() {
  const posts = useMemo(() => getPublishedPosts(), []);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filteredNotes = useMemo(() => searchNotes(query), [query]);

  const filteredGroups = useMemo(() => {
    return noteGroups
      .map((group) => {
        const groupNotes = filteredNotes.filter((n) => n.group === group.title);
        const relevant = posts.filter((post) =>
          group.tags.some((tag) => post.tags.includes(tag)),
        );
        const filteredPosts = q
          ? relevant.filter((post) =>
              `${post.title} ${post.excerpt} ${post.tags.join(" ")}`
                .toLowerCase()
                .includes(q),
            )
          : relevant;
        const groupMatch =
          !q ||
          `${group.title} ${group.summary} ${group.tags.join(" ")}`
            .toLowerCase()
            .includes(q);
        const hide = q
          ? groupNotes.length === 0 && filteredPosts.length === 0 && !groupMatch
          : false;
        return { ...group, groupNotes, posts: filteredPosts, hide };
      })
      .filter((g) => !g.hide);
  }, [posts, q, filteredNotes]);

  return (
    <div>
      <div className="relative mb-8">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索笔记标题、标签或关联文章…"
          className="input-base rounded-2xl py-3 pl-11 pr-4"
          aria-label="搜索笔记"
        />
      </div>

      {filteredGroups.length === 0 ? (
        <EmptyState
          title="没有匹配的笔记"
          description="试试 Java、Spring、Redis 等关键词。"
          action={
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-full bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-500"
            >
              清除搜索
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredGroups.map((group) => (
            <section key={group.title} className="card p-6">
              <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
                {group.title}
              </div>
              <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
                {group.summary}
              </p>

              {group.groupNotes.length > 0 && (
                <div className="mt-5 space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    笔记
                  </div>
                  {group.groupNotes.map((note) => (
                    <Link
                      key={note.slug}
                      href={`/notes/${note.slug}`}
                      className="block rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 transition-colors hover:border-sky-300 dark:border-sky-900/50 dark:bg-sky-950/40"
                    >
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {note.title}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {note.summary}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-5 space-y-3">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  关联文章
                </div>
                {group.posts.length > 0 ? (
                  group.posts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-sky-400"
                    >
                      {post.title}
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    该模块还在持续补充中
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
