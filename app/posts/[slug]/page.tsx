import Link from "next/link";
import { notFound } from "next/navigation";

import { Markdown } from "@/components/Markdown";
import { ReadingProgress } from "@/components/ReadingProgress";
import { PostEngagement } from "@/components/PostEngagement";
import { PostPagination } from "@/components/PostPagination";
import { PostToc } from "@/components/PostToc";
import { extractHeadings } from "@/lib/markdown";
import { getPostBySlug, posts, postToMarkdown, userPostsFrom } from "@/lib/posts";
import { readDomain } from "@/lib/server/db";
import { BASE_URL, pageMeta } from "@/lib/site";

// 用户文章存于本地 DB：页面必须按需渲染，否则生产模式会把
// generateStaticParams 之外的新 slug 判为静态 404。
export const dynamic = "force-dynamic";

// Next 16 的 params 不再自动解码 URL 编码：中文/含保留字符的 slug
// 收到的是百分号编码串（如 %E4%B8%AD…），必须手动 decode 后匹配数据。
export function generateStaticParams() {
  return posts.filter((post) => post.status !== "draft").map((post) => ({ slug: post.slug }));
}

function readUserPosts() {
  return userPostsFrom(readDomain("blog-posts"));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: encoded } = await params;
  const slug = decodeURIComponent(encoded);
  const post = getPostBySlug(slug, readUserPosts());

  if (!post) {
    return { title: "文章未找到" };
  }

  const meta = pageMeta(`/posts/${slug}`);
  return {
    title: post.title,
    description: post.excerpt,
    authors: [post.author],
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [meta.openGraph.images[0]],
    },
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: encoded } = await params;
  const slug = decodeURIComponent(encoded);
  const post = getPostBySlug(slug, readUserPosts());

  if (!post) {
    notFound();
  }

  const body = postToMarkdown(post);
  const tocItems = extractHeadings(body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    inLanguage: "zh-CN",
    author: { "@type": "Person", name: post.author },
    mainEntityOfPage: `${BASE_URL}/posts/${slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid gap-10 lg:grid-cols-[1fr_240px]">
        <article className="min-w-0 card p-6 sm:p-8 lg:p-10">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-wire">
            <span>{post.category}</span>
            <span className="text-muted">•</span>
            <span>{post.readTime}</span>
            {post.featured && (
              <>
                <span className="text-muted">•</span>
                <span className="rounded-full bg-signal/10 px-2 py-0.5 text-signal">
                  置顶
                </span>
              </>
            )}
          </div>

          <h1 className="text-4xl font-bold font-display tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-print">
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
                className="rounded-full border border-hair bg-background px-3 py-1.5 text-xs font-medium text-print transition-colors hover:border-wire hover:text-wire"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <PostEngagement slug={post.slug} title={post.title} />
          </div>

          <div className="mt-10">
            <Markdown content={body} />
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <PostToc items={tocItems} />
          </div>
        </aside>
      </div>

      <div className="mt-10">
        <PostPagination slug={slug} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link
          href="/posts"
          className="group inline-flex items-center gap-1.5 font-medium text-print transition-colors hover:text-wire"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">←</span>
          返回文章列表
        </Link>
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 font-medium text-print transition-colors hover:text-wire"
        >
          回到首页
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </main>
  );
}
