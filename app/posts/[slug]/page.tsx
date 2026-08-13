import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareActions } from "@/components/ShareActions";
import {
  getAdjacentPosts,
  getPostBySlug,
  getRelatedPosts,
  posts,
} from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import { slugify } from "@/lib/utils";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "文章未找到" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${siteConfig.url}/posts/${post.slug}`,
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const headings = post.sections
    .filter((section) => section.heading)
    .map((section) => ({
      title: section.heading as string,
      id: slugify(section.heading as string),
    }));

  const relatedPosts = getRelatedPosts(post.slug, 3);
  const { prev, next } = getAdjacentPosts(post.slug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    url: `${siteConfig.url}/posts/${post.slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <ReadingProgress />

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8 lg:p-10">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-sky-600">
            <span>{post.category}</span>
            <span className="text-slate-400">•</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">{post.title}</h1>

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

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-300">分享这篇文章</p>
            <ShareActions title={post.title} />
          </div>

          <div className="mt-10 space-y-8 text-lg leading-8 text-slate-700 dark:text-slate-200">
            {post.sections.map((section) => (
              <section key={section.heading ?? section.paragraphs[0]} id={section.heading ? slugify(section.heading) : undefined}>
                {section.heading && (
                  <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{section.heading}</h2>
                )}

                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {relatedPosts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">相关推荐</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/posts/${item.slug}`}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-sm transition hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="text-xs uppercase tracking-[0.14em] text-sky-600">{item.category}</div>
                    <div className="mt-2 font-medium text-slate-800 dark:text-slate-100">{item.title}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">目录</h2>
            <nav className="mt-4 space-y-2">
              {headings.length > 0 ? (
                headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className="block text-sm text-slate-600 transition hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
                  >
                    {heading.title}
                  </a>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">本篇暂无目录。</p>
              )}
            </nav>
          </div>
        </aside>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          {prev ? (
            <Link href={`/posts/${prev.slug}`} className="text-sm font-medium text-slate-700 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400">
              ← 上一篇：{prev.title}
            </Link>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">已经是最早的文章</p>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-right dark:border-slate-800 dark:bg-slate-900">
          {next ? (
            <Link href={`/posts/${next.slug}`} className="text-sm font-medium text-slate-700 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400">
              下一篇：{next.title} →
            </Link>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">已经是最新的文章</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
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
