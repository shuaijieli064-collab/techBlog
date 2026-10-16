import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PostCard } from "@/components/PostCard";
import { PageHeader } from "@/components/PageHeader";
import { getAllTags, getPostsByTag, userPostsFrom } from "@/lib/posts";
import { readDomain } from "@/lib/server/db";
import { pageMeta } from "@/lib/site";

function readUserPosts() {
  return userPostsFrom(readDomain("blog-posts"));
}

// 标签页包含 DB 中的用户文章：强制按需渲染（generateStaticParams 仅作路由声明）。
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `#${decodedTag} | 标签`,
    description: `标签 ${decodedTag} 下的所有文章。`,
    ...pageMeta(`/tags/${tag}`),
  };
}

export default function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  return <TagPageInner params={params} />;
}

async function TagPageInner({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const matchingPosts = getPostsByTag(decodedTag, readUserPosts());

  if (matchingPosts.length === 0) {
    notFound();
  }

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <PageHeader
        code={`#${decodedTag}`}
        eyebrow="标签"
        title={`#${decodedTag}`}
        action={
          <Link href="/posts" className="btn-secondary">
            查看全部文章
          </Link>
        }
      />

      <div className="grid gap-8 md:grid-cols-2">
        {matchingPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}
