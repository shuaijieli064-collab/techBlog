"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  NotebookPen,
  FunctionSquare,
  Search,
  X,
  CornerDownLeft,
  Clock,
  Trash2,
} from "lucide-react";

import { searchIndex, type SearchItem, type SearchKind } from "@/lib/search";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

const kindMeta: Record<SearchKind, { label: string; icon: typeof FileText }> = {
  post: { label: "文章", icon: FileText },
  note: { label: "笔记", icon: NotebookPen },
  function: { label: "函数速查", icon: FunctionSquare },
};

const RECENT_KEY = "nexus:recent-queries";
const RECENT_MAX = 6;

function readRecentQueries(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string").slice(0, RECENT_MAX);
  } catch {
    return [];
  }
}

function writeRecentQueries(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX)));
  } catch {
    /* storage unavailable — recents are best-effort */
  }
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const lower = text.toLowerCase();
  const ql = q.toLowerCase();
  const parts: Array<{ t: string; m: boolean }> = [];
  let i = 0;
  while (i < text.length) {
    const idx = lower.indexOf(ql, i);
    if (idx === -1) {
      parts.push({ t: text.slice(i), m: false });
      break;
    }
    if (idx > i) parts.push({ t: text.slice(i, idx), m: false });
    parts.push({ t: text.slice(idx, idx + q.length), m: true });
    i = idx + q.length;
  }
  return (
    <>
      {parts.map((p, k) =>
        p.m ? (
          <mark key={k}>{p.t}</mark>
        ) : (
          <span key={k}>{p.t}</span>
        ),
      )}
    </>
  );
}

