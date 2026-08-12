import Link from "next/link";
import { notFound } from "next/navigation";

import { getPostBySlug, posts } from "@/lib/posts";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "文章未找到" };
  }

  return {
    title: `${post.title} | 林晨的博客`,
    description: post.excerpt,
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8 lg:p-10">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-sky-600">
          <span>{post.category}</span>
          <span className="text-slate-400">•</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
          {post.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span>{post.author}</span>
          <span>•</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-sky-400"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <div className="mt-10 space-y-8 text-lg leading-8 text-slate-700 dark:text-slate-200">
          {post.sections.map((section) => (
            <section key={section.heading ?? section.paragraphs[0]}>
              {section.heading && (
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  {section.heading}
                </h2>
              )}

              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>

      <div className="mt-10 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
        <Link href="/posts" className="font-medium text-slate-700 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400">
          ← 返回文章列表
        </Link>
        <Link href="/" className="font-medium text-slate-700 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400">
          回到首页 →
        </Link>
      </div>
    </main>
  );
}
