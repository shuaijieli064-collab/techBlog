import Link from "next/link";
import type { Metadata } from "next";
import { Code, Bug, Layers, Database, GitBranch, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "提示词库",
  description: "收集和管理各类场景下的高效提示词，支持分类浏览。",
};

const promptsCategories = [
  { name: "Java 开发", count: 45, icon: Code, color: "text-sky-600", bgBg: "bg-sky-50 dark:bg-sky-900/30" },
  { name: "Bug 排查", count: 32, icon: Bug, color: "text-orange-600", bgBg: "bg-orange-50 dark:bg-orange-900/30" },
  { name: "项目架构", count: 28, icon: Layers, color: "text-purple-600", bgBg: "bg-purple-50 dark:bg-purple-900/30" },
  { name: "SQL 查询", count: 56, icon: Database, color: "text-green-600", bgBg: "bg-green-50 dark:bg-green-900/30" },
  { name: "Git 操作", count: 67, icon: GitBranch, color: "text-blue-600", bgBg: "bg-blue-50 dark:bg-blue-900/30" },
];

const popularPrompts = [
  { id: "1", title: "Java 代码优化提示词", category: "Java 开发", useCount: 128, favorited: true },
  { id: "2", title: "Bug 自动排查提示词", category: "Bug 排查", useCount: 96, favorited: false },
  { id: "3", title: "项目架构设计提示词", category: "项目架构", useCount: 78, favorited: true },
  { id: "4", title: "SQL 性能优化提示词", category: "SQL 查询", useCount: 234, favorited: false },
  { id: "5", title: "Git 提交规范提示词", category: "Git 操作", useCount: 156, favorited: true },
];

export default function AiPromptsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Prompt Library</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">提示词库</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          收集和管理各类场景下的高效提示词，支持一键复制和分类搜索。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {promptsCategories.map((category) => {
          return (
            <Link
              key={category.name}
              href={`/ai/prompts/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-sky-300 hover:bg-sky-50/50 dark:border-slate-800 dark:bg-slate-950 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${category.bgBg}`}>
                  <category.icon size={18} className={category.color} />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-50 group-hover:text-sky-600 transition-colors">{category.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{category.count} 个提示词</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">{category.count} 个</span>
                <Star size={14} className="text-yellow-500" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6">常用提示词</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {popularPrompts.map((prompt) => {
            return (
              <article
                key={prompt.id}
                className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-sky-200 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 rounded-xl bg-slate-100 p-3">
                    <Star size={14} className="text-sky-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 dark:text-slate-50 truncate">
                      {prompt.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {prompt.category}
                    </p>
                    <div className="text-right">
                      <span className="text-xs text-sky-500">{prompt.useCount} 次使用</span>
                      {prompt.favorited && <Star size={10} className="text-yellow-400 ml-1 fill-yellow-400" />}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6">分类浏览</h2>
        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:border-sky-300 hover:bg-sky-50/50 transition-colors">
            全部
          </button>
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:border-sky-300 hover:bg-sky-50/50 transition-colors">
            Java 开发
          </button>
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:border-sky-300 hover:bg-sky-50/50 transition-colors">
            Bug 排查
          </button>
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:border-sky-300 hover:bg-sky-50/50 transition-colors">
            项目架构
          </button>
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:border-sky-300 hover:bg-sky-50/50 transition-colors">
            SQL 查询
          </button>
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:border-sky-300 hover:bg-sky-50/50 transition-colors">
            Git 操作
          </button>
        </div>
      </div>
    </main>
  );
}