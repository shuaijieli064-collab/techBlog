import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, Folder, Brain, ArrowRight, Zap, Target, TrendingUp, Sparkles } from "lucide-react";

import { DailyTasks } from "@/components/DailyTasks";
import { GitHubActivity } from "@/components/GitHubActivity";
import { ProjectProgressSummary } from "@/components/ProjectList";
import { getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "工作台",
  description: "个人开发者工作台：统计、今日任务、技能画像与 AI 推荐。",
};

const skills = [
  { name: "Java", level: 80, color: "bg-sky-500" },
  { name: "算法", level: 50, color: "bg-purple-500" },
  { name: "Spring", level: 30, color: "bg-orange-500" },
  { name: "MySQL", level: 60, color: "bg-green-500" },
  { name: "Git", level: 70, color: "bg-blue-500" },
  { name: "AI", level: 80, color: "bg-emerald-500" },
];

const quickActions = [
  { label: "写博客", href: "/posts", icon: BookOpen, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-900/30" },
  { label: "项目", href: "/projects", icon: Folder, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/30" },
  { label: "学习", href: "/learning", icon: Brain, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/30" },
  { label: "工具", href: "/tools", icon: Zap, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/30" },
];

const statCards = [
  {
    icon: BookOpen,
    bg: "bg-sky-50 dark:bg-sky-900/30",
    color: "text-sky-600 dark:text-sky-400",
    label: "已发布文章",
    valueKey: "posts" as const,
  },
  {
    icon: Target,
    bg: "bg-purple-50 dark:bg-purple-900/30",
    color: "text-purple-600 dark:text-purple-400",
    label: "今日任务（可编辑）",
    valueKey: "tasks" as const,
  },
  {
    icon: TrendingUp,
    bg: "bg-orange-50 dark:bg-orange-900/30",
    color: "text-orange-600 dark:text-orange-400",
    label: "连续学习天数",
    valueKey: "streak" as const,
  },
];

export default function DashboardPage() {
  const posts = getPublishedPosts();
  const totalPosts = posts.length;
  const latest = posts.slice(0, 3);
  const values: Record<(typeof statCards)[number]["valueKey"], string | number> = {
    posts: totalPosts,
    tasks: "3/3",
    streak: 12,
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
          早上好，Developer
        </h1>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            {statCards.map((stat) => (
              <div key={stat.label} className="card p-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      {values[stat.valueKey]}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DailyTasks />

          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">最近文章</h2>
              <Link
                href="/posts"
                className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400"
              >
                查看全部 <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {latest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition-colors hover:border-sky-200 hover:bg-sky-50/50 dark:border-slate-800 dark:hover:border-sky-800 dark:hover:bg-sky-950/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-xs font-medium text-sky-600">{post.category}</div>
                    <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
                      {post.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{post.readTime}</div>
                  </div>
                  <div className="ml-4 flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">快捷操作</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 p-4 transition-colors hover:border-sky-200 hover:bg-sky-50/50 dark:border-slate-800 dark:hover:border-sky-800"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.bg}`}>
                    <action.icon size={20} className={action.color} />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">技能画像</h2>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-1 flex justify-between">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{skill.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${skill.color} transition-all duration-500`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">AI 助手</h2>
            <div className="space-y-3">
              <div className="rounded-xl bg-gradient-to-r from-sky-50 to-purple-50 p-4 dark:from-sky-950/30 dark:to-purple-950/30">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  昨天学习了 <span className="font-medium text-sky-600 dark:text-sky-400">HashMap</span>，今天建议学习{" "}
                  <span className="font-medium text-purple-600 dark:text-purple-400">ConcurrentHashMap</span>
                </p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                在「今日任务」卡片点 <span className="font-medium text-sky-600 dark:text-sky-400">AI 规划今天</span>
                ，按学习路线与项目进度生成任务。
              </p>
              <div className="grid gap-2">
                <Link
                  href="/learning"
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
                >
                  <Brain size={16} />
                  继续学习
                </Link>
                <Link
                  href="/ai"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300"
                >
                  <Sparkles size={16} />
                  打开 AI 中心
                </Link>
              </div>
            </div>
          </div>

          <ProjectProgressSummary />
          <GitHubActivity />
        </div>
      </div>
    </main>
  );
}
