import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "AI 模型中心",
  description: "记录和管理使用的 AI 模型、用量与费用概览。",
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
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">AI Center</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">AI 模型中心</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          记录和管理使用的AI模型，API Key 均通过 Supabase 加密存储，前端绝不直接暴露敏感信息。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {aiModels.map((model) => {
          return (
            <article
              key={model.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex flex-col md:flex-row mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">{model.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{model.provider}</p>
                  <div className="mt-2">
                    <span className="text-xs text-sky-500">状态：</span>
                    <span className={`font-medium ${model.status === "active" ? "text-green-600" : "text-red-600"}`}>{model.status}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{model.notes}</p>
                </div>
                <div className="md:ml-4">
                  <div className="flex text-sm text-slate-500 dark:text-slate-400">
                    <span>月度限额：</span>
                    <span>{model.monthlyLimit}</span>
                  </div>
                  <div className="flex text-sm text-slate-500 dark:text-slate-400 mt-2">
                    <span>当前使用：</span>
                    <span>{model.currentUsage}</span>
                  </div>
                  <div className="flex text-sm text-slate-500 dark:text-slate-400 mt-2">
                    <span>月度费用：</span>
                    <span>${model.monthlyCost}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <small className="text-xs text-slate-500 dark:text-slate-400">
                  {model.status === "active" ? "已激活" : "未激活"}
                </small>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 p-6 rounded-2xl border border-sky-500/20 bg-sky-50/50 dark:border-sky-800/20 dark:bg-sky-950/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium text-slate-900 dark:text-slate-50">月度概览</h2>
          <span className="text-xl font-bold text-sky-600">${totalMonthlyCost.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-3">
          <div>
            <p className="text-2xl font-bold text-sky-600">{activeModels}</p>
            <p className="text-xs text-slate-500">激活模型</p>
          </div>
          <div>
            <p className="text-2xl text-slate-500">{totalUsage}/{totalLimit}</p>
            <p className="text-xs text-slate-400">总使用量</p>
          </div>
          <div>
            <p className="text-2xl text-sky-600">{usageRate}%</p>
            <p className="text-xs text-slate-400">使用率</p>
          </div>
        </div>
      </div>
    </main>
  );
}