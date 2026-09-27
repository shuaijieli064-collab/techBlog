import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PostCard } from "@/components/PostCard";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { pageMeta } from "@/lib/site";

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
  const matchingPosts = getPostsByTag(decodedTag);

  if (matchingPosts.length === 0) {
    notFound();
  }

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-wire">标签</p>
          <h1 className="text-4xl font-bold font-display tracking-tight text-foreground">
            #{decodedTag}
          </h1>
        </div>
        <Link
          href="/posts"
          className="btn-secondary px-4 py-2"
        >
          查看全部文章
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {matchingPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}
