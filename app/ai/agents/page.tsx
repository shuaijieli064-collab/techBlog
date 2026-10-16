import Link from "next/link";
import type { Metadata } from "next";
import { Bot, ArrowLeft, Code2, PenLine, Bug, Telescope, ShieldCheck, Languages, MessageSquareText } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { agentPresets, modelById } from "@/lib/ai";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Agents",
  description: "常用 AI 智能体角色、能力边界与典型使用场景，一键进入对话。",
  ...pageMeta("/ai/agents"),
};

const iconByRole: Record<string, React.ElementType> = {
  Coding: Code2,
  Writing: PenLine,
  Debug: Bug,
  Review: ShieldCheck,
  Tutor: Telescope,
  i18n: Languages,
};

export default function AiAgentsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link
          href="/ai"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-wire hover:opacity-80"
        >
          <ArrowLeft size={14} /> 返回 AI 中心
        </Link>
      </div>

      <PageHeader
        code="08.2"
        eyebrow="Agents"
        title="AI Agents"
        description="围绕日常工作流组织的智能体角色：选一个角色即可在 AI 对话中自动加载对应提示词与推荐模型。"
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {agentPresets.map((agent) => {
          const Icon = iconByRole[agent.role] ?? Bot;
          const model = modelById(agent.model);
          return (
            <article key={agent.id} className="group card card-hover flex flex-col p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center bg-wire/10">
                  <Icon size={22} className="text-wire" />
                </div>
                <span className="bg-wire/10 px-2.5 py-1 text-xs font-medium text-wire">
                  {agent.role}
                </span>
              </div>

              <h2 className="mb-1 text-lg font-semibold text-foreground">{agent.name}</h2>
              <p className="text-sm leading-6 text-print">{agent.desc}</p>

              <div className="mt-4 border-t border-hair pt-4">
                <div className="flex items-center gap-1.5 text-xs text-print">
                  <Bot size={12} />
                  推荐模型：<span className="text-wire">{model?.short ?? agent.model}</span>
                </div>
              </div>

              <Link
                href={`/ai/chat?agent=${agent.id}`}
                className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md border border-wire/50 px-3 py-2 text-sm font-medium text-wire transition-colors hover:bg-wire/10"
              >
                <MessageSquareText size={14} /> 去对话
              </Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}
