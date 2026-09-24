"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

type Todo = { text: string; done: boolean };

const STORAGE_KEY = "projects:todos:v1";

const defaultByProject: Record<string, Todo[]> = {
  "study-assistant": [
    { text: "用户系统", done: true },
    { text: "AI 对话", done: true },
    { text: "学习计划", done: false },
    { text: "数据统计", done: false },
    { text: "部署上线", done: false },
  ],
  "tech-blog": [
    { text: "Dashboard", done: true },
    { text: "博客系统", done: true },
    { text: "项目管理", done: false },
    { text: "学习中心", done: false },
    { text: "AI Center", done: false },
  ],
  "algorithm-tracker": [
    { text: "题目分类", done: true },
    { text: "进度追踪", done: true },
    { text: "错题本", done: true },
  ],
};

export function ProjectTodos({ projectId, defaultTodos }: { projectId: string; defaultTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(defaultTodos);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const all = JSON.parse(raw) as Record<string, Todo[]>;
        if (all[projectId]) setTodos(all[projectId]);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [projectId]);

  const toggle = (index: number) => {
    setTodos((prev) => {
      const next = prev.map((t, i) => (i === index ? { ...t, done: !t.done } : t));
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const all = raw ? (JSON.parse(raw) as Record<string, Todo[]>) : {};
        all[projectId] = next;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const completed = todos.filter((t) => t.done).length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">TODO</h3>
        <span className="text-xs text-slate-400">
          {completed}/{todos.length}
        </span>
      </div>
      <div className="space-y-2">
        {todos.map((todo, i) => (
          <button
            key={`${projectId}-${todo.text}`}
            type="button"
            onClick={() => toggle(i)}
            className="flex w-full items-center gap-2.5 rounded-lg px-1 py-0.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
            aria-pressed={todo.done}
          >
            {todo.done ? (
              <CheckCircle2 size={16} className="text-sky-500" />
            ) : (
              <Circle size={16} className="text-slate-300 dark:text-slate-600" />
            )}
            <span
              className={`text-sm ${
                todo.done ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-200"
              }`}
            >
              {todo.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { defaultByProject as projectTodoDefaults };
