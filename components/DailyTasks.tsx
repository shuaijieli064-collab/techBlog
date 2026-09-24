"use client";

import { useEffect, useState } from "react";

type Task = { id: number; title: string; tag: string; done: boolean };

const defaultTasks: Task[] = [
  { id: 1, title: "复习 HashMap 源码分析", tag: "Java", done: false },
  { id: 2, title: "完成算法题 - 两数之和", tag: "算法", done: true },
  { id: 3, title: "更新学习助手项目 TODO", tag: "项目", done: false },
];

const STORAGE_KEY = "dashboard:tasks:v1";

export function DailyTasks() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as Task[];
        if (Array.isArray(parsed)) setTasks(parsed);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const persist = (next: Task[]) => {
    setTasks(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const toggle = (id: number) => {
    persist(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const add = () => {
    const title = draft.trim();
    if (!title) return;
    const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    persist([...tasks, { id: nextId, title, tag: "自定义", done: false }]);
    setDraft("");
  };

  const remove = (id: number) => {
    persist(tasks.filter((t) => t.id !== id));
  };

  const completed = tasks.filter((t) => t.done).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">今日任务</h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {completed}/{tasks.length} 完成
        </span>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
          placeholder="添加任务，回车确认…"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          aria-label="新任务"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          添加
        </button>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 && (
          <p className="text-sm text-slate-500">暂无任务，添加一条开始今天。</p>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800"
          >
            <button
              type="button"
              onClick={() => toggle(task.id)}
              aria-pressed={task.done}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                task.done ? "border-sky-500 bg-sky-500" : "border-slate-300 dark:border-slate-600"
              }`}
              aria-label={task.done ? "标记未完成" : "标记完成"}
            >
              {task.done && <span className="text-[10px] font-bold text-white">✓</span>}
            </button>
            <span
              className={`flex-1 text-sm ${
                task.done ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-200"
              }`}
            >
              {task.title}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {task.tag}
            </span>
            <button
              type="button"
              onClick={() => remove(task.id)}
              className="opacity-0 transition-opacity group-hover:opacity-100 text-xs text-rose-500 hover:text-rose-600"
              aria-label="删除任务"
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
