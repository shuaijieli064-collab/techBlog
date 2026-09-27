import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, Folder, Brain, Zap, Sparkles } from "lucide-react";

import { DailyTasks } from "@/components/DailyTasks";
import { GitHubActivity } from "@/components/GitHubActivity";
import { ProjectProgressSummary } from "@/components/ProjectList";
import { SectionRule } from "@/components/SectionRule";
import { getPublishedPosts } from "@/lib/posts";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "工作台",
  description: "个人开发者工作台：统计、今日任务、技能画像与 AI 推荐。",
  ...pageMeta("/dashboard"),
};

const skills = [
  { name: "Java", level: 80 },
  { name: "算法", level: 50 },
  { name: "Spring", level: 30 },
  { name: "MySQL", level: 60 },
  { name: "Git", level: 70 },
  { name: "AI", level: 80 },
];

const quickActions = [
  { label: "写博客", href: "/posts", icon: BookOpen },
  { label: "项目", href: "/projects", icon: Folder },
  { label: "学习", href: "/learning", icon: Brain },
  { label: "工具", href: "/tools", icon: Zap },
];

const statCards = [
  { code: "POSTS", label: "已发布文章", valueKey: "posts" as const, suffix: "篇" },
  { code: "TASKS", label: "今日任务", valueKey: "tasks" as const, suffix: "" },
  { code: "STREAK", label: "连续学习天数", valueKey: "streak" as const, suffix: "天" },
];

export default function DashboardPage() {
  const posts = getPublishedPosts();
  const totalPosts = posts.length;
  const latest = posts.slice(0, 3);
  const values: Record<(typeof statCards)[number]["valueKey"], string | number> = {
    posts: String(totalPosts).padStart(2, "0"),
    tasks: "1/3",
    streak: 12,
  };

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8">
        <p className="font-mono text-xs text-muted">
          ~/dashboard · {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          早上好，Developer
        </h1>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            {statCards.map((stat) => (
              <div key={stat.label} className="card p-5">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[11px] tracking-[0.14em] text-muted">
                    {stat.code}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-bold text-foreground">
                    {values[stat.valueKey]}
                  </span>
                  {stat.suffix && (
                    <span className="font-mono text-xs text-print">{stat.suffix}</span>
                  )}
                </div>
                <div className="mt-1 text-xs text-print">{stat.label}</div>
              </div>
            ))}
          </div>

          <DailyTasks />

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
                  className="flex items-center justify-between border border-hair p-4 transition-colors hover:border-wire"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 font-mono text-[11px] text-wire">{post.category}</div>
                    <div className="truncate text-sm font-medium text-foreground">
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

          <ProjectProgressSummary />
        </div>

        <div className="min-w-0 space-y-6">
          <div className="card p-6">
            <SectionRule title="快捷操作" meta="QUICK" />
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 border border-hair p-4 transition-colors hover:border-wire"
                >
                  <div className="flex h-9 w-9 items-center justify-center border border-hair text-wire">
                    <action.icon size={17} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <SectionRule title="技能画像" meta={`${skills.length} SKILLS`} />
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-1.5 flex justify-between font-mono text-xs">
                    <span className="text-print">{skill.name}</span>
                    <span className="text-muted">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-hair/50">
                    <div
                      className="h-full bg-wire transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <SectionRule title="AI 助手" meta="LOCAL" />
            <div className="space-y-3">
              <div className="border border-hair bg-background/70 p-4 font-mono text-[13px] leading-6 text-print">
                <span className="mr-1.5 text-signal">{"❯"}</span>
                昨天学习了 <span className="text-wire">HashMap</span>，今天建议{" "}
                <span className="text-wire">ConcurrentHashMap</span>
              </div>
              <p className="text-xs leading-5 text-print">
                在「今日任务」卡片点 <span className="font-mono text-wire">AI 规划今天</span>
                ，按学习路线与项目进度生成任务。
              </p>
              <div className="grid gap-2">
                <Link href="/learning" className="btn-primary w-full">
                  <Brain size={15} />
                  继续学习
                </Link>
                <Link href="/ai" className="btn-secondary w-full">
                  <Sparkles size={15} />
                  打开 AI 中心
                </Link>
              </div>
            </div>
          </div>

          <GitHubActivity />
        </div>
      </div>
    </main>
  );
}
