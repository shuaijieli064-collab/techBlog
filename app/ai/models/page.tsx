import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI 模型中心",
  description: "记录和管理使用的 AI 模型、用量与费用概览。",
  ...pageMeta("/ai/models"),
};

const aiModels = [
  { name: "GPT-4o", provider: "OpenAI", monthlyLimit: 1000, currentUsage: 234, monthlyCost: 45.50, status: "active", notes: "最强大的模型，适合复杂任务" },
  { name: "Claude 3.5 Sonnet", provider: "Anthropic", monthlyLimit: 800, currentUsage: 189, monthlyCost: 38.20, status: "active", notes: "写作和代码生成的最佳选择" },
  { name: "Gemini 1.5 Pro", provider: "Google", monthlyLimit: 900, currentUsage: 156, monthlyCost: 32.10, status: "active", notes: "多模态能力强，性价比高" },
  { name: "DeepSeek V3", provider: "DeepSeek", monthlyLimit: 500, currentUsage: 89, monthlyCost: 18.90, status: "active", notes: "中文处理能力强，成本低廉" },
  { name: "Qwen Max", provider: "阿里云", monthlyLimit: 600, currentUsage: 123, monthlyCost: 25.40, status: "active", notes: "阿里云生态内最强模型" },
  { name: "Kimi k1.5", provider: "Moonshot", monthlyLimit: 400, currentUsage: 67, monthlyCost: 15.20, status: "active", notes: "长上下文处理，适合阅读长文档" },
];

export default function AiModelsPage() {
  const totalMonthlyCost = aiModels.reduce((sum, model) => sum + model.monthlyCost, 0);
  const activeModels = aiModels.filter(model => model.status === "active").length;
  const totalUsage = aiModels.reduce((sum, model) => sum + model.currentUsage, 0);
  const totalLimit = aiModels.reduce((sum, model) => sum + model.monthlyLimit, 0);
  const usageRate = Math.round((totalUsage / totalLimit) * 100);

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link
          href="/ai"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-wire hover:opacity-80"
        >
          <ArrowLeft size={14} /> 返回 AI 中心
        </Link>
      </div>
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-wire">AI Center</p>
        <h1 className="text-4xl font-bold font-display tracking-tight text-foreground">AI 模型中心</h1>
        <p className="mt-4 text-lg text-print">
          记录和管理使用的AI模型，API Key 均通过 Supabase 加密存储，前端绝不直接暴露敏感信息。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {aiModels.map((model) => {
          return (
            <article
              key={model.name}
              className="card card-hover p-6"
            >
              <div className="flex flex-col md:flex-row mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground">{model.name}</h2>
                  <p className="text-sm text-print">{model.provider}</p>
                  <div className="mt-2">
                    <span className="text-xs text-wire">状态：</span>
                    <span className={`font-medium ${model.status === "active" ? "text-wire" : "text-alert"}`}>{model.status}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted">{model.notes}</p>
                </div>
                <div className="md:ml-4">
                  <div className="flex text-sm text-print">
                    <span>月度限额：</span>
                    <span>{model.monthlyLimit}</span>
                  </div>
                  <div className="flex text-sm text-print mt-2">
                    <span>当前使用：</span>
                    <span>{model.currentUsage}</span>
                  </div>
                  <div className="flex text-sm text-print mt-2">
                    <span>月度费用：</span>
                    <span>${model.monthlyCost}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <small className="text-xs text-print">
                  {model.status === "active" ? "已激活" : "未激活"}
                </small>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 border border-wire/30 bg-wire/[0.05] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium font-display text-foreground">月度概览</h2>
          <span className="text-xl font-bold text-wire">${totalMonthlyCost.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-3">
          <div>
            <p className="text-2xl font-bold text-wire">{activeModels}</p>
            <p className="text-xs text-print">激活模型</p>
          </div>
          <div>
            <p className="text-2xl text-print">{totalUsage}/{totalLimit}</p>
            <p className="text-xs text-muted">总使用量</p>
          </div>
          <div>
            <p className="text-2xl text-wire">{usageRate}%</p>
            <p className="text-xs text-muted">使用率</p>
          </div>
        </div>
      </div>
    </main>
  );
}