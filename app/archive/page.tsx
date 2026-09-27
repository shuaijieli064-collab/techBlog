import Link from "next/link";
import type { Metadata } from "next";

import { getPublishedPosts } from "@/lib/posts";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "文章归档",
  description: "按年份归档的全部文章时间线。",
  ...pageMeta("/archive"),
};

export default function ArchivePage() {
  const posts = getPublishedPosts();
  const groupedPosts = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = new Date(post.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(groupedPosts).sort((a, b) => Number(b) - Number(a));

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-wire">
          归档
        </p>
        <h1 className="text-4xl font-bold font-display tracking-tight text-foreground">
          时间线里的成长记录
        </h1>
      </div>

      <div className="space-y-10">
        {years.map((year) => (
          <section key={year}>
            <h2 className="mb-5 text-2xl font-bold font-display text-foreground">{year}</h2>
            <div className="space-y-4">
              {groupedPosts[year].map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="flex flex-col gap-2 card card-hover p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="text-sm font-medium tracking-[0.18em] text-wire">
                      {post.category}
                    </div>
                    <div className="mt-2 text-xl font-semibold text-foreground">
                      {post.title}
                    </div>
                  </div>
                  <time dateTime={post.date} className="text-sm text-print">
                    {new Date(post.date).toLocaleDateString("zh-CN", {
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
