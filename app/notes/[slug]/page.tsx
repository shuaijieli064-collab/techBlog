import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";

import { Markdown } from "@/components/Markdown";
import { ReadingProgress } from "@/components/ReadingProgress";
import { getNoteBySlug, notes } from "@/lib/notes";
import { getPostBySlug } from "@/lib/posts";
import { pageMeta } from "@/lib/site";

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
    ...pageMeta(`/notes/${slug}`),
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

  const related = (note.relatedPostSlugs ?? []).flatMap((s) => {
    const post = getPostBySlug(s);
    return post ? [post] : [];
  });

  const body = note.content.replace(/^#\s+[^\n]+\n+/, "");

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <ReadingProgress />
      <div className="mb-6">
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-wire hover:opacity-80"
        >
          <ArrowLeft size={14} /> 返回笔记地图
        </Link>
      </div>

      <article className="card p-6 sm:p-10">
        <header className="mb-8 border-b border-hair pb-6">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-print">
            <span className="bg-wire/10 px-2.5 py-1 font-medium text-wire">
              {note.group}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {note.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {note.readTime}
            </span>
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground sm:text-4xl">
            {note.title}
          </h1>
          <p className="mt-3 text-base leading-7 text-print">
            {note.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {note.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full border border-hair bg-raise px-2.5 py-1 text-xs text-print"
              >
                <Tag size={11} /> {t}
              </span>
            ))}
          </div>
        </header>

        <Markdown content={body} />

        {related.length > 0 && (
          <section className="mt-10 border-t border-hair pt-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-print">
              相关文章
            </h2>
            <div className="space-y-2">
              {related.map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="block rounded-lg border border-hair bg-background px-4 py-3 text-sm text-print transition-colors hover:border-wire hover:text-wire"
                >
                  {post.title}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
