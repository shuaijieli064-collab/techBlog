import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, GitBranch, ExternalLink, BookOpen, CheckCircle2 } from "lucide-react";

import { projects, getProjectById, statusMap } from "@/lib/projects";
import { pageMeta } from "@/lib/site";
import { ProjectDetailTodos, ProjectProgress } from "@/components/ProjectDetail";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectById(slug);
  if (!project) return { title: "项目未找到" };
  return {
    title: `${project.title} | 项目中心`,
    description: project.description,
    ...pageMeta(`/projects/${slug}`),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectById(slug);
  if (!project) notFound();

  const status = statusMap[project.status];

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-wire hover:opacity-80"
        >
          <ArrowLeft size={14} /> 返回项目中心
        </Link>
      </div>

      <article className="card p-6 sm:p-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-print">
            <Calendar size={14} /> {project.startDate}
          </span>
        </div>

        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-print">
          {project.longDescription}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full bg-raise px-3 py-1 text-xs font-medium text-print"
            >
              {t}
            </span>
          ))}
        </div>

        <ProjectProgress project={project} />

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary gap-2 px-4 py-2"
          >
            <GitBranch size={15} /> GitHub
          </a>
          {project.demo && (
            <Link
              href={project.demo}
              className="btn-primary gap-2 px-4 py-2"
            >
              <ExternalLink size={15} /> 在线演示
            </Link>
          )}
          {project.docs && (
            <a
              href={project.docs}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary gap-2 px-4 py-2"
            >
              <BookOpen size={15} /> 文档
            </a>
          )}
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold font-display text-foreground">亮点</h2>
          <ul className="space-y-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-print">
                <CheckCircle2 size={16} className="mt-1 shrink-0 text-wire" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>

        <ProjectDetailTodos project={project} />
      </article>
    </main>
  );
}
