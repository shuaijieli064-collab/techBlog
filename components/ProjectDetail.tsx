"use client";

import { CheckCircle2, Circle } from "lucide-react";

import { projectProgressFrom, type Project, type ProjectTodosMap } from "@/lib/projects";
import { useWorkspace } from "@/lib/workspace/client";

const emptyTodos: ProjectTodosMap = {};

function useProjectTodos(): ProjectTodosMap {
  const [raw] = useWorkspace<ProjectTodosMap>("project-todos", emptyTodos);
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return emptyTodos;
  return raw;
}

export function ProjectProgress({ project }: { project: Project }) {
  const all = useProjectTodos();
  const progress = projectProgressFrom(all, project);

  return (
    <div className="mt-8">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-print">进度</span>
        <span className="font-medium text-foreground">{progress}%</span>
      </div>
      <div className="h-2 rounded-full bg-hair">
        <div
          className="h-full rounded-full bg-wire transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function ProjectDetailTodos({ project }: { project: Project }) {
  const all = useProjectTodos();
  const todos = Array.isArray(all[project.id]) ? all[project.id] : project.todos;
  const completed = todos.filter((t) => t.done).length;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold font-display text-foreground">TODO</h2>
        <span className="text-sm text-muted">
          {completed}/{todos.length}
        </span>
      </div>
      <div className="space-y-2">
        {todos.map((todo) => (
          <div key={todo.text} className="flex items-center gap-2.5">
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
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted">列表页的 TODO 勾选状态会保存在本机。</p>
    </section>
  );
}
