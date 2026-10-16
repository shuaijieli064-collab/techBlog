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
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索笔记标题、标签或关联文章…"
          className="input-base pl-11!"
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
              className="btn-primary"
            >
              清除搜索
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredGroups.map((group) => (
            <section key={group.title} className="card p-6">
              <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-wire">
                {group.title}
              </div>
              <p className="text-base leading-7 text-print">
                {group.summary}
              </p>

              {group.groupNotes.length > 0 && (
                <div className="mt-5 space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted">
                    笔记
                  </div>
                  {group.groupNotes.map((note) => (
                    <Link
                      key={note.slug}
                      href={`/notes/${note.slug}`}
                      className="block rounded-lg border border-wire/30 bg-wire/[0.05] px-4 py-3 transition-colors hover:border-wire"
                    >
                      <div className="text-sm font-medium text-foreground">
                        {note.title}
                      </div>
                      <div className="mt-0.5 text-xs text-print">
                        {note.summary}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-5 space-y-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted">
                  关联文章
                </div>
                {group.posts.length > 0 ? (
                  group.posts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      className="block rounded-lg border border-hair bg-background px-4 py-3 text-sm text-print transition-colors hover:border-wire hover:text-wire"
                    >
                      {post.title}
                    </Link>
                  ))
                ) : (
                  <div className="rounded-md border border-dashed border-hair px-4 py-3 text-sm text-muted">
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
