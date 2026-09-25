"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, GitBranch, ExternalLink } from "lucide-react";

import { ProjectTodos } from "@/components/ProjectTodos";
import { SectionRule } from "@/components/SectionRule";
import { projects, statusMap } from "@/lib/projects";

export function ProjectList() {
  return (
    <div className="space-y-8">
      {projects.map((project) => {
        const status = statusMap[project.status];

        return (
          <article
            key={project.id}
            className="card card-hover p-6 sm:p-8"
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-2xl font-bold text-slate-900 transition-colors hover:text-wire dark:text-slate-50 dark:hover:text-wire"
                  >
                    {project.title}
                  </Link>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-300">{project.description}</p>
                <Link
                  href={`/projects/${project.id}`}
                  className="mt-3 inline-block text-sm font-medium text-wire hover:opacity-80"
                >
                  查看详情 →
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{project.startDate}</span>
                </div>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-wire dark:hover:text-wire"
                >
                  <GitBranch size={14} />
                  <span>GitHub</span>
                </a>
                {project.demo && (
                  <Link
                    href={project.demo}
                    className="flex items-center gap-1.5 hover:text-wire dark:hover:text-wire"
                  >
                    <ExternalLink size={14} />
                    <span>Demo</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">进度</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {project.progress}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-hair">
                <div
                  className="h-full rounded-full bg-wire transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">技术栈</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <ProjectTodos projectId={project.id} defaultTodos={project.todos} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ProjectProgressSummary() {
  const [progress, setProgress] = useState(
    Object.fromEntries(projects.map((p) => [p.id, p.progress])),
  );

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem("projects:todos:v1");
        if (!raw) return;
        const all = JSON.parse(raw) as Record<string, Array<{ done: boolean }>>;
        setProgress((prev) => {
          const next = { ...prev };
          for (const p of projects) {
            const todos = all[p.id];
            if (Array.isArray(todos) && todos.length > 0) {
              const done = todos.filter((t) => t.done).length;
              next[p.id] = Math.round((done / todos.length) * 100);
            }
          }
          return next;
        });
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const avg = Math.round(
    projects.reduce((s, p) => s + (progress[p.id] ?? p.progress), 0) / projects.length,
  );

  return (
    <div className="card p-6">
      <SectionRule title="项目进度" href="/projects" metaLabel="全部项目" />
      <div className="mb-4 flex items-baseline gap-2">
        <span className="font-mono text-3xl font-bold text-foreground">{avg}%</span>
        <span className="font-mono text-xs text-muted">AVG 完成度</span>
      </div>
      <div className="space-y-3">
        {projects.map((p) => {
          const value = progress[p.id] ?? p.progress;
          return (
            <div key={p.id}>
              <div className="mb-1.5 flex justify-between font-mono text-xs">
                <Link
                  href={`/projects/${p.id}`}
                  className="text-print transition-colors hover:text-wire"
                >
                  {p.title}
                </Link>
                <span className="text-muted">{value}%</span>
              </div>
              <div className="h-1.5 rounded-[2px] bg-hair/50">
                <div
                  className="h-full rounded-[2px] bg-wire"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
