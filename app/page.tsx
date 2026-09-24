import Link from "next/link";

import { PostCard } from "@/components/PostCard";
import { getPublishedPosts } from "@/lib/posts";

export default function Home() {
  const posts = getPublishedPosts();
  const featuredOnly = posts.filter((post) => post.featured);
  const featured = [
    ...featuredOnly,
    ...posts.filter((post) => !post.featured),
  ].slice(0, 2);
  const latest = posts.slice(0, 3);

  const totalPosts = posts.length;
  const learningGroups = [
    { title: "Java 基础", desc: "对象、集合、异常与并发", tags: ["Java", "Java 基础"] },
    { title: "Java 后端", desc: "Spring Boot 与服务设计", tags: ["Spring Boot", "后端框架"] },
    { title: "数据库", desc: "MySQL、MyBatis 与事务", tags: ["MySQL", "MyBatis"] },
    { title: "缓存/消息队列", desc: "Redis 与异步处理架构", tags: ["Redis", "消息队列", "架构设计"] },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 px-6 py-12 shadow-sm sm:px-10 sm:py-16 dark:border-slate-800 dark:bg-slate-950/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_45%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.15)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />
        <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex items-center rounded-full border border-sky-200/70 bg-sky-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/50 dark:text-sky-300">
              Software Engineering Student
            </p>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
              记录代码、学习与
              <span className="bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
                成长
              </span>
              的技术博客
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              我是林晨，一名软件工程大二学生。这里记录我的前端实践、算法学习、项目复盘和成长观察，持续记录每一次进步。
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/posts" className="btn-primary">
                阅读文章
              </Link>
              <Link href="/about" className="btn-secondary">
                关于我
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-2 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
              >
                打开工作台
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <div className="grid grid-cols-3 gap-3 text-sm">
              {[
                { value: `${totalPosts}+`, label: "已发布文章" },
                { value: String(learningGroups.length), label: "学习方向" },
                { value: "1", label: "稳定写作节奏" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-slate-50 px-2 py-4 text-center dark:bg-slate-900">
                  <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="section-title">学习笔记地图</h2>
          <Link
            href="/notes"
            className="text-sm font-medium text-sky-600 transition-colors hover:text-sky-500 dark:text-sky-400"
          >
            查看笔记地图 →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {learningGroups.map((item) => (
            <Link
              key={item.title}
              href={`/tags/${encodeURIComponent(item.tags[0])}`}
              className="card card-hover p-5"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">
                {item.title}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="section-title">精选文章</h2>
          <Link
            href="/posts"
            className="text-sm font-medium text-sky-600 transition-colors hover:text-sky-500 dark:text-sky-400"
          >
            查看全部 →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">最新文章</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
