import Link from "next/link";
import type { Post } from "@/lib/posts";
import { Calendar, Clock } from "lucide-react";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300">
          {post.category}
        </span>
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-slate-400" />
          <span>{post.readTime}</span>
        </div>
      </div>

      <Link href={`/posts/${post.slug}`} className="block">
        <h2 className="mb-3 text-2xl font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-sky-600 dark:text-slate-50 dark:group-hover:text-sky-400">
          {post.title}
        </h2>
      </Link>

      <p className="mb-5 text-base leading-7 text-slate-600 dark:text-slate-300">
        {post.excerpt}
      </p>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {post.tags.slice(0, 4).map((tag) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-sky-400 dark:hover:text-sky-400"
          >
            #{tag}
          </Link>
        ))}
        {post.tags.length > 4 && (
          <span className="text-xs text-slate-400">
            +{post.tags.length - 4}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            {post.author[0]}
          </span>
          <span>{post.author}</span>
        </div>
        <time dateTime={post.date} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Calendar size={14} />
          {new Date(post.date).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </time>
      </div>
    </article>
  );
}
