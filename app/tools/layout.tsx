import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "开发者工具",
  description: "浏览器端 JSON、Base64、时间戳、正则与 UUID 工具，数据不上传服务器。",
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
