import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, Database, Cpu, Network } from "lucide-react";

import { HeroConstellation } from "@/components/HeroConstellation";
import { PostCard } from "@/components/PostCard";
import { Reveal } from "@/components/Reveal";
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
    { title: "Java 基础", desc: "对象、集合、异常与并发", tags: ["Java", "Java 基础"], icon: BookOpen, color: "text-wire" },
    { title: "Java 后端", desc: "Spring Boot 与服务设计", tags: ["Spring Boot", "后端框架"], icon: Cpu, color: "text-violet" },
    { title: "数据库", desc: "MySQL、MyBatis 与事务", tags: ["MySQL", "MyBatis"], icon: Database, color: "text-signal" },
    { title: "缓存/消息队列", desc: "Redis 与异步处理架构", tags: ["Redis", "消息队列", "架构设计"], icon: Network, color: "text-wire" },
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
        className="glow-border shimmer-line hud-corners card relative min-h-[88vh] overflow-hidden px-6 py-16 sm:px-10 sm:py-24"
      >
        <span aria-hidden className="scanlines pointer-events-none absolute inset-0" />
        <HeroConstellation />
        <div className="relative z-10 grid min-h-[62vh] items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="page-eyebrow mb-4 opacity-0" style={{ animation: "boot-rise 0.6s ease-out 0.15s forwards" }}>
              {"// NEXUS · DEV WORKSPACE · v3.0"}
            </p>
            <h1 className="whitespace-pre-line font-display text-[clamp(2.4rem,6vw,4.6rem)] font-extrabold leading-[1.08] tracking-tight">
              <span className="gradient-text">
                <ScrambleText text={"记录代码、学习与成长\n的技术博客"} />
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-print" style={{ animation: "boot-rise 0.6s ease-out 0.4s both" }}>
              我是 Nox7th，一名软件工程大二学生。这里记录我的前端实践、算法学习、项目复盘和成长观察，持续记录每一次进步。
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3" style={{ animation: "boot-rise 0.6s ease-out 0.55s both" }}>
              <Link href="/posts" className="btn-primary group relative overflow-hidden">
                <span className="relative z-10">阅读文章</span>
                <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
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

          {/* Right column: orbital stats panel */}
          <div className="relative hidden lg:block" style={{ animation: "boot-rise 0.7s ease-out 0.3s both" }}>
            <div className="glow-border card p-6">
              <div className="flex items-center justify-between">
                <span className="label-mono">SYSTEM STATUS</span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-wire">
                  <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-wire" />
                  ONLINE
                </span>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  { k: "文章", v: posts.length, u: "篇", c: "text-wire" },
                  { k: "笔记", v: notes.length, u: "篇", c: "text-violet" },
                  { k: "项目", v: projects.length, u: "个", c: "text-signal" },
                  { k: "函数", v: functionLibrary.length, u: "枚", c: "text-wire" },
                ].map((s) => (
                  <div key={s.k} className="flex items-end justify-between border-b border-hair pb-3">
                    <span className="text-sm text-print">{s.k}</span>
                    <span className={`font-display text-2xl font-bold ${s.c}`}>
                      {String(s.v).padStart(2, "0")}
                      <span className="ml-1 text-xs font-normal text-muted">{s.u}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-5 z-10 hidden flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-muted sm:flex"
        >
          SCROLL
          <span data-scroll-hint className="h-9 w-px bg-wire/60" />
        </div>
      </section>

      <Telemetry items={telemetry} />

      <Reveal delay={80}>
        <section className="py-10">
          <SectionRule
            title="学习笔记地图"
            meta={`${pad(notes.length)} 篇`}
            href="/notes"
            metaLabel="查看笔记地图"
          />

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {learningGroups.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={`/tags/${encodeURIComponent(item.tags[0])}`}
                  className="card card-hover group relative flex flex-col overflow-hidden p-5"
                >
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-wire via-violet to-transparent transition-transform duration-300 group-hover:scale-x-100" />
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md border border-hair bg-panel transition-all duration-300 ${item.color} group-hover:border-current/50 group-hover:drop-shadow-[0_0_8px_rgba(92,225,255,0.4)]`}>
                    <Icon size={18} />
                  </div>
                  <div className="font-display text-sm font-bold text-foreground transition-colors group-hover:text-wire">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-print">{item.desc}</p>
                  <div className="mt-3 font-mono text-[11px] text-muted">
                    {item.tags.map((tag) => `#${tag}`).join(" ")}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </Reveal>

      <Reveal delay={160}>
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
      </Reveal>

      <Reveal delay={240}>
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
      </Reveal>
    </main>
  );
}
