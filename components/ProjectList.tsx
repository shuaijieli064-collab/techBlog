"use client";

import Link from "next/link";
import { Calendar, GitBranch, ExternalLink } from "lucide-react";

import { ProjectTodos } from "@/components/ProjectTodos";
import { SectionRule } from "@/components/SectionRule";
import { projects, statusMap, projectProgressFrom, type ProjectTodosMap } from "@/lib/projects";
import { useWorkspace } from "@/lib/workspace/client";

const emptyTodos: ProjectTodosMap = {};

export function ProjectList() {
  const [all] = useWorkspace<ProjectTodosMap>("project-todos", emptyTodos);
  const stored: ProjectTodosMap =
    all && typeof all === "object" && !Array.isArray(all) ? all : emptyTodos;

  return (
    <div className="space-y-8">
      {projects.map((project) => {
        const status = statusMap[project.status];
        const progress = projectProgressFrom(stored, project);

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
                    className="font-display text-2xl font-bold text-foreground transition-colors hover:text-wire"
                  >
                    {project.title}
                  </Link>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-base text-print">{project.description}</p>
                <Link
                  href={`/projects/${project.id}`}
                  className="mt-3 inline-block text-sm font-medium text-wire hover:opacity-80"
                >
                  查看详情
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-print">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{project.startDate}</span>
                </div>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-wire"
                >
                  <GitBranch size={14} />
                  <span>GitHub</span>
                </a>
                {project.demo && (
                  <Link
                    href={project.demo}
                    className="flex items-center gap-1.5 hover:text-wire"
                  >
                    <ExternalLink size={14} />
                    <span>Demo</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-print">进度</span>
                <span className="text-sm font-medium text-foreground">
                  {progress}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-hair">
                <div
                  className="h-full rounded-full bg-wire transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-print">技术栈</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-raise px-3 py-1 text-xs font-medium text-print"
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
  const [rawAll] = useWorkspace<ProjectTodosMap>("project-todos", emptyTodos);
  const all: ProjectTodosMap =
    rawAll && typeof rawAll === "object" && !Array.isArray(rawAll) ? rawAll : emptyTodos;

  const avg = Math.round(
    projects.reduce((s, p) => s + projectProgressFrom(all, p), 0) / projects.length,
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
          const value = projectProgressFrom(all, p);
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
              <div className="h-1.5 bg-hair/50">
                <div
                  className="h-full bg-wire"
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
