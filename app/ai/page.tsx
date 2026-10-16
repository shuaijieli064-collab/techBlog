import Link from "next/link";
import type { Metadata } from "next";
import { Bot, MessageSquareText, Sparkles, ArrowRight, KeyRound, MessagesSquare } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI 中心",
  description: "AI 对话、模型、Agents 与提示词库的统一入口。",
  ...pageMeta("/ai"),
};

const entries = [
  {
    title: "AI 对话",
    href: "/ai/chat",
    icon: MessagesSquare,
    desc: "通用对话工作台：选模型 / Agent，可注入工作台真实数据。",
    color: "text-wire",
    bg: "bg-wire/10",
  },
  {
    title: "AI 模型",
    href: "/ai/models",
    icon: Sparkles,
    desc: "ModelScope 接入状态与可用模型清单。",
    color: "text-wire",
    bg: "bg-wire/10",
  },
  {
    title: "AI Agents",
    href: "/ai/agents",
    icon: Bot,
    desc: "常用智能体角色、推荐模型与一键进入对话。",
    color: "text-wire",
    bg: "bg-wire/10",
  },
  {
    title: "提示词库",
    href: "/ai/prompts",
    icon: MessageSquareText,
    desc: "场景化提示词，支持复制、收藏与本地新建。",
    color: "text-wire",
    bg: "bg-wire/10",
  },
];

export default function AiCenterPage() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        code="08"
        eyebrow="AI Center"
        title="AI 中心"
        description="模型、智能体与提示词的统一入口。API Key 仅保存在服务端环境变量，前端永不暴露。"
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {entries.map((entry) => (
          <Link key={entry.href} href={entry.href} className="card card-hover group relative overflow-hidden p-6">
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-gradient-to-r from-wire to-violet transition-transform duration-300 group-hover:scale-x-100" />
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-hair ${entry.bg} transition-all duration-300 group-hover:border-wire/50 group-hover:drop-shadow-[0_0_8px_rgba(92,225,255,0.5)]`}>
              <entry.icon size={22} className={entry.color} />
            </div>
            <h2 className="text-lg font-semibold text-foreground transition-colors group-hover:text-wire">
              {entry.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-print">{entry.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-wire">
              进入 <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-lg rounded-lg border border-wire/30 bg-wire/[0.05] p-5">
        <div className="flex items-start gap-3">
          <KeyRound size={18} className="mt-0.5 shrink-0 text-wire" />
          <div>
            <p className="text-sm font-medium text-foreground">安全提示</p>
            <p className="mt-1 text-sm leading-6 text-print">
              任何模型的 API Key 都不应写进前端代码或提交到仓库。生产环境请通过服务端
              代理或 Supabase Edge Function 调用第三方模型。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
