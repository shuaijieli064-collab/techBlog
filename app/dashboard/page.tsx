import Link from "next/link";
import { BookOpen, Folder, Brain, ArrowRight, Zap, Target, TrendingUp } from "lucide-react";
import { posts } from "@/lib/posts";

const skills = [
  { name: "Java", level: 80, color: "bg-sky-500" },
  { name: "算法", level: 50, color: "bg-purple-500" },
  { name: "Spring", level: 30, color: "bg-orange-500" },
  { name: "MySQL", level: 60, color: "bg-green-500" },
  { name: "Git", level: 70, color: "bg-blue-500" },
  { name: "AI", level: 80, color: "bg-emerald-500" },
];

const todayTasks = [
  { id: 1, title: "复习 HashMap 源码分析", tag: "Java", done: false },
  { id: 2, title: "完成算法题 - 两数之和", tag: "算法", done: true },
  { id: 3, title: "更新学习助手项目 TODO", tag: "项目", done: false },
];

const quickActions = [
  { label: "写博客", href: "/posts", icon: BookOpen, color: "text-sky-600" },
  { label: "项目", href: "/projects", icon: Folder, color: "text-purple-600" },
  { label: "学习", href: "/learning", icon: Brain, color: "text-orange-600" },
  { label: "工具", href: "/tools", icon: Zap, color: "text-green-600" },
];

export default function DashboardPage() {
  const totalPosts = posts.length;
  const latest = posts.slice(0, 3);
  const completedTasks = todayTasks.filter((t) => t.done).length;

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
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-900/30">
                  <BookOpen size={20} className="text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{totalPosts}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">已发布文章</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/30">
                  <Target size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{completedTasks}/{todayTasks.length}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">今日任务</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/30">
                  <TrendingUp size={20} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">12</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">连续学习天数</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">今日任务</h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">{completedTasks}/{todayTasks.length} 完成</span>
            </div>
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${task.done ? 'border-sky-500 bg-sky-500' : 'border-slate-300 dark:border-slate-600'}`}>
                    {task.done && <span className="text-[10px] text-white font-bold">✓</span>}
                  </div>
                  <span className={`flex-1 text-sm ${task.done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                    {task.title}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {task.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">最近文章</h2>
              <Link href="/posts" className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-500">
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
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-sky-600 mb-1">{post.category}</div>
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">{post.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{post.readTime}</div>
                  </div>
                  <div className="flex flex-wrap gap-1 ml-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
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
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">快捷操作</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 p-4 transition-colors hover:border-sky-200 hover:bg-sky-50/50 dark:border-slate-800 dark:hover:border-sky-800"
                >
                  <action.icon size={24} className={action.color} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">技能画像</h2>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{skill.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={`h-full rounded-full ${skill.color} transition-all duration-500`} style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">AI 助手</h2>
            <div className="space-y-3">
              <div className="rounded-xl bg-gradient-to-r from-sky-50 to-purple-50 p-4 dark:from-sky-950/30 dark:to-purple-950/30">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  昨天学习了 <span className="font-medium text-sky-600 dark:text-sky-400">HashMap</span>，
                  今天建议学习 <span className="font-medium text-purple-600 dark:text-purple-400">ConcurrentHashMap</span>
                </p>
              </div>
              <Link
                href="/learning"
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
              >
                <Brain size={16} />
                继续学习
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
