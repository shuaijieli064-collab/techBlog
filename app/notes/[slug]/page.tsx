import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";

import { Markdown } from "@/components/Markdown";
import { getNoteBySlug, notes } from "@/lib/notes";
import { getPostBySlug } from "@/lib/posts";

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return { title: "笔记未找到" };
  return {
    title: `${note.title} | 笔记`,
    description: note.summary,
  };
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  const related = (note.relatedPostSlugs ?? [])
    .map((s) => getPostBySlug(s))
    .filter(Boolean);

  const body = note.content.replace(/^#\s+[^\n]+\n+/, "");

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400"
        >
          <ArrowLeft size={14} /> 返回笔记地图
        </Link>
      </div>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-10">
        <header className="mb-8 border-b border-slate-100 pb-6 dark:border-slate-800">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="rounded-full bg-sky-50 px-2.5 py-1 font-medium text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
              {note.group}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {note.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {note.readTime}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            {note.title}
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
            {note.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {note.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
              >
                <Tag size={11} /> {t}
              </span>
            ))}
          </div>
        </header>

        <Markdown content={body} />

        {related.length > 0 && (
          <section className="mt-10 border-t border-slate-100 pt-6 dark:border-slate-800">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              相关文章
            </h2>
            <div className="space-y-2">
              {related.map(
                (post) =>
                  post && (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      {post.title}
                    </Link>
                  ),
              )}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
