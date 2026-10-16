"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

import { SectionRule } from "@/components/SectionRule";
import { useToast } from "@/components/Toast";
import { defaultData, defaultMastered } from "@/components/LearningRoadmap";
import type { BoardTask } from "@/components/TaskBoard";
import { useWorkspace } from "@/lib/workspace/client";

export type DailyTask = { id: number; title: string; tag: string; done: boolean };

export const defaultDailyTasks: DailyTask[] = [
  { id: 1, title: "复习 HashMap 源码分析", tag: "Java", done: false },
  { id: 2, title: "完成算法题 - 两数之和", tag: "算法", done: true },
  { id: 3, title: "更新学习助手项目 TODO", tag: "项目", done: false },
];

const aiPlan: DailyTask[] = [
  { id: 1, title: "精读 ConcurrentHashMap 源码（1h）", tag: "Java", done: false },
  { id: 2, title: "刷 2 道双指针算法题（45m）", tag: "算法", done: false },
  { id: 3, title: "推进「开发者工作台」Supabase 接入方案（1h）", tag: "项目", done: false },
  { id: 4, title: "整理今日学习记录到时间线（15m）", tag: "学习", done: false },
];

const PLAN_SYSTEM =
  "你是一名个人开发者工作台规划助手。根据用户提供的今日任务、任务箱待办、学习路线图与算法进度，规划今天最值得做的 3-5 个任务。只输出一个 JSON 数组，不要输出任何其他文字或代码块标记，格式：[{\"title\":\"任务标题\",\"tag\":\"类别\"}]。类别从 Java / 算法 / 后端 / 数据库 / 前端 / 项目 / 学习 / 其他 中选择。";

function parsePlannedTasks(text: string): Array<{ title: string; tag: string }> | null {
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const arr = JSON.parse(cleaned.slice(start, end + 1)) as unknown;
    if (!Array.isArray(arr)) return null;
    const out: Array<{ title: string; tag: string }> = [];
    for (const x of arr) {
      if (x && typeof x === "object" && typeof (x as { title?: unknown }).title === "string") {
        const title = ((x as { title: string }).title).trim();
        if (!title) continue;
        const tag =
          typeof (x as { tag?: unknown }).tag === "string"
            ? ((x as { tag: string }).tag).trim() || "自定义"
            : "自定义";
        out.push({ title, tag });
      }
    }
    return out.length > 0 ? out : null;
  } catch {
    return null;
  }
}

