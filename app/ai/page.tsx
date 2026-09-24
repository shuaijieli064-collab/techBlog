import Link from "next/link";
import type { Metadata } from "next";
import { Bot, MessageSquareText, Sparkles, ArrowRight, KeyRound } from "lucide-react";

export const metadata: Metadata = {
  title: "AI 中心",
  description: "AI 模型、Agents 与提示词库的统一入口。",
};

const entries = [
  {
    title: "AI 模型",
    href: "/ai/models",
    icon: Sparkles,
    desc: "模型列表、用量与月度费用概览。",
    color: "text-sky-600",
    bg: "bg-sky-50 dark:bg-sky-900/30",
  },
  {
    title: "AI Agents",
    href: "/ai/agents",
    icon: Bot,
    desc: "常用智能体角色、能力与使用场景。",
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/30",
  },
  {
    title: "提示词库",
    href: "/ai/prompts",
    icon: MessageSquareText,
    desc: "场景化提示词，支持复制、收藏与本地新建。",
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-900/30",
  },
];

export default function AiCenterPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
          AI Center
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          AI 中心
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          模型、智能体与提示词的统一入口。API Key 仅保存在服务端环境变量，前端永不暴露。
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {entries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-700"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900">
              <entry.icon size={22} className={entry.color} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 group-hover:text-sky-600 dark:group-hover:text-sky-400">
              {entry.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{entry.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sky-600 dark:text-sky-400">
              进入 <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-sky-500/20 bg-sky-50/50 p-5 dark:border-sky-800/30 dark:bg-sky-950/40">
        <div className="flex items-start gap-3">
          <KeyRound size={18} className="mt-0.5 shrink-0 text-sky-600" />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">安全提示</p>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              任何模型的 API Key 都不应写进前端代码或提交到仓库。生产环境请通过服务端
              代理或 Supabase Edge Function 调用第三方模型。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
