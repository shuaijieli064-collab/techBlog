import Link from "next/link";
import type { Metadata } from "next";
import { NotebookPen, GraduationCap, Terminal, FileQuestion, Archive, FunctionSquare } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { AiBlogDraft } from "@/components/AiBlogDraft";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "知识库",
  description: "个人知识库入口：技术笔记、学习笔记、面试题与常用命令。",
  ...pageMeta("/knowledge"),
};

const sections = [
  {
    title: "技术笔记",
    icon: NotebookPen,
    desc: "记录技术点、实践过程和心得体会。",
    href: "/notes",
    linkLabel: "进入笔记地图",
  },
  {
    title: "学习笔记",
    icon: GraduationCap,
    desc: "系统化学习路线和知识体系记录。",
    href: "/learning",
    linkLabel: "进入学习中心",
  },
  {
    title: "面试题库",
    icon: FileQuestion,
    desc: "常见面试题目和答案收集，按主题整理。",
    href: "/posts",
    linkLabel: "浏览相关文章",
  },
  {
    title: "常用命令",
    icon: Terminal,
    desc: "日常开发常用的 shell 命令和技巧。",
    href: "/functions",
    linkLabel: "打开函数速查",
  },
  {
    title: "文章归档",
    icon: Archive,
    desc: "按时间线回看全部发布内容。",
    href: "/archive",
    linkLabel: "查看归档",
  },
  {
    title: "函数速查",
    icon: FunctionSquare,
    desc: "Java 等语言常用函数与 API 速查表。",
    href: "/functions",
    linkLabel: "打开速查表",
  },
];

export default function KnowledgePage() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Knowledge Base"
        title="个人知识库"
        description="把零散知识整理成可检索的结构：笔记、面试题、命令与归档统一入口。"
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.title} href={section.href} className="card card-hover group p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center bg-wire/10">
              <section.icon size={20} className="text-wire" />
            </div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-wire">
              {section.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-print">{section.desc}</p>
            <span className="mt-4 inline-block text-sm font-medium text-wire">
              {section.linkLabel}
            </span>
          </Link>
        ))}
      </div>

      <AiBlogDraft />
    </main>
  );
}
