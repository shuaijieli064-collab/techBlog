"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Check, Star, Plus, Search, X, Save } from "lucide-react";

import { promptCategories, seedPrompts, type PromptItem } from "@/lib/prompts";

const STORAGE_KEY = "prompt-library:v1";

type LocalState = {
  favorites: string[];
  custom: PromptItem[];
  useCounts: Record<string, number>;
};

function loadState(): LocalState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { favorites: [], custom: [], useCounts: {} };
    const parsed = JSON.parse(raw) as Partial<LocalState>;
    return {
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      custom: Array.isArray(parsed.custom) ? parsed.custom : [],
      useCounts: parsed.useCounts && typeof parsed.useCounts === "object" ? parsed.useCounts : {},
    };
  } catch {
    return { favorites: [], custom: [], useCounts: {} };
  }
}

function saveState(state: LocalState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function PromptLibrary() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<LocalState>({ favorites: [], custom: [], useCounts: {} });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("全部");
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ title: "", category: promptCategories[0] as string, content: "" });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setState(loadState());
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const allPrompts = useMemo(() => [...state.custom, ...seedPrompts], [state.custom]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allPrompts.filter((p) => {
      if (category !== "全部" && p.category !== category) return false;
      if (showFavOnly && !state.favorites.includes(p.id)) return false;
      if (!q) return true;
      return `${p.title}\n${p.content}\n${p.category}`.toLowerCase().includes(q);
    });
  }, [allPrompts, category, query, showFavOnly, state.favorites]);

  const update = (next: LocalState) => {
    setState(next);
    saveState(next);
  };

  const copy = async (prompt: PromptItem) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
      update({
        ...state,
        useCounts: {
          ...state.useCounts,
          [prompt.id]: (state.useCounts[prompt.id] ?? prompt.useCount) + 1,
        },
      });
    } catch {
      /* ignore */
    }
  };

  const toggleFav = (id: string) => {
    const favorites = state.favorites.includes(id)
      ? state.favorites.filter((f) => f !== id)
      : [...state.favorites, id];
    update({ ...state, favorites });
  };

  const createPrompt = () => {
    if (!draft.title.trim() || !draft.content.trim()) return;
    const item: PromptItem = {
      id: `local-${Date.now()}`,
      title: draft.title.trim(),
      category: draft.category,
      content: draft.content.trim(),
      useCount: 0,
    };
    update({ ...state, custom: [item, ...state.custom] });
    setDraft({ title: "", category: promptCategories[0] as string, content: "" });
    setCreating(false);
  };

  const removeCustom = (id: string) => {
    update({
      ...state,
      custom: state.custom.filter((c) => c.id !== id),
      favorites: state.favorites.filter((f) => f !== id),
    });
  };

  if (!mounted) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索提示词标题或内容…"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              aria-label="搜索提示词"
            />
          </div>
          <button
            type="button"
            onClick={() => setCreating((v) => !v)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-medium text-white hover:bg-sky-500"
          >
            {creating ? <X size={16} /> : <Plus size={16} />}
            {creating ? "取消" : "新建提示词"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowFavOnly((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              showFavOnly
                ? "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            <Star size={14} className={showFavOnly ? "fill-amber-400" : ""} />
            收藏 {state.favorites.length > 0 && `(${state.favorites.length})`}
          </button>
          {["全部", ...promptCategories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat
                  ? "border-sky-600 bg-sky-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {creating && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-5 dark:border-sky-900/50 dark:bg-sky-950/40">
          <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">新建本地提示词</h3>
          <div className="space-y-3">
            <input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="标题，如：Code Review 清单"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <select
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {promptCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <textarea
              value={draft.content}
              onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
              placeholder="提示词正文…"
              rows={5}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={createPrompt}
              disabled={!draft.title.trim() || !draft.content.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={14} /> 保存到本地
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
          <p className="font-medium text-slate-700 dark:text-slate-200">没有匹配的提示词</p>
          <p className="mt-1 text-sm text-slate-500">换个关键词，或新建一条本地提示词。</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((prompt) => {
            const fav = state.favorites.includes(prompt.id);
            const isCustom = prompt.id.startsWith("local-");
            const uses = state.useCounts[prompt.id] ?? prompt.useCount;
            const open = expandedId === prompt.id;
            return (
              <article
                key={prompt.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-sky-200 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium text-slate-900 dark:text-slate-50">{prompt.title}</h3>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      {prompt.category}
                      {isCustom && (
                        <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] dark:bg-slate-800">
                          本地
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFav(prompt.id)}
                    aria-label={fav ? "取消收藏" : "收藏"}
                    className="shrink-0 rounded-lg p-1.5 hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <Star size={16} className={fav ? "fill-amber-400 text-amber-400" : "text-slate-400"} />
                  </button>
                </div>

                <p className={`text-sm leading-6 text-slate-600 dark:text-slate-300 ${open ? "" : "line-clamp-3"}`}>
                  {prompt.content}
                </p>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="text-xs text-sky-500">{uses} 次使用</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setExpandedId(open ? null : prompt.id)}
                      className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      {open ? "收起" : "展开"}
                    </button>
                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => removeCustom(prompt.id)}
                        className="rounded-lg px-2 py-1 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        删除
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => copy(prompt)}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-sky-100 hover:text-sky-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-sky-900/40"
                    >
                      {copiedId === prompt.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                      {copiedId === prompt.id ? "已复制" : "复制"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
