import type { Metadata } from "next";

import { AiChat } from "@/components/ai/AiChat";
import { PageHeader } from "@/components/PageHeader";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI 对话",
  description: "通用 AI 对话工作台：选择模型与 Agent 角色，可注入工作台真实数据。",
  ...pageMeta("/ai/chat"),
};

export default async function AiChatPage({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string }>;
}) {
  const { agent } = await searchParams;
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        code="08.0"
        eyebrow="AI Chat"
        title="AI 对话"
        description="接入 ModelScope 的通用对话工作台。模型与 Agent 自由切换，可注入工作台真实数据让回答贴合你的进度。"
      />
      <AiChat initialAgent={agent} />
    </main>
  );
}
