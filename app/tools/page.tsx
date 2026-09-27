import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import ToolsExplorer from "@/components/ToolsExplorer";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "开发者工具",
  description:
    "浏览器端运行的开发者工具合集：JSON、Base64、时间戳、正则、UUID、URL、JWT、颜色、哈希、Markdown、SQL、Cron、HTML 格式化。",
  ...pageMeta("/tools"),
};

export default function ToolsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Tools"
        title="开发者工具"
        description="浏览器端运行，数据不会上传到服务器。"
      />

      <ToolsExplorer />
    </main>
  );
}
