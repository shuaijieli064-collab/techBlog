import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { PromptLibrary } from "@/components/PromptLibrary";
import { PageHeader } from "@/components/PageHeader";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "提示词库",
  description: "收集和管理各类场景下的高效提示词，支持分类浏览、一键复制与本地收藏。",
  ...pageMeta("/ai/prompts"),
};

export default function AiPromptsPage() {
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

      <PageHeader
        code="prompts"
        eyebrow="Prompt Library"
        title="提示词库"
        description="收集和管理各类场景下的高效提示词。支持搜索、分类、一键复制、本地收藏与新建（数据仅存浏览器）。"
      />

      <PromptLibrary />
    </main>
  );
}
