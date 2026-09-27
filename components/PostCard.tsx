import Link from "next/link";
import type { Post } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="card card-hover group flex h-full flex-col p-5">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-hair pb-3 font-mono text-[11px] tracking-[0.06em] text-muted">
        <div className="flex items-center gap-2.5">
          {post.featured && (
            <span className="inline-flex items-center gap-1 text-signal">
              <span aria-hidden className="h-1 w-1 bg-signal" />
              置顶
            </span>
          )}
          <span className="text-wire">{post.category}</span>
        </div>
        <span>{post.readTime}</span>
      </div>

      <Link href={`/posts/${post.slug}`} className="block">
        <h2 className="mb-3 font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-wire sm:text-xl">
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
        <time dateTime={post.date}>{post.date}</time>
      </div>
    </article>
  );
}
