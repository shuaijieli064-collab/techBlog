import Link from "next/link";

import { posts, userPostsFrom } from "@/lib/posts";
import { readDomain } from "@/lib/server/db";

export function PostPagination({ slug }: { slug: string }) {
  const all = [...posts, ...userPostsFrom(readDomain("blog-posts"))]
    .filter((p) => p.status !== "draft")
    .sort((a, b) => b.date.localeCompare(a.date));
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1) return null;

  const prev = all[index + 1]; // 列表顺序：更新在前，后一篇 = 更早
  const next = all[index - 1];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/posts/${prev.slug}`}
          className="group rounded-lg border border-hair bg-background p-5 transition-colors hover:border-wire/60 hover:bg-panel"
        >
          <span className="font-mono text-xs tracking-[0.14em] text-muted">← 上一篇</span>
          <span className="mt-2 block font-medium text-foreground transition-colors group-hover:text-wire">
            {prev.title}
          </span>
          <time dateTime={prev.date} className="mt-1 block text-xs text-muted">
            {new Date(prev.date).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
          </time>
        </Link>
      ) : (
        <div className="hidden sm:block" aria-hidden />
      )}
      {next ? (
        <Link
          href={`/posts/${next.slug}`}
          className="group rounded-lg border border-hair bg-background p-5 text-right transition-colors hover:border-wire/60 hover:bg-panel"
        >
          <span className="font-mono text-xs tracking-[0.14em] text-muted">下一篇 →</span>
          <span className="mt-2 block font-medium text-foreground transition-colors group-hover:text-wire">
            {next.title}
          </span>
          <time dateTime={next.date} className="mt-1 block text-xs text-muted">
            {new Date(next.date).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
          </time>
        </Link>
      ) : (
        <div className="hidden sm:block" aria-hidden />
      )}
    </div>
  );
}
