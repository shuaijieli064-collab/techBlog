import Link from "next/link";
import type { AnyPost } from "@/lib/posts";

export function PostCard({ post }: { post: AnyPost }) {
  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden p-5 transition-all duration-300 hover:border-wire/40">
      <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-wire to-violet scale-y-0 origin-bottom transition-transform duration-300 group-hover:scale-y-100" />
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-hair pb-3 font-mono text-[11px] tracking-[0.06em] text-muted">
        <div className="flex items-center gap-2.5">
          {post.featured && (
            <span className="inline-flex items-center gap-1 text-signal">
              <span aria-hidden className="h-1 w-1 animate-pulse bg-signal" />
              置顶
            </span>
          )}
          <span className="text-wire">{post.category}</span>
        </div>
        <span>{post.readTime}</span>
      </div>

      <Link href={`/posts/${post.slug}`} className="block">
        <h2 className="mb-3 font-display text-lg font-bold leading-snug text-foreground transition-all duration-300 group-hover:text-wire group-hover:drop-shadow-[0_0_8px_rgba(92,225,255,0.5)] sm:text-xl">
          {post.title}
        </h2>
      </Link>

      <p className="mb-4 text-sm leading-6 text-print">{post.excerpt}</p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {post.tags.slice(0, 4).map((tag) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="chip transition-colors hover:border-wire hover:text-wire"
          >
            #{tag}
          </Link>
        ))}
        {post.tags.length > 4 && (
          <span className="font-mono text-[11px] text-muted">+{post.tags.length - 4}</span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-hair pt-3 font-mono text-[11px] text-muted">
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
