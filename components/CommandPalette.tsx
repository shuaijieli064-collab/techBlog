"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  CornerDownLeft,
  FileCode2,
  LayoutGrid,
  Search,
  Trash2,
  Zap,
} from "lucide-react";

import { functionLibrary } from "@/lib/functions";
import { useToast, type PushToast } from "@/components/Toast";

type CommandItem = {
  id: string;
  group: "最近" | "页面" | "工具" | "动作";
  label: string;
  hint: string;
  keywords: string;
  run: (go: (href: string) => void) => void;
};

const pages: Array<{ href: string; label: string; hint: string; keywords: string }> = [
  { href: "/", label: "首页", hint: "hero 与概览", keywords: "home 首页" },
  { href: "/dashboard", label: "工作台", hint: "任务 / 统计 / 本周", keywords: "dashboard 工作台 任务 统计" },
  { href: "/knowledge", label: "知识库", hint: "笔记地图", keywords: "knowledge 知识库 笔记" },
  { href: "/posts", label: "文章列表", hint: "全部博客文章", keywords: "posts 博客 文章 列表" },
  { href: "/posts/admin", label: "文章管理", hint: "新建 / 编辑 / 删除文章", keywords: "posts admin 管理 新建 编辑 删除" },
  { href: "/notes", label: "笔记地图", hint: "结构化笔记", keywords: "notes 笔记 地图" },
  { href: "/archive", label: "归档", hint: "按时间归档", keywords: "archive 归档" },
  { href: "/projects", label: "项目", hint: "项目与 TODO", keywords: "projects 项目 作品" },
  { href: "/learning", label: "学习中心", hint: "路线图 / 算法 / 记录", keywords: "learning 学习 路线 算法" },
  { href: "/growth", label: "成长", hint: "技能 / 轨迹", keywords: "growth 成长 技能 轨迹" },
  { href: "/tools", label: "工具", hint: "函数速查 / 工具集", keywords: "tools 工具 函数" },
  { href: "/ai", label: "AI 中心", hint: "对话 / 模型 / Agents / 提示词", keywords: "ai 人工智能 模型" },
  { href: "/ai/chat", label: "AI 对话", hint: "通用对话工作台", keywords: "ai chat 对话 聊天" },
  { href: "/ai/models", label: "AI 模型", hint: "模型清单", keywords: "ai models 模型" },
  { href: "/ai/agents", label: "AI Agents", hint: "智能体清单", keywords: "agents 智能体" },
  { href: "/ai/prompts", label: "提示词库", hint: "prompt 收藏", keywords: "prompts 提示词" },
  { href: "/about", label: "关于", hint: "站点与作者", keywords: "about 关于 简介" },
  { href: "/profile", label: "个人主页", hint: "个人档案", keywords: "profile 个人 主页" },
  { href: "/search", label: "全局搜索", hint: "跨文章 / 笔记 / 函数检索", keywords: "search 搜索 检索 查找 全文" },
  { href: "/settings", label: "设置与数据", hint: "数据概览 / 导入导出", keywords: "settings 设置 数据 导出 导入 备份" },
];