export function SearchView({ index }: { index: SearchItem[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [activeIdx, setActiveIdx] = useState(0);
  // lazy init: guarded read is SSR-safe (storage unavailable → [])
  const [recentQueries, setRecentQueries] = useState<string[]>(readRecentQueries);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => searchIndex(index, query), [index, query]);

  // flat render order — groups preserve the underlying result order
  const grouped = useMemo(() => {
    const map: Record<SearchKind, SearchItem[]> = { post: [], note: [], function: [] };
    for (const r of results) map[r.kind].push(r);
    return map;
  }, [results]);

  const total = results.length;
  const trimmed = query.trim();
  const safeActive = Math.min(activeIdx, Math.max(total - 1, 0));

  // persist the query to recents shortly after the user stops typing
  useEffect(() => {
    if (!trimmed) return;
    const t = setTimeout(() => {
      setRecentQueries((prev) => {
        if (prev[0] === trimmed) return prev;
        const next = [trimmed, ...prev.filter((q) => q !== trimmed)].slice(0, RECENT_MAX);
        writeRecentQueries(next);
        return next;
      });
    }, 700);
    return () => clearTimeout(t);
  }, [trimmed]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-result="${safeActive}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [safeActive]);

  const clearQuery = () => {
    setQuery("");
    setActiveIdx(0);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      clearQuery();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((v) => Math.min(v + 1, Math.max(total - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((v) => Math.max(v - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[safeActive];
      if (hit) router.push(hit.href);
    }
  };

  const removeRecent = (q: string) => {
    setRecentQueries((prev) => {
      const next = prev.filter((x) => x !== q);
      writeRecentQueries(next);
      return next;
    });
  };

  // running flat index while rendering groups
  let flatCursor = -1;

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        code="search"
        eyebrow="全局检索"
        title="搜索"
        description="跨文章、笔记与函数速查的全文检索，实时高亮命中结果。"
      />

      <div className="glass sticky top-2 z-10 mb-8 flex items-center gap-3 rounded-lg border border-hair px-4 py-3">
        <Search size={16} className="shrink-0 text-wire" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIdx(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="输入关键词，例如「Spring」「缓存」「ArrayList」…"
          className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted focus:outline-none"
          aria-label="搜索内容"
        />
        {trimmed ? (
          <button
            type="button"
            onClick={clearQuery}
            className="shrink-0 text-muted transition-colors hover:text-wire"
            aria-label="清空"
          >
            <X size={16} />
          </button>
        ) : (
          <kbd className="kbd shrink-0">
            ESC
          </kbd>
        )}
      </div>

      {!trimmed ? (
        <>
          {recentQueries.length > 0 && (
            <div className="mb-8">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.14em] text-muted">
                  <Clock size={12} />
                  最近搜索
                </span>
                <button
                  type="button"
                  onClick={() => {
                    writeRecentQueries([]);
                    setRecentQueries([]);
                  }}
                  className="flex items-center gap-1 font-mono text-[10px] text-muted transition-colors hover:text-alert"
                >
                  <Trash2 size={10} />
                  清除记录
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentQueries.map((q) => (
                  <span key={q} className="group inline-flex items-center">
                    <button
                      type="button"
                      onClick={() => setQuery(q)}
                      className="chip press rounded-r-none pr-1.5"
                    >
                      {q}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRecent(q)}
                      aria-label={`删除最近搜索「${q}」`}
                      className="-ml-px rounded-r-full border border-l-0 border-hair px-1.5 py-[3px] text-muted transition-colors hover:border-alert/60 hover:text-alert"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
          <EmptyState
            icon={<Search size={20} />}
            title="开始检索"
            description="输入任意关键词即可在文章正文、笔记内容与函数签名中检索并高亮命中。支持 ↑↓ 选择、回车打开。"
          />
        </>
      ) : total === 0 ? (
        <EmptyState
          icon={<Search size={20} />}
          title="未找到结果"
          description={`没有与「${trimmed}」匹配的内容。试试更短的关键词或切换同义词。`}
        />
      ) : (
        <>
          <p className="mb-6 font-mono text-xs text-muted">
            {"//"} {total} 条结果 · 文章 {grouped.post.length} · 笔记 {grouped.note.length} · 函数{" "}
            {grouped.function.length}
          </p>
          <div ref={listRef} key={trimmed} className="fade-up space-y-10">
            {(Object.keys(kindMeta) as SearchKind[]).map((kind) => {
              const items = grouped[kind];
              if (items.length === 0) return null;
              const { label, icon: Icon } = kindMeta[kind];
              return (
                <section key={kind}>
                  <div className="mb-3 flex items-center gap-2 border-b border-hair pb-2">
                    <Icon size={14} className="text-wire" />
                    <h2 className="section-title">{label}</h2>
                    <span className="font-mono text-[11px] text-muted">
                      {items.length}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {items.map((item) => {
                      flatCursor += 1;
                      const flat = flatCursor;
                      const isActive = flat === activeIdx;
                      return (
                        <li key={`${item.kind}:${item.href}`} data-result={flat}>
                          <Link
                            href={item.href}
                            onPointerMove={() => setActiveIdx(flat)}
                            className={`card card-hover group block p-4 transition-all duration-200 ${
                              isActive ? "border-wire/60 bg-raise" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-base font-medium text-print transition-colors group-hover:text-wire">
                                <Highlight text={item.title} query={query} />
                              </h3>
                              <span className="shrink-0 font-mono text-[11px] text-muted">
                                {item.meta}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-2 text-sm text-muted">
                              <Highlight text={item.excerpt} query={query} />
                            </p>
                            {item.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {item.tags.slice(0, 5).map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full border border-hair px-2 py-0.5 font-mono text-[10px] text-print"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        </>
      )}

      <p className="mt-10 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
        <CornerDownLeft size={12} /> 提示：按
        <kbd className="rounded border border-hair px-1.5 py-0.5">↑</kbd>
        <kbd className="rounded border border-hair px-1.5 py-0.5">↓</kbd>
        选择结果，
        <kbd className="rounded border border-hair px-1.5 py-0.5">回车</kbd>
        打开，
        <kbd className="rounded border border-hair px-1.5 py-0.5">ESC</kbd>
        清空查询
      </p>
    </main>
  );
}
