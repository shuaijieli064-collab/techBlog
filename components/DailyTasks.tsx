"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { SectionRule } from "@/components/SectionRule";
import { useWorkspace } from "@/lib/workspace/client";

type Task = { id: number; title: string; tag: string; done: boolean };

export const defaultDailyTasks: Task[] = [
  { id: 1, title: "复习 HashMap 源码分析", tag: "Java", done: false },
  { id: 2, title: "完成算法题 - 两数之和", tag: "算法", done: true },
  { id: 3, title: "更新学习助手项目 TODO", tag: "项目", done: false },
];

const aiPlan: Task[] = [
  { id: 1, title: "精读 ConcurrentHashMap 源码（1h）", tag: "Java", done: false },
  { id: 2, title: "刷 2 道双指针算法题（45m）", tag: "算法", done: false },
  { id: 3, title: "推进「开发者工作台」Supabase 接入方案（1h）", tag: "项目", done: false },
  { id: 4, title: "整理今日学习记录到时间线（15m）", tag: "学习", done: false },
];

export function DailyTasks() {
  const [stored, setTasks] = useWorkspace<Task[]>("daily-tasks", defaultDailyTasks);
  const [draft, setDraft] = useState("");
  const [planned, setPlanned] = useState(false);

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

  const planToday = () => {
    setTasks(aiPlan.map((t) => ({ ...t })));
    setPlanned(true);
  };

  const completed = tasks.filter((t) => t.done).length;

  return (
    <div className="card p-6">
      <SectionRule
        title="今日任务"
        meta={`${String(completed).padStart(2, "0")}/${String(tasks.length).padStart(2, "0")} DONE`}
      />
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={planToday}
          className="inline-flex items-center gap-1.5 border border-wire/50 px-2.5 py-1 font-mono text-[11px] text-wire transition-colors hover:bg-wire/10"
          title="根据学习路线与项目进度生成今日计划（本地模板）"
        >
          <Sparkles size={12} /> AI 规划今天
        </button>
      </div>
      {planned && (
        <p className="mb-3 border border-hair bg-background/70 px-3 py-2 font-mono text-[11px] text-print">
          {"//"} 已按学习路线 + 项目进度生成今日计划，可继续增删。
        </p>
      )}

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
        <button type="button" onClick={add} className="btn-primary px-4">
          添加
        </button>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 && (
          <p className="font-mono text-xs text-muted">{"//"} 暂无任务，添加一条开始今天。</p>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-center gap-3 border border-hair p-3 transition-colors hover:border-wire/60"
          >
            <button
              type="button"
              onClick={() => toggle(task.id)}
              aria-pressed={task.done}
              className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
                task.done ? "border-wire bg-wire text-[#04131b]" : "border-hair"
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