const buildActions = (toast: PushToast): Array<Omit<CommandItem, "id" | "group">> => [
  {
    label: "记一条学习记录",
    hint: "跳转学习中心并聚焦记录表单",
    keywords: "学习 记录 打卡 study record",
    run: (go) => go("/learning?focus=record"),
  },
  {
    label: "添加今日任务",
    hint: "跳转工作台并聚焦任务输入",
    keywords: "任务 今日 todo task",
    run: (go) => go("/dashboard?focus=task"),
  },
  {
    label: "打开任务箱",
    hint: "查看全部待办 / 今日 / 已完成任务",
    keywords: "任务箱 backlog 待办 task-board",
    run: (go) => go("/dashboard?focus=tasks"),
  },
  {
    label: "AI 规划今天",
    hint: "根据任务箱与学习记录生成今日计划",
    keywords: "ai 规划 计划 今天 plan",
    run: (go) => go("/dashboard?focus=aiplan"),
  },
  {
    label: "本周概览",
    hint: "任务完成 / 学习时长 / 周视图",
    keywords: "本周 概览 复盘 统计 week overview",
    run: (go) => go("/dashboard?focus=week"),
  },
  {
    label: "导出全部数据",
    hint: "下载工作台数据 JSON 快照（自由使用：数据随时可带走）",
    keywords: "导出 备份 下载 export backup json",
    run: async () => {
      try {
        const res = await fetch("/api/workspace/export", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `workspace-export-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast("数据导出成功，快照已开始下载", "success");
      } catch {
        toast("导出失败，请稍后重试", "error");
      }
    },
  },
];

/* ---------- fuzzy matching ---------- */

/**
 * Score how well `text` matches query `q`:
 * prefix hit > contiguous hit > subsequence hit. Returns 0 when no match.
 */
function fuzzyScore(text: string, q: string): number {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === 0) return 1200;
  if (idx > 0) return 800 - idx;

  let ti = 0;
  let score = 0;
  let streak = 0;
  for (const ch of q) {
    const found = lower.indexOf(ch, ti);
    if (found === -1) return 0;
    streak = found === ti ? streak + 1 : 0;
    score += 12 + streak * 5 - found * 0.08;
    ti = found + 1;
  }
  return score * 0.55;
}

function itemScore(item: CommandItem, q: string): number {
  return (
    fuzzyScore(item.label, q) * 3 +
    fuzzyScore(item.keywords, q) * 1.2 +
    fuzzyScore(item.hint, q)
  );
}

/* ---------- recent pages ---------- */

const RECENT_KEY = "nexus:recent-pages";
const RECENT_MAX = 5;

type RecentEntry = { href: string; label: string };

function readRecents(): RecentEntry[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is RecentEntry =>
          !!x &&
          typeof x === "object" &&
          typeof (x as RecentEntry).href === "string" &&
          typeof (x as RecentEntry).label === "string",
      )
      .slice(0, RECENT_MAX);
  } catch {
    return [];
  }
}

function writeRecents(list: RecentEntry[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX)));
  } catch {
    /* storage unavailable — recents are best-effort */
  }
}

function recordRecent(href: string, label: string) {
  const next = [{ href, label }, ...readRecents().filter((r) => r.href !== href)];
  writeRecents(next);
}

function buildIndex(toast: PushToast): CommandItem[] {
  const pageItems: CommandItem[] = pages.map((p) => ({
    id: `page:${p.href}`,
    group: "页面",
    label: p.label,
    hint: p.hint,
    keywords: `${p.keywords} ${p.label}`,
    run: (go) => {
      recordRecent(p.href, p.label);
      go(p.href);
    },
  }));

  const toolItems: CommandItem[] = functionLibrary.map((f) => ({
    id: `tool:${f.id}`,
    group: "工具",
    label: f.name,
    hint: `${f.language} · ${f.category}`,
    keywords: `${f.name} ${f.tags.join(" ")} ${f.category} ${f.language}`,
    run: (go) => go("/tools?q=" + encodeURIComponent(f.name)),
  }));

  const actionItems: CommandItem[] = buildActions(toast).map((a, i) => ({
    id: `action:${i}`,
    group: "动作",
    ...a,
  }));

  return [...pageItems, ...toolItems, ...actionItems];
}

const groupOrder: Array<CommandItem["group"]> = ["页面", "工具", "动作"];

export function CommandPalette() {
  const router = useRouter();
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recents, setRecents] = useState<RecentEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const go = useMemo(() => (href: string) => void router.push(href), [router]);
  const index = useMemo(() => buildIndex(toast), [toast]);

  useEffect(() => {
    const openPalette = () => {
      setOpen((v) => !v);
      setQuery("");
      setActive(0);
      if (!open) setRecents(readRecents());
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    const onToggle = () => openPalette();
    document.addEventListener("keydown", onKey);
    window.addEventListener("command-palette:toggle", onToggle);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("command-palette:toggle", onToggle);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index;
    return index
      .map((item) => ({ item, score: itemScore(item, q) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.item);
  }, [query, index]);

  const safeActive = Math.min(active, Math.max(filtered.length - 1, 0));

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${safeActive}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [safeActive]);

  if (!open) return null;

  const runItem = (item: CommandItem) => {
    setOpen(false);
    item.run(go);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((v) => Math.min(v + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((v) => Math.max(v - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[safeActive];
      if (item) runItem(item);
    }
  };

  const showRecents = !query.trim() && recents.length > 0;

  // flat ordering: recents (when shown) come first so ↑/↓ matches the render
  const recentItems: CommandItem[] = showRecents
    ? recents.map((r) => ({
        id: `recent:${r.href}`,
        group: "最近" as const,
        label: r.label,
        hint: r.href,
        keywords: r.href,
        run: (goFn: (href: string) => void) => {
          recordRecent(r.href, r.label);
          goFn(r.href);
        },
      }))
    : [];

  const commandRows: Array<{ group: string; items: CommandItem[] }> = [
    ...(recentItems.length > 0 ? [{ group: "最近", items: recentItems }] : []),
    ...groupOrder
      .map((g) => ({ group: g, items: filtered.filter((i) => i.group === g) }))
      .filter((r) => r.items.length > 0),
  ];

  let flatActive = -1;
  const flatIndex = new Map<string, number>();
  commandRows.forEach((r) => {
    r.items.forEach((i) => {
      flatActive += 1;
      flatIndex.set(i.id, flatActive);
    });
  });

  const iconFor = (group: string) =>
    group === "最近" ? Clock : group === "页面" ? LayoutGrid : group === "工具" ? FileCode2 : Zap;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-label="命令面板"
    >
      <div className="glass w-full max-w-xl overflow-hidden rounded-xl border border-hair shadow-[0_24px_64px_-24px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-3 border-b border-hair px-4 py-3">
          <Zap size={15} className="shrink-0 text-wire" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="搜索页面、工具或执行操作…"
            className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted focus:outline-none"
            aria-label="搜索命令"
          />
          {query && (
            <span className="num shrink-0 font-mono text-[11px] text-muted">
              {filtered.length} 项
            </span>
          )}
          <kbd className="kbd shrink-0">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[46vh] overflow-y-auto p-2">
          {commandRows.length === 0 && (
            <div className="px-3 py-8 text-center">
              {query.trim() ? (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    go(`/search?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="inline-flex items-center gap-2 font-mono text-xs text-print transition-colors hover:text-wire"
                >
                  <Search size={13} className="text-wire" />
                  {"//"} 未匹配命令 — 在全局搜索中查找「{query.trim()}」
                </button>
              ) : (
                <p className="font-mono text-xs text-muted">
                  {"//"} 没有匹配的结果 — 试试「学习」「任务」「Spring」
                </p>
              )}
            </div>
          )}
          {commandRows.map((row) => (
            <div key={row.group} className="mb-1">
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  {row.group}
                </span>
                {row.group === "最近" && (
                  <button
                    type="button"
                    onClick={() => {
                      writeRecents([]);
                      setRecents([]);
                    }}
                    className="flex items-center gap-1 font-mono text-[10px] text-muted transition-colors hover:text-alert"
                    aria-label="清除最近访问记录"
                  >
                    <Trash2 size={10} />
                    清除
                  </button>
                )}
              </div>
              {row.items.map((item) => {
                const flat = flatIndex.get(item.id) ?? 0;
                const isActive = flat === safeActive;
                const Icon = iconFor(row.group);
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-index={flat}
                    onPointerMove={() => setActive(flat)}
                    onClick={() => runItem(item)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                      isActive ? "bg-wire/10 shadow-[inset_2px_0_0_var(--wire)]" : "hover:bg-raise"
                    }`}
                  >
                    <Icon
                      size={14}
                      className={`shrink-0 ${isActive ? "text-wire" : "text-muted"}`}
                    />
                    <span
                      className={`flex-1 truncate text-sm ${
                        isActive ? "text-foreground" : "text-print"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="hidden shrink-0 font-mono text-[11px] text-muted sm:block">
                      {item.hint}
                    </span>
                    {isActive && (
                      <CornerDownLeft size={13} className="shrink-0 text-wire" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
