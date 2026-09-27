import Link from "next/link";
import type { Metadata } from "next";

import { PostCard } from "@/components/PostCard";
import { RadarSweep } from "@/components/RadarSweep";
import { ScrambleText } from "@/components/ScrambleText";
import { SectionRule } from "@/components/SectionRule";
import { Telemetry } from "@/components/Telemetry";
import { functionLibrary } from "@/lib/functions";
import { notes } from "@/lib/notes";
import { getPublishedPosts } from "@/lib/posts";
import { projects } from "@/lib/projects";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMeta("/"),
};

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

  const pad = (n: number) => String(n).padStart(2, "0");

  const telemetry = [
    { label: "文章", value: posts.length, unit: "篇" },
    { label: "笔记", value: notes.length, unit: "篇" },
    { label: "项目", value: projects.length, unit: "个" },
    { label: "函数", value: functionLibrary.length, unit: "枚" },
  ];

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <section
        data-boot
        className="hud-corners card relative px-6 py-12 sm:px-10 sm:py-16"
      >
        <span aria-hidden className="scanlines pointer-events-none absolute inset-0" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.45fr_0.95fr]">
          <div>
            <h1 className="whitespace-pre-line font-display text-3xl font-extrabold leading-[1.2] text-foreground sm:text-5xl">
              <ScrambleText text={"记录代码、学习与成长\n的技术博客"} />
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-print">
              我是 Nox7th，一名软件工程大二学生。这里记录我的前端实践、算法学习、项目复盘和成长观察，持续记录每一次进步。
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
                className="px-2 py-2.5 text-sm text-print transition-colors hover:text-wire"
              >
                关于我
              </Link>
            </div>
          </div>

          <RadarSweep />
        </div>
      </section>

      <Telemetry items={telemetry} />

      <section className="py-10">
        <SectionRule
          title="学习笔记地图"
          meta={`${pad(notes.length)} 篇`}
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
              <div className="font-display text-sm font-bold text-foreground">
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
          meta={`${pad(posts.length)} 篇`}
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
          meta={`${pad(latest.length)} 篇`}
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
