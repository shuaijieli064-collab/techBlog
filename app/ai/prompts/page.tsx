import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { PromptLibrary } from "@/components/PromptLibrary";

export const metadata: Metadata = {
  title: "提示词库",
  description: "收集和管理各类场景下的高效提示词，支持分类浏览、一键复制与本地收藏。",
};

export default function AiPromptsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link
          href="/ai"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-wire hover:opacity-80"
        >
          <ArrowLeft size={14} /> 返回 AI 中心
        </Link>
      </div>

      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-wire">Prompt Library</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">提示词库</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          收集和管理各类场景下的高效提示词。支持搜索、分类、一键复制、本地收藏与新建（数据仅存浏览器）。
        </p>
      </div>

      <PromptLibrary />
    </main>
  );
}
