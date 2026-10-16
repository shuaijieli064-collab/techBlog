"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ChevronRight } from "lucide-react";

import JsonFormatter from "./tools/JsonFormatter";

const Base64Tool = dynamic(() => import("./tools/Base64Tool"));
const TimestampConverter = dynamic(() => import("./tools/TimestampConverter"));
const RegexTester = dynamic(() => import("./tools/RegexTester"));
const UuidGenerator = dynamic(() => import("./tools/UuidGenerator"));
const UrlTool = dynamic(() => import("./tools/UrlTool"));
const JwtDecoder = dynamic(() => import("./tools/JwtDecoder"));
const ColorTool = dynamic(() => import("./tools/ColorTool"));
const HashTool = dynamic(() => import("./tools/HashTool"));
const MarkdownTool = dynamic(() => import("./tools/MarkdownTool"));
const SqlFormatter = dynamic(() => import("./tools/SqlFormatter"));
const CronTool = dynamic(() => import("./tools/CronTool"));
const HtmlFormatter = dynamic(() => import("./tools/HtmlFormatter"));

const tools: Array<{ id: string; name: string; component: React.ComponentType }> = [
  { id: "json", name: "JSON 格式化", component: JsonFormatter },
  { id: "base64", name: "Base64 编解码", component: Base64Tool },
  { id: "timestamp", name: "时间戳转换", component: TimestampConverter },
  { id: "regex", name: "正则测试", component: RegexTester },
  { id: "uuid", name: "UUID 生成", component: UuidGenerator },
  { id: "url", name: "URL 编解码", component: UrlTool },
  { id: "jwt", name: "JWT 解析", component: JwtDecoder },
  { id: "color", name: "颜色转换", component: ColorTool },
  { id: "hash", name: "哈希计算", component: HashTool },
  { id: "markdown", name: "Markdown 预览", component: MarkdownTool },
  { id: "sql", name: "SQL 格式化", component: SqlFormatter },
  { id: "cron", name: "Cron 解析", component: CronTool },
  { id: "html", name: "HTML 格式化", component: HtmlFormatter },
];

export default function ToolsExplorer() {
  const [active, setActive] = useState("json");
  const ActiveTool = tools.find((t) => t.id === active)?.component || JsonFormatter;

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <nav
        aria-label="工具列表"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActive(tool.id)}
            aria-pressed={active === tool.id}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-2 font-mono text-sm transition-all duration-200 lg:w-full ${
              active === tool.id
                ? "border-wire/50 bg-panel font-semibold text-wire shadow-[0_0_14px_-4px_rgba(92,225,255,0.5)]"
                : "border-hair bg-panel text-print hover:border-wire/40 hover:text-wire"
            }`}
          >
            {tool.name}
            {active === tool.id && <ChevronRight size={14} className="ml-auto hidden lg:block" />}
          </button>
        ))}
      </nav>

      <div className="card relative overflow-hidden p-6">
        <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-wire to-transparent opacity-60" />
        <ActiveTool />
      </div>
    </div>
  );
}
