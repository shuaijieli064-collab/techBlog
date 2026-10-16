import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, XCircle, KeyRound, Server, MessagesSquare } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { modelOptions, DEFAULT_MODEL } from "@/lib/ai";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI 模型中心",
  description: "当前接入的 ModelScope 模型清单与服务端配置状态。",
  ...pageMeta("/ai/models"),
};

const baseUrl = (process.env.MODELSCOPE_BASE_URL || "https://api-inference.modelscope.cn/v1").replace(/\/$/, "");
const configured = Boolean(process.env.MODELSCOPE_API_KEY);

export default function AiModelsPage() {
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
        code="08.1"
        eyebrow="AI Models"
        title="AI 模型中心"
        description="当前通过 ModelScope（魔搭社区）接入的模型清单与服务端配置状态。Key 仅存于服务端环境变量，前端永不暴露。"
      />

      {/* 接入状态 */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <div className="mb-2 flex items-center gap-2">
            {configured ? (
              <CheckCircle2 size={18} className="text-wire" />
            ) : (
              <XCircle size={18} className="text-alert" />
            )}
            <h2 className="text-sm font-semibold text-foreground">
              {configured ? "API Key 已配置" : "API Key 未配置"}
            </h2>
          </div>
          <p className="text-sm leading-6 text-print">
            {configured
              ? "服务端已读取 MODELSCOPE_API_KEY，AI 功能（对话 / 规划 / 写作）可直接使用。"
              : "请在 .env.local 中设置 MODELSCOPE_API_KEY 后重启 dev server。"}
          </p>
        </div>

        <div className="card p-5">
          <div className="mb-2 flex items-center gap-2">
            <Server size={18} className="text-wire" />
            <h2 className="text-sm font-semibold text-foreground">接入端点</h2>
          </div>
          <p className="font-mono text-xs leading-6 text-print">{baseUrl}</p>
          <p className="mt-1 text-xs text-muted">OpenAI 兼容 chat/completions</p>
        </div>

        <div className="card p-5">
          <div className="mb-2 flex items-center gap-2">
            <MessagesSquare size={18} className="text-wire" />
            <h2 className="text-sm font-semibold text-foreground">默认模型</h2>
          </div>
          <p className="font-mono text-xs leading-6 text-wire">{DEFAULT_MODEL}</p>
          <p className="mt-1 text-xs text-muted">AI 对话 / 规划默认使用，可在对话页切换</p>
        </div>
      </div>

      {/* 模型清单 */}
      <h2 className="section-title mb-5">可用模型</h2>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {modelOptions.map((model) => (
          <article key={model.id} className="card card-hover flex flex-col p-6">
            <div className="mb-2 flex items-start justify-between gap-3">
              <h3 className="font-display font-semibold text-foreground">{model.label}</h3>
              {model.id === DEFAULT_MODEL && (
                <span className="shrink-0  bg-wire/10 px-2 py-0.5 font-mono text-[10px] text-wire">
                  DEFAULT
                </span>
              )}
            </div>
            <p className="text-sm leading-6 text-print">{model.desc}</p>
            <div className="mt-4 flex items-center justify-between border-t border-hair pt-3">
              <span className="text-xs text-muted">适用</span>
              <span className="text-xs font-medium text-wire">{model.bestFor}</span>
            </div>
            <p className="mt-3 break-all font-mono text-[10px] leading-5 text-muted">{model.id}</p>
          </article>
        ))}
      </div>

      {/* 调用说明 */}
      <div className="mt-8 rounded-lg rounded-lg border border-wire/30 bg-wire/[0.05] p-5">
        <div className="flex items-start gap-3">
          <KeyRound size={18} className="mt-0.5 shrink-0 text-wire" />
          <div>
            <p className="text-sm font-medium text-foreground">调用方式</p>
            <p className="mt-1 text-sm leading-6 text-print">
              前端统一走服务端代理 <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-xs text-wire">POST /api/ai/chat</code>
              ，Key 不进入浏览器。用量与费用统计请在 ModelScope 控制台查看。
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
