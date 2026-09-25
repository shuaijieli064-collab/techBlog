import Link from "next/link";

import { PostCard } from "@/components/PostCard";
import { SectionRule } from "@/components/SectionRule";
import { notes } from "@/lib/notes";
import { getPublishedPosts } from "@/lib/posts";

export default function Home() {
  const posts = getPublishedPosts();
  const featuredOnly = posts.filter((post) => post.featured);
  const featured = [
    ...featuredOnly,
    ...posts.filter((post) => !post.featured),
  ].slice(0, 2);
  const latest = posts.slice(0, 3);

  const learningGroups = [
    { title: "Java 基础", desc: "对象、集合、异常与并发", tags: ["Java", "Java 基础"] },
    { title: "Java 后端", desc: "Spring Boot 与服务设计", tags: ["Spring Boot", "后端框架"] },
    { title: "数据库", desc: "MySQL、MyBatis 与事务", tags: ["MySQL", "MyBatis"] },
    { title: "缓存/消息队列", desc: "Redis 与异步处理架构", tags: ["Redis", "消息队列", "架构设计"] },
  ];

  const titleBlock = [
    { label: "作者", value: "林晨" },
    { label: "身份", value: "软件工程 · 大二" },
    { label: "文章", value: `${String(posts.length).padStart(2, "0")} 篇` },
    { label: "笔记", value: `${String(notes.length).padStart(2, "0")} 篇` },
    { label: "方向", value: `${String(learningGroups.length).padStart(2, "0")} 个` },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <section className="reg-ticks card relative px-6 py-12 sm:px-10 sm:py-16">
        <span aria-hidden className="reg-ticks-b pointer-events-none absolute inset-0" />
        <div className="relative grid gap-10 lg:grid-cols-[1.5fr_0.9fr] lg:items-center">
          <div>
            <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              记录代码、学习与成长
              <br />
              的技术博客
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-print">
              我是林晨，一名软件工程大二学生。这里记录我的前端实践、算法学习、项目复盘和成长观察，持续记录每一次进步。
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/posts" className="btn-primary">
                阅读文章
              </Link>
              <Link href="/dashboard" className="btn-secondary">
                打开工作台
              </Link>
              <Link
                href="/about"
                className="px-2 py-2.5 font-mono text-sm text-print transition-colors hover:text-wire"
              >
                关于我
              </Link>
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-baseline justify-between font-mono text-[11px] tracking-[0.1em] text-muted">
              <span>TITLE BLOCK</span>
              <span>2026</span>
            </div>
            <dl className="divide-y divide-hair border border-hair bg-panel/60 font-mono text-xs">
              {titleBlock.map((row) => (
                <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                  <dt className="tracking-[0.1em] text-muted">{row.label}</dt>
                  <dd className="text-foreground">{row.value}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-2.5">
                <dt className="tracking-[0.1em] text-muted">状态</dt>
                <dd className="flex items-center gap-1.5 text-signal">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
                  持续更新
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="py-10">
        <SectionRule
          title="学习笔记地图"
          meta={`${String(notes.length).padStart(2, "0")} NOTES`}
          href="/notes"
          metaLabel="查看笔记地图"
        />

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {learningGroups.map((item) => (
            <Link
              key={item.title}
              href={`/tags/${encodeURIComponent(item.tags[0])}`}
              className="card card-hover p-5"
            >
              <div className="text-sm font-bold tracking-tight text-foreground">
                {item.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-print">{item.desc}</p>
              <div className="mt-3 font-mono text-[11px] text-muted">
                {item.tags.map((tag) => `#${tag}`).join(" ")}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-6">
        <SectionRule
          title="精选文章"
          meta={`${String(posts.length).padStart(2, "0")} POSTS`}
          href="/posts"
          metaLabel="查看全部"
        />

        <div className="grid gap-5 md:grid-cols-2">
          {featured.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="py-10">
        <SectionRule
          title="最新文章"
          meta="LATEST"
          href="/archive"
          metaLabel="查看归档"
        />

        <div className="grid gap-5 md:grid-cols-3">
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
