import Link from "next/link";

import type { Post } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        <span>{post.category}</span>
        <span>{post.readTime}</span>
      </div>

      <Link href={`/posts/${post.slug}`} className="block">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-sky-600 dark:text-slate-50 dark:group-hover:text-sky-400">
          {post.title}
        </h2>
      </Link>

      <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
        {post.excerpt}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-sky-400"
          >
            #{tag}
          </Link>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>{post.author}</span>
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
    </article>
  );
}
