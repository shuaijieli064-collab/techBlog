"use client";

import { CheckCircle2, Circle } from "lucide-react";

import { useWorkspace } from "@/lib/workspace/client";

type Todo = { text: string; done: boolean };

const emptyAll: Record<string, Todo[]> = {};

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
  const [rawAll, setAll] = useWorkspace<Record<string, Todo[]>>("project-todos", emptyAll);
  const all =
    rawAll && typeof rawAll === "object" && !Array.isArray(rawAll) ? rawAll : emptyAll;
  const todos = Array.isArray(all[projectId]) ? all[projectId] : defaultTodos;

  const toggle = (index: number) => {
    const next = todos.map((t, i) => (i === index ? { ...t, done: !t.done } : t));
    setAll({ ...all, [projectId]: next });
  };

  const completed = todos.filter((t) => t.done).length;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-print">TODO</h3>
        <span className="text-xs text-muted">
          {completed}/{todos.length}
        </span>
      </div>
      <div className="space-y-2">
        {todos.map((todo, i) => (
          <button
            key={`${projectId}-${todo.text}`}
            type="button"
            onClick={() => toggle(i)}
            className="flex w-full items-center gap-2.5 px-1 py-0.5 text-left transition-colors hover:bg-raise"
            aria-pressed={todo.done}
          >
            {todo.done ? (
              <CheckCircle2 size={16} className="text-wire" />
            ) : (
              <Circle size={16} className="text-muted" />
            )}
            <span
              className={`text-sm ${
                todo.done ? "text-muted line-through" : "text-foreground"
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
