import Link from "next/link";
import type { Metadata } from "next";
import { GitBranch, Mail, MapPin, BookOpen, Folder, ArrowRight, ExternalLink } from "lucide-react";
import { getPublishedPosts } from "@/lib/posts";
import { SkillBars } from "@/components/SkillBars";
import { skills } from "@/lib/growth";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "个人主页",
  description: "Nox7th的个人主页：技能概览、精选项目与最新文章。",
  ...pageMeta("/profile"),
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
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="card p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center bg-wire text-4xl font-bold text-[#04131b]">
            N
          </div>
          <div className="flex-1">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-wire">Profile</p>
            <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Nox7th</h1>
            <p className="mt-2 text-print">
              软件工程学生 · 关注后端开发、算法与工程实践
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-print">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                中国
              </span>
              <a href="https://github.com" className="flex items-center gap-1.5 transition-colors hover:text-wire">
                <GitBranch size={14} />
                GitHub
              </a>
              <a href="mailto:hello@example.com" className="flex items-center gap-1.5 transition-colors hover:text-wire">
                <Mail size={14} />
                联系我
              </a>
            </div>
          </div>
          <Link
            href="/about"
            className="btn-primary px-5 py-2.5"
          >
            了解更多
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-wire">{posts.length}</div>
          <div className="mt-1 text-sm text-print">技术文章</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-wire">{projects.length}</div>
          <div className="mt-1 text-sm text-print">个人项目</div>
        </div>
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold text-wire">{skills.length}</div>
          <div className="mt-1 text-sm text-print">技能方向</div>
        </div>
      </section>

      <section className="mt-8 card p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-foreground">技能概览</h2>
          <Link href="/growth" className="flex items-center gap-1 text-sm text-wire hover:opacity-80">
            成长中心 <ArrowRight size={14} />
          </Link>
        </div>
        <SkillBars variant="profile" />
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="card p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold font-display text-foreground">
              <BookOpen size={18} className="text-wire" />
              最新文章
            </h2>
            <Link href="/posts" className="text-sm text-wire hover:opacity-80">全部</Link>
          </div>
          <div className="space-y-3">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="block border border-hair p-4 transition-colors hover:border-wire"
              >
                <div className="text-xs font-medium text-wire">{post.category}</div>
                <div className="mt-1 font-medium text-foreground">{post.title}</div>
                <div className="mt-1 text-xs text-print">{post.readTime}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="card p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold font-display text-foreground">
              <Folder size={18} className="text-wire" />
              精选项目
            </h2>
            <Link href="/projects" className="text-sm text-wire hover:opacity-80">全部</Link>
          </div>
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.name}
                href={project.href}
                className="block border border-hair p-4 transition-colors hover:border-wire"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-foreground">{project.name}</div>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    ★ {project.stars}
                  </span>
                </div>
                <div className="mt-1 text-sm text-print">{project.description}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-8 border border-wire/30 bg-wire/[0.05] p-8 text-center">
        <h2 className="text-xl font-bold font-display text-foreground">一起交流</h2>
        <p className="mt-2 text-print">
          欢迎技术交流与合作，可以通过邮件或 GitHub 联系我。
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href="mailto:hello@example.com"
            className="btn-primary gap-2 px-5 py-2.5"
          >
            <Mail size={16} />
            发送邮件
          </a>
          <a
            href="https://github.com"
            className="btn-secondary gap-2 px-5 py-2.5"
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
