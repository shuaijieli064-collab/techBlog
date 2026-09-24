import Link from "next/link";
import type { Metadata } from "next";
import { GitBranch, Mail, MapPin, BookOpen, Folder, ArrowRight, ExternalLink } from "lucide-react";
import { getPublishedPosts } from "@/lib/posts";
import { skills } from "@/lib/growth";

export const metadata: Metadata = {
  title: "个人主页",
  description: "林晨的个人主页：技能概览、精选项目与最新文章。",
};

const projects = [
  { name: "学习助手", description: "学习计划管理与进度追踪", href: "/projects", stars: 12 },
  { name: "个人博客", description: "基于 Next.js 的技术博客", href: "/projects", stars: 8 },
  { name: "算法练习本", description: "刷题记录与题解整理", href: "/projects", stars: 5 },
];

export default function ProfilePage() {
  const posts = getPublishedPosts();
  const latestPosts = posts.slice(0, 3);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-purple-600 text-4xl font-bold text-white shadow-lg shadow-sky-500/30">
            林
          </div>
          <div className="flex-1">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Profile</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">林晨</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              软件工程学生 · 关注后端开发、算法与工程实践
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                中国
              </span>
              <a href="https://github.com" className="flex items-center gap-1.5 transition-colors hover:text-sky-600">
                <GitBranch size={14} />
                GitHub
              </a>
              <a href="mailto:hello@example.com" className="flex items-center gap-1.5 transition-colors hover:text-sky-600">
                <Mail size={14} />
                联系我
              </a>
            </div>
          </div>
          <Link
            href="/about"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
          >
            了解更多
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-slate-950">
          <div className="text-3xl font-bold text-sky-600">{posts.length}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">技术文章</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-slate-950">
          <div className="text-3xl font-bold text-purple-600">{projects.length}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">个人项目</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-slate-950">
          <div className="text-3xl font-bold text-orange-600">{skills.length}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">技能方向</div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">技能概览</h2>
          <Link href="/growth" className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-500">
            成长中心 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skills.slice(0, 8).map((skill) => (
            <div key={skill.name}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">{skill.name}</span>
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
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-50">
              <BookOpen size={18} className="text-sky-600" />
              最新文章
            </h2>
            <Link href="/posts" className="text-sm text-sky-600 hover:text-sky-500">全部</Link>
          </div>
          <div className="space-y-3">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="block rounded-xl border border-slate-100 p-4 transition-colors hover:border-sky-200 hover:bg-sky-50/50 dark:border-slate-800 dark:hover:border-sky-800"
              >
                <div className="text-xs font-medium text-sky-600">{post.category}</div>
                <div className="mt-1 font-medium text-slate-900 dark:text-slate-50">{post.title}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{post.readTime}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-50">
              <Folder size={18} className="text-purple-600" />
              精选项目
            </h2>
            <Link href="/projects" className="text-sm text-sky-600 hover:text-sky-500">全部</Link>
          </div>
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.name}
                href={project.href}
                className="block rounded-xl border border-slate-100 p-4 transition-colors hover:border-purple-200 hover:bg-purple-50/50 dark:border-slate-800 dark:hover:border-purple-800"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-slate-900 dark:text-slate-50">{project.name}</div>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    ★ {project.stars}
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{project.description}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-3xl border border-sky-500/20 bg-sky-50/50 p-8 text-center dark:border-sky-800/20 dark:bg-sky-950/50">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">一起交流</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          欢迎技术交流与合作，可以通过邮件或 GitHub 联系我。
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href="mailto:hello@example.com"
            className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-600 dark:bg-sky-600"
          >
            <Mail size={16} />
            发送邮件
          </a>
          <a
            href="https://github.com"
            className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <GitBranch size={16} />
            GitHub
            <ExternalLink size={12} />
          </a>
        </div>
      </section>
    </main>
  );
}
