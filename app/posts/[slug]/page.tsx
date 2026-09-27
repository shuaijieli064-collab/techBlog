import Link from "next/link";
import { notFound } from "next/navigation";

import { Markdown } from "@/components/Markdown";
import { PostEngagement } from "@/components/PostEngagement";
import { PostToc } from "@/components/PostToc";
import { extractHeadings } from "@/lib/markdown";
import { getPostBySlug, posts, postToMarkdown } from "@/lib/posts";
import { BASE_URL, pageMeta } from "@/lib/site";

export function generateStaticParams() {
  return posts.filter((post) => post.status !== "draft").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "文章未找到" };
  }

  const meta = pageMeta(`/posts/${slug}`);
  return {
    title: post.title,
    description: post.excerpt,
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

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
                className="border border-hair bg-background px-3 py-1.5 text-xs font-medium text-print transition-colors hover:border-wire hover:text-wire"
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

      <div className="mt-10 flex items-center justify-between border border-hair bg-background p-5">
        <Link
          href="/posts"
          className="font-medium text-foreground hover:text-wire"
        >
          ← 返回文章列表
        </Link>
        <Link
          href="/"
          className="font-medium text-foreground hover:text-wire"
        >
          回到首页 →
        </Link>
      </div>
    </main>
  );
}
