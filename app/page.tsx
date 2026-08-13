import Link from "next/link";

import { PostCard } from "@/components/PostCard";
import { getAllTags, getSortedPosts, posts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default function Home() {
  const sortedPosts = getSortedPosts();
  const featured = sortedPosts.filter((post) => post.featured).slice(0, 2);
  const latest = sortedPosts.slice(0, 3);
  const tags = getAllTags().slice(0, 12);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "zh-CN",
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      <section className="grid gap-8 py-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:py-16">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Software Engineering Student</p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
            更像产品的个人技术博客
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            我是林晨，一名软件工程大二学生。这里记录前端实践、Java 后端学习、算法与项目复盘，持续沉淀可复用的技术经验。
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/posts"
              className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-colors hover:bg-sky-500"
            >
              浏览全部文章
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-sky-400"
            >
              认识我
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
          <div className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">博客状态</div>
          <div className="mt-6 space-y-5">
            <div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{posts.length}</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">已发布文章</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{getAllTags().length}</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">持续追踪主题</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">100%</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">长期迭代与更新</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">热门标签</h2>
          <Link href="/posts" className="text-sm font-medium text-sky-600 hover:text-sky-500">
            探索文章 →
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-sky-400"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </section>

      <section className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">精选文章</h2>
          <Link href="/posts" className="text-sm font-medium text-sky-600 hover:text-sky-500">
            查看全部 →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {featured.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">最新文章</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="py-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">个人介绍</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">持续建设中的技术作品集</h2>
          <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">
            目标是把博客做成长期成长档案：可搜索、可筛选、可归档、可订阅。欢迎从文章、笔记地图和归档页一起探索。
          </p>
        </div>
      </section>
    </main>
  );
}
