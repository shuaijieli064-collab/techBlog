import Link from "next/link";
import { notFound } from "next/navigation";

import { PostCard } from "@/components/PostCard";
import { getAllTags, getPostsByTag } from "@/lib/posts";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
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
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">标签专题</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">#{decodedTag}</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">当前标签共收录 {matchingPosts.length} 篇相关文章。</p>
        </div>
        <Link
          href="/posts"
          className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-sky-400"
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
