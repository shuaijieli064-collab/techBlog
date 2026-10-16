import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, Folder, Brain, Zap } from "lucide-react";

import { DailyTasks } from "@/components/DailyTasks";
import { DashboardFocus } from "@/components/DashboardFocus";
import { DashboardStats } from "@/components/DashboardStats";
import { GitHubActivity } from "@/components/GitHubActivity";
import { Greeting } from "@/components/Greeting";
import { ProjectProgressSummary } from "@/components/ProjectList";
import { Reveal } from "@/components/Reveal";
import { SectionRule } from "@/components/SectionRule";
import { SkillBars } from "@/components/SkillBars";
import { TaskBoard } from "@/components/TaskBoard";
import { WeekOverview } from "@/components/WeekOverview";
import { WeekPlan } from "@/components/WeekPlan";
import { AiAssistantCard } from "@/components/ai/AiAssistantCard";
import { getPublishedPosts } from "@/lib/posts";
import { skills } from "@/lib/growth";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "工作台",
  description: "个人开发者工作台：统计、今日任务、技能画像与 AI 推荐。",
  ...pageMeta("/dashboard"),
};

const quickActions = [
  { label: "写博客", href: "/posts", icon: BookOpen },
  { label: "项目", href: "/projects", icon: Folder },
  { label: "学习", href: "/learning", icon: Brain },
  { label: "工具", href: "/tools", icon: Zap },
];

export default function DashboardPage() {
  const posts = getPublishedPosts();
  const totalPosts = posts.length;
  const latest = posts.slice(0, 3);

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <DashboardFocus />
      <section className="card glow-border relative mb-8 overflow-hidden p-6 sm:p-8">
        <span aria-hidden className="scanlines pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs text-muted">
              ~/nexus/dashboard · {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              <Greeting />
            </h1>
            <p className="mt-2 text-sm text-print">Nexus 工作台已就绪，今天也要高效产出。</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="pill">
              <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-wire" />
              SYSTEM ONLINE
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <DashboardStats totalPosts={totalPosts} />

          <Reveal delay={60}>
            <WeekOverview />
          </Reveal>

          <Reveal delay={120}>
            <DailyTasks />
          </Reveal>

          <Reveal delay={120}>
            <TaskBoard />
          </Reveal>

          <Reveal delay={180}>
            <div className="card p-6">
              <SectionRule
                title="最近文章"
                meta="RECENT"
                href="/posts"
                metaLabel="查看全部"
              />
              <div className="space-y-3">
                {latest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="press group relative flex items-center justify-between overflow-hidden rounded-lg border border-hair p-4 transition-all duration-300 hover:border-wire/40 hover:shadow-[0_4px_20px_-8px_rgba(92,225,255,0.3)]"
                  >
                    <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 scale-y-0 bg-gradient-to-b from-wire to-violet transition-transform duration-300 group-hover:scale-y-100" />
                    <div className="min-w-0 flex-1 pl-2">
                      <div className="mb-1 font-mono text-[11px] text-wire">{post.category}</div>
                      <div className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-wire">
                        {post.title}
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-muted">{post.readTime}</div>
                    </div>
                    <div className="ml-4 flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="chip">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <ProjectProgressSummary />
          </Reveal>
        </div>

        <div className="min-w-0 space-y-6">
          <Reveal delay={60}>
            <WeekPlan />
          </Reveal>

          <Reveal delay={120}>
            <div className="card p-6">
              <SectionRule title="快捷操作" meta="QUICK" />
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="press group flex flex-col items-center gap-2 rounded-lg border border-hair p-4 transition-all duration-300 hover:border-wire/40 hover:shadow-[0_4px_16px_-8px_rgba(92,225,255,0.3)]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-md border border-hair text-wire transition-all duration-300 group-hover:border-wire/50 group-hover:drop-shadow-[0_0_6px_rgba(92,225,255,0.5)]">
                      <action.icon size={17} />
                    </div>
                    <span className="text-sm font-medium text-foreground transition-colors group-hover:text-wire">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div className="card p-6">
              <SectionRule title="技能画像" meta={`${skills.length} SKILLS`} />
              <SkillBars variant="dashboard" />
            </div>
          </Reveal>

          <Reveal delay={240}>
            <AiAssistantCard />
          </Reveal>

          <Reveal delay={300}>
            <GitHubActivity />
          </Reveal>
        </div>
      </div>
    </main>
  );
}
