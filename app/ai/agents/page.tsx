import Link from "next/link";
import type { Metadata } from "next";
import { Bot, ArrowLeft, Code2, PenLine, Bug, Telescope, ShieldCheck, Languages } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Agents",
  description: "常用 AI 智能体角色、能力边界与典型使用场景。",
};

const agents = [
  {
    name: "代码生成助手",
    icon: Code2,
    color: "text-sky-600",
    bg: "bg-sky-50 dark:bg-sky-900/30",
    role: "Coding",
    desc: "根据需求生成函数、组件与脚手架代码，补充类型与基础测试。",
    strengths: ["函数/组件生成", "重构建议", "样板代码"],
    model: "GPT-4o / Claude",
    status: "ready",
  },
  {
    name: "文档润色助手",
    icon: PenLine,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/30",
    role: "Writing",
    desc: "把技术草稿整理成结构清晰的博客、README 与复盘文档。",
    strengths: ["标题提炼", "结构重组", "语气统一"],
    model: "Claude 3.5 Sonnet",
    status: "ready",
  },
  {
    name: "Bug 排查助手",
    icon: Bug,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-900/30",
    role: "Debug",
    desc: "根据堆栈与复现步骤定位根因，给出最小验证与修复建议。",
    strengths: ["日志解读", "根因假设", "修复验证"],
    model: "DeepSeek V3",
    status: "ready",
  },
  {
    name: "代码审查助手",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    role: "Review",
    desc: "检查 diff 中的逻辑风险、安全问题与可维护性坏味道。",
    strengths: ["逻辑漏洞", "安全扫描", "风格一致性"],
    model: "Claude / GPT-4o",
    status: "beta",
  },
  {
    name: "学习规划助手",
    icon: Telescope,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/30",
    role: "Tutor",
    desc: "按目标拆解学习路线，生成每日任务与阶段性复盘问题。",
    strengths: ["路线拆解", "周复盘", "知识查漏"],
    model: "Gemini 1.5 Pro",
    status: "ready",
  },
  {
    name: "多语言翻译助手",
    icon: Languages,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/30",
    role: "i18n",
    desc: "技术文档中英互译，保留代码块与术语一致性。",
    strengths: ["术语表", "代码保留", "本地化"],
    model: "Qwen Max",
    status: "ready",
  },
];

export default function AiAgentsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link
          href="/ai"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400"
        >
          <ArrowLeft size={14} /> 返回 AI 中心
        </Link>
      </div>

      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Agents</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          AI Agents
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          围绕日常工作流组织的智能体角色卡片：先选场景，再选模型，提示词在提示词库中配套维护。
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <article
            key={agent.name}
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-sky-700"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900">
                <agent.icon size={22} className={agent.color} />
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  agent.status === "ready"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                }`}
              >
                {agent.status === "ready" ? "可用" : "Beta"}
              </span>
            </div>

            <div className="mb-1 flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{agent.name}</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {agent.role}
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{agent.desc}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {agent.strengths.map((s) => (
                <span
                  key={s}
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${agent.bg} ${agent.color}`}
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Bot size={12} /> {agent.model}
              </span>
              <Link
                href="/ai/prompts"
                className="text-xs font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400"
              >
                配套提示词 →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
