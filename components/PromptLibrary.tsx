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
          <div key={i} className="h-40 animate-pulse border border-hair bg-panel" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索提示词标题或内容…"
              className="w-full input-base pl-11!"
              aria-label="搜索提示词"
            />
          </div>
          <button
            type="button"
            onClick={() => setCreating((v) => !v)}
            className="btn-primary px-5 py-3"
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
                ? "border-signal bg-signal/10 text-signal"
                : "border-hair bg-panel text-print"
            }`}
          >
            <Star size={14} className={showFavOnly ? "fill-signal" : ""} />
            收藏 {state.favorites.length > 0 && `(${state.favorites.length})`}
          </button>
          {["全部", ...promptCategories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat
                  ? "border-wire bg-wire text-[#04131b]"
                  : "border-hair bg-panel text-print"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {creating && (
        <div className="border border-wire/30 bg-wire/[0.05] p-5">
          <h3 className="mb-4 font-display text-sm font-semibold text-foreground">新建本地提示词</h3>
          <div className="space-y-3">
            <input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="标题，如：Code Review 清单"
              className="input-base"
            />
            <select
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              className="input-base"
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
              className="input-base font-mono"
            />
            <button
              type="button"
              onClick={createPrompt}
              disabled={!draft.title.trim() || !draft.content.trim()}
              className="btn-primary gap-2 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={14} /> 保存到本地
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="border border-dashed border-hair py-16 text-center">
          <p className="font-display font-medium text-foreground">没有匹配的提示词</p>
          <p className="mt-1 text-sm text-print">换个关键词，或新建一条本地提示词。</p>
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
                className="flex flex-col card card-hover p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-display font-medium text-foreground">{prompt.title}</h3>
                    <p className="mt-0.5 text-sm text-print">
                      {prompt.category}
                      {isCustom && (
                        <span className="ml-1.5 bg-raise px-1.5 py-0.5 text-[10px]">
                          本地
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFav(prompt.id)}
                    aria-label={fav ? "取消收藏" : "收藏"}
                    className="shrink-0 p-1.5 hover:bg-raise"
                  >
                    <Star size={16} className={fav ? "fill-signal text-signal" : "text-muted"} />
                  </button>
                </div>

                <p className={`text-sm leading-6 text-print ${open ? "" : "line-clamp-3"}`}>
                  {prompt.content}
                </p>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="text-xs text-wire">{uses} 次使用</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setExpandedId(open ? null : prompt.id)}
                      className="px-2 py-1 text-xs text-print hover:bg-raise"
                    >
                      {open ? "收起" : "展开"}
                    </button>
                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => removeCustom(prompt.id)}
                        className="px-2 py-1 text-xs text-alert hover:bg-alert/10"
                      >
                        删除
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => copy(prompt)}
                      className="inline-flex items-center gap-1 border border-hair bg-transparent px-2.5 py-1 text-xs font-medium text-print hover:border-wire hover:text-wire"
                    >
                      {copiedId === prompt.id ? <Check size={12} className="text-wire" /> : <Copy size={12} />}
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
