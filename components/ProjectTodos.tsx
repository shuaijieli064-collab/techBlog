"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";

import { useWorkspace } from "@/lib/workspace/client";

type Todo = { text: string; done: boolean };

const emptyAll: Record<string, Todo[]> = {};

export function ProjectTodos({ projectId, defaultTodos }: { projectId: string; defaultTodos: Todo[] }) {
  const [rawAll, setAll] = useWorkspace<Record<string, Todo[]>>("project-todos", emptyAll);
  const all =
    rawAll && typeof rawAll === "object" && !Array.isArray(rawAll) ? rawAll : emptyAll;
  const todos = Array.isArray(all[projectId]) ? all[projectId] : defaultTodos;
  const [draft, setDraft] = useState("");

  const toggle = (index: number) => {
    const next = todos.map((t, i) => (i === index ? { ...t, done: !t.done } : t));
    setAll({ ...all, [projectId]: next });
  };

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    setAll({ ...all, [projectId]: [...todos, { text, done: false }] });
    setDraft("");
  };

  const remove = (index: number) => {
    setAll({ ...all, [projectId]: todos.filter((_, i) => i !== index) });
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
          <div key={`${projectId}-${i}-${todo.text}`} className="group flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => toggle(i)}
              className="flex flex-1 items-center gap-2.5 px-1 py-0.5 text-left transition-colors hover:bg-raise"
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
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 p-1 text-muted opacity-0 transition-all hover:bg-alert/10 hover:text-alert focus-visible:opacity-100 group-hover:opacity-100"
              aria-label="删除 TODO"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
          placeholder="添加 TODO，回车确认…"
          className="input-base flex-1"
          aria-label="新 TODO"
        />
        <button type="button" onClick={add} className="btn-primary btn-xs gap-1">
          <Plus size={12} /> 添加
        </button>
      </div>
    </div>
  );
}
