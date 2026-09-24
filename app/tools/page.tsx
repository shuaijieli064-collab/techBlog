"use client";

import { useState } from "react";
import { Copy, Check, ChevronRight } from "lucide-react";

function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch {
      setError("JSON 格式错误");
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="粘贴 JSON 数据..."
        className="w-full h-40 rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      <button onClick={format} className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500">
        格式化
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {output && <pre className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-700 overflow-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">{output}</pre>}
    </div>
  );
}

function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const convert = () => {
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setOutput("转换错误");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("encode")} className={`rounded-lg px-3 py-1.5 text-sm ${mode === "encode" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>编码</button>
        <button onClick={() => setMode("decode")} className={`rounded-lg px-3 py-1.5 text-sm ${mode === "decode" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>解码</button>
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="输入内容..." className="w-full h-32 rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
      <button onClick={convert} className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500">转换</button>
      {output && (
        <div className="relative">
          <pre className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm overflow-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">{output}</pre>
          <CopyButton text={output} />
        </div>
      )}
    </div>
  );
}

function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [result, setResult] = useState("");

  const toHuman = () => {
    const ts = parseInt(timestamp);
    const d = new Date(ts > 1e11 ? ts : ts * 1000);
    setResult(d.toLocaleString("zh-CN"));
  };

  const toTimestamp = () => {
    const d = new Date(dateStr);
    setResult(Math.floor(d.getTime() / 1000).toString());
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1">时间戳 → 日期</label>
        <div className="flex gap-2">
          <input value={timestamp} onChange={(e) => setTimestamp(e.target.value)} placeholder="1693000000" className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
          <button onClick={toHuman} className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500">转换</button>
        </div>
      </div>
      <div>
        <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1">日期 → 时间戳</label>
        <div className="flex gap-2">
          <input type="datetime-local" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
          <button onClick={toTimestamp} className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500">转换</button>
        </div>
      </div>
      {result && (
        <div className="relative">
          <pre className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">{result}</pre>
          <CopyButton text={result} />
        </div>
      )}
    </div>
  );
}

function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testStr, setTestStr] = useState("");
  const [matches, setMatches] = useState<string[]>([]);

  const test = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const found = testStr.match(regex) || [];
      setMatches(found);
    } catch {
      setMatches(["正则表达式错误"]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="正则表达式" className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
        <input value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="g" className="w-16 rounded-xl border border-slate-200 bg-white px-4 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
        <button onClick={test} className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500">测试</button>
      </div>
      <textarea value={testStr} onChange={(e) => setTestStr(e.target.value)} placeholder="测试字符串..." className="w-full h-24 rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
      {matches.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">匹配结果 ({matches.length})</p>
          <div className="flex flex-wrap gap-2">
            {matches.map((m, i) => (
              <span key={i} className="rounded-lg bg-sky-100 px-2 py-1 font-mono text-xs text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = () => {
    const uuid = crypto.randomUUID();
    setUuids((prev) => [uuid, ...prev].slice(0, 5));
  };

  return (
    <div className="space-y-4">
      <button onClick={generate} className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500">生成 UUID</button>
      <div className="space-y-2">
        {uuids.map((uuid, i) => (
          <div key={i} className="relative">
            <code className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">{uuid}</code>
            <CopyButton text={uuid} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="absolute top-2 right-2 rounded-lg bg-white p-1.5 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700">
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-slate-400" />}
    </button>
  );
}

const tools = [
  { id: "json", name: "JSON 格式化", component: JsonFormatter },
  { id: "base64", name: "Base64 编解码", component: Base64Tool },
  { id: "timestamp", name: "时间戳转换", component: TimestampConverter },
  { id: "regex", name: "正则测试", component: RegexTester },
  { id: "uuid", name: "UUID 生成", component: UuidGenerator },
];

export default function ToolsPage() {
  const [active, setActive] = useState("json");
  const ActiveTool = tools.find((t) => t.id === active)?.component || JsonFormatter;

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Tools</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">开发者工具</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          浏览器端运行，数据不会上传到服务器。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav className="space-y-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActive(tool.id)}
              className={`flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                active === tool.id
                  ? "bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
              }`}
            >
              {tool.name}
              {active === tool.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <ActiveTool />
        </div>
      </div>
    </main>
  );
}
