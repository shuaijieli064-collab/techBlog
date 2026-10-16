import type { Metadata } from "next";

import { SettingsView } from "@/components/SettingsView";

export const metadata: Metadata = {
  title: "设置与数据中心 · NEXUS 工作台",
  description: "工作台数据分布、环境状态与数据迁移。",
};

export default function SettingsPage() {
  return <SettingsView />;
}
