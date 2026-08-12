import Link from "next/link";

import { PostCard } from "@/components/PostCard";
import { posts } from "@/lib/posts";

export default function Home() {
  const featured = posts.filter((post) => post.featured).slice(0, 2);
  const latest = posts.slice(0, 3);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid gap-8 py-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:py-16">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
            Software Engineering Student
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
            记录代码、学习与成长的技术博客
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            我是林晨，一名软件工程大二学生。这里记录我的前端实践、算法学习、项目复盘和成长观察，持续记录每一次进步。
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/posts"
              className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-colors hover:bg-sky-500"
            >
              阅读文章
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-sky-400"
            >
              关于我
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
          <div className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            近期状态
          </div>
          <div className="mt-6 space-y-5">
            <div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">12+</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">已发布技术文章</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">4</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">持续关注的学习方向</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">1</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">稳定的写作和成长节奏</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">学习笔记地图</h2>
          <Link href="/notes" className="text-sm font-medium text-sky-600 hover:text-sky-500">
            查看笔记地图 →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {[
            { title: "Java 基础", desc: "对象、集合、异常与并发", tags: ["Java", "Java 基础"] },
            { title: "Java 后端", desc: "Spring Boot 与服务设计", tags: ["Spring Boot", "后端框架"] },
            { title: "数据库", desc: "MySQL、MyBatis 与事务", tags: ["MySQL", "MyBatis"] },
            { title: "缓存/消息队列", desc: "Redis 与异步处理架构", tags: ["Redis", "消息队列"] },
          ].map((item) => (
            <Link
              key={item.title}
              href={`/tags/${encodeURIComponent(item.tags[0])}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-sky-300 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">{item.title}</div>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.desc}</p>
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
    </main>
  );
}