export function DailyTasks() {
  const toast = useToast();
  const [stored, setTasks] = useWorkspace<DailyTask[]>("daily-tasks", defaultDailyTasks);
  const [board] = useWorkspace<BoardTask[]>("task-board", []);
  const [storedMastered] = useWorkspace<boolean[][]>("learning-mastered", defaultMastered);
  const [storedAlgorithms] = useWorkspace<typeof defaultData.algorithms>(
    "algorithms",
    defaultData.algorithms,
  );
  const [draft, setDraft] = useState("");
  const [planning, setPlanning] = useState(false);

  const tasks = Array.isArray(stored) ? stored : defaultDailyTasks;

  const toggle = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const add = () => {
    const title = draft.trim();
    if (!title) return;
    const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    setTasks([...tasks, { id: nextId, title, tag: "自定义", done: false }]);
    setDraft("");
  };

  const remove = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const fallbackPlan = () => {
    const next: DailyTask[] = [];
    let seq = 0;

    const backlog = (Array.isArray(board) ? board : []).filter(
      (t) => t.status === "backlog",
    );
    backlog.slice(0, 2).forEach((t) => {
      seq += 1;
      next.push({ id: seq, title: t.title, tag: t.tag, done: false });
    });

    const mastered = Array.isArray(storedMastered) ? storedMastered : defaultMastered;
    for (let i = 0; i < defaultData.roadmap.length; i++) {
      const section = defaultData.roadmap[i];
      const flags = mastered[i] ?? section.defaults;
      const firstUndone = flags.findIndex((v) => !v);
      if (firstUndone !== -1) {
        seq += 1;
        next.push({
          id: seq,
          title: `复习 ${section.category} · ${section.items[firstUndone]}`,
          tag: "学习",
          done: false,
        });
        break;
      }
    }

    const algorithms = Array.isArray(storedAlgorithms)
      ? storedAlgorithms
      : defaultData.algorithms;
    algorithms
      .filter((a) => a.mastered < a.count)
      .sort((a, b) => b.count - b.mastered - (a.count - a.mastered))
      .slice(0, 2)
      .forEach((a) => {
        seq += 1;
        next.push({
          id: seq,
          title: `刷题 ${a.name}（剩余 ${a.count - a.mastered} 题）`,
          tag: "算法",
          done: false,
        });
      });

    setTasks(next.length > 0 ? next.slice(0, 5) : aiPlan.map((t) => ({ ...t })));
  };

  const planToday = async () => {
    if (planning) return;
    setPlanning(true);

    const backlog = (Array.isArray(board) ? board : []).filter((t) => t.status === "backlog");
    const mastered = Array.isArray(storedMastered) ? storedMastered : defaultMastered;
    const algorithms = Array.isArray(storedAlgorithms)
      ? storedAlgorithms
      : defaultData.algorithms;
    const context = [
      "【今日任务现状】",
      tasks.length ? tasks.map((t) => `- ${t.done ? "[x]" : "[ ]"} ${t.title}（${t.tag}）`).join("\n") : "（暂无任务）",
      "",
      "【任务箱待办】",
      backlog.length ? backlog.map((t) => `- ${t.title}`).join("\n") : "（暂无待办）",
      "",
      "【学习路线图进度】",
      defaultData.roadmap
        .map((sec, i) => {
          const flags = mastered[i] ?? sec.defaults;
          const undone = sec.items.filter((_, j) => !flags[j]);
          return undone.length ? `- ${sec.category}：未掌握 ${undone.join("、")}` : `- ${sec.category}：已完成`;
        })
        .join("\n"),
      "",
      "【算法练习】",
      algorithms
        .filter((a) => a.mastered < a.count)
        .map((a) => `- ${a.name} ${a.mastered}/${a.count}（剩余 ${a.count - a.mastered}）`)
        .join("\n"),
      "",
      "请基于以上真实数据规划今天最值得做的 3-5 个任务，只输出 JSON 数组。",
    ].join("\n");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: PLAN_SYSTEM },
            { role: "user", content: context },
          ],
          temperature: 0.4,
          max_tokens: 1024,
        }),
      });
      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
          const errBody = (await res.json()) as { error?: { message?: string } | string };
          if (typeof errBody.error === "string") detail = errBody.error;
          else if (errBody.error && typeof errBody.error === "object" && errBody.error.message) {
            detail = errBody.error.message;
          }
        } catch {
          /* ignore parse error */
        }
        throw new Error(detail);
      }
      const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const content = data.choices?.[0]?.message?.content ?? "";
      const parsed = parsePlannedTasks(content);
      if (!parsed || parsed.length === 0) {
        throw new Error("模型未返回有效任务列表");
      }
      const next: DailyTask[] = parsed.slice(0, 5).map((t, i) => ({
        id: i + 1,
        title: t.title,
        tag: t.tag,
        done: false,
      }));
      setTasks(next);
      toast(`已根据真实数据生成 ${next.length} 条今日计划`, "success");
    } catch (err) {
      fallbackPlan();
      toast(
        `LLM 规划失败（${err instanceof Error ? err.message : "未知错误"}），已回落本地规则`,
        "error",
      );
    } finally {
      setPlanning(false);
    }
  };

  const completed = tasks.filter((t) => t.done).length;

  return (
    <div id="daily-tasks" className="card relative overflow-hidden p-6">
      <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-wire to-transparent opacity-50" />
      <SectionRule
        title="今日任务"
        meta={`${String(completed).padStart(2, "0")}/${String(tasks.length).padStart(2, "0")} DONE`}
      />
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          id="ai-plan-trigger"
          onClick={() => planToday()}
          disabled={planning}
          className="press inline-flex items-center gap-1.5 rounded-full border border-wire/50 px-2.5 py-1 font-mono text-[11px] text-wire transition-colors hover:bg-wire/10 disabled:opacity-60"
          title="由真实 LLM 结合任务箱、学习路线与算法进度生成今日计划；失败自动回落本地规则"
        >
          {planning ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          {planning ? "规划中…" : "AI 规划今天"}
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
          placeholder="添加任务，回车确认…"
          className="input-base flex-1"
          aria-label="新任务"
        />
        <button type="button" onClick={add} className="btn-primary press">
          添加
        </button>
      </div>

      <div className="space-y-2 stagger-in">
        {tasks.length === 0 && (
          <p className="font-mono text-xs text-muted">{"//"} 暂无任务，添加一条开始今天。</p>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-center gap-3 rounded-lg border border-hair p-3 transition-colors hover:border-wire/60"
          >
            <button
              type="button"
              onClick={() => toggle(task.id)}
              aria-pressed={task.done}
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-all ${
                task.done ? "border-wire bg-wire text-[#04131b]" : "border-hair hover:border-wire/60"
              }`}
              aria-label={task.done ? "标记未完成" : "标记完成"}
            >
              {task.done && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                  <path d="M4 12l5 5L20 6" />
                </svg>
              )}
            </button>
            <span
              className={`flex-1 text-sm ${
                task.done ? "text-muted line-through" : "text-foreground"
              }`}
            >
              {task.title}
            </span>
            <span className="chip">{task.tag}</span>
            <button
              type="button"
              onClick={() => remove(task.id)}
              className="font-mono text-xs text-muted opacity-0 transition-opacity hover:text-signal group-hover:opacity-100 focus-visible:opacity-100"
              aria-label="删除任务"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
