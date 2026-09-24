"use client";

import { useState } from "react";
import { Copy, Check, ChevronRight } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";

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
        className="input-base h-40 font-mono"
      />
      <button onClick={format} className="btn-primary rounded-xl px-4 py-2">
        格式化
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {output && (
        <pre className="w-full overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {output}
        </pre>
      )}
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
        <button
          onClick={() => setMode("encode")}
          className={`rounded-lg px-3 py-1.5 text-sm ${
            mode === "encode"
              ? "bg-sky-600 text-white"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          编码
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`rounded-lg px-3 py-1.5 text-sm ${
            mode === "decode"
              ? "bg-sky-600 text-white"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          解码
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入内容..."
        className="input-base h-32 font-mono"
      />
      <button onClick={convert} className="btn-primary rounded-xl px-4 py-2">
        转换
      </button>
      {output && (
        <div className="relative">
          <pre className="w-full overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {output}
          </pre>
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
        <label className="mb-1 block text-sm text-slate-500 dark:text-slate-400">时间戳 → 日期</label>
        <div className="flex gap-2">
          <input
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="1693000000"
            className="input-base flex-1 font-mono"
          />
          <button onClick={toHuman} className="btn-primary rounded-xl px-4 py-2">
            转换
          </button>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-500 dark:text-slate-400">日期 → 时间戳</label>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="input-base flex-1"
          />
          <button onClick={toTimestamp} className="btn-primary rounded-xl px-4 py-2">
            转换
          </button>
        </div>
      </div>
      {result && (
        <div className="relative">
          <pre className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {result}
          </pre>
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
        <input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="正则表达式"
          className="input-base flex-1 font-mono"
        />
        <input
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          placeholder="g"
          className="input-base w-16 font-mono"
        />
        <button onClick={test} className="btn-primary rounded-xl px-4 py-2">
          测试
        </button>
      </div>
      <textarea
        value={testStr}
        onChange={(e) => setTestStr(e.target.value)}
        placeholder="测试字符串..."
        className="input-base h-24 font-mono"
      />
      {matches.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">匹配结果 ({matches.length})</p>
          <div className="flex flex-wrap gap-2">
            {matches.map((m, i) => (
              <span
                key={i}
                className="rounded-lg bg-sky-100 px-2 py-1 font-mono text-xs text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
              >
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
      <button onClick={generate} className="btn-primary rounded-xl px-4 py-2">
        生成 UUID
      </button>
      <div className="space-y-2">
        {uuids.map((uuid, i) => (
          <div key={i} className="relative">
            <code className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {uuid}
            </code>
            <CopyButton text={uuid} />
          </div>
        ))}
      </div>
    </div>
  );
}

function UrlTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const output = (() => {
    if (!input) return "";
    try {
      return mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch {
      return "解码失败：无效的百分号编码";
    }
  })();

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("encode")}
          className={`rounded-lg px-3 py-1.5 text-sm ${
            mode === "encode"
              ? "bg-sky-600 text-white"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          编码
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`rounded-lg px-3 py-1.5 text-sm ${
            mode === "decode"
              ? "bg-sky-600 text-white"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          解码
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "encode" ? "要编码的文本或 URL 片段…" : "粘贴 %E4%B8%AD%E6%96%87 这类编码…"}
        className="input-base h-32 font-mono"
      />
      {output && (
        <div className="relative">
          <pre className="w-full overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {output}
          </pre>
          <CopyButton text={output} />
        </div>
      )}
    </div>
  );
}

function base64UrlDecode(segment: string): string {
  const pad = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = pad + "=".repeat((4 - (pad.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function JwtDecoder() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const parts = token.trim().split(".");
  const valid = parts.length === 3 && parts.every((p) => p.length > 0);

  let header = "";
  let payload = "";
  if (valid) {
    try {
      header = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2);
      payload = JSON.stringify(JSON.parse(base64UrlDecode(parts[1])), null, 2);
      setError("");
    } catch {
      setError("无法解码：请确认是合法的 JWT（header.payload.signature）");
      header = "";
      payload = "";
    }
  } else if (token.trim()) {
    setError("格式不正确：JWT 应包含三段，用 . 分隔");
  } else {
    setError("");
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        仅本地 Base64URL 解码预览，不校验签名。请勿粘贴生产环境真实令牌。
      </p>
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…"
        className="input-base h-28 font-mono text-xs"
      />
      {error && <p className="text-sm text-amber-600 dark:text-amber-400">{error}</p>}
      {header && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Header</p>
            <div className="relative">
              <pre className="overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {header}
              </pre>
              <CopyButton text={header} />
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Payload</p>
            <div className="relative">
              <pre className="overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {payload}
              </pre>
              <CopyButton text={payload} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorTool() {
  const [hex, setHex] = useState("#0ea5e9");

  const normalize = (value: string) => {
    let v = value.trim().replace(/^#/, "");
    if (v.length === 3)
      v = v
        .split("")
        .map((c) => c + c)
        .join("");
    if (!/^[0-9a-fA-F]{6}$/.test(v)) return null;
    return `#${v.toLowerCase()}`;
  };

  const valid = normalize(hex);
  const rgb = valid
    ? [parseInt(valid.slice(1, 3), 16), parseInt(valid.slice(3, 5), 16), parseInt(valid.slice(5, 7), 16)]
    : null;

  const toHsl = (r: number, g: number, b: number) => {
    const rn = r / 255,
      gn = g / 255,
      bn = b / 255;
    const max = Math.max(rn, gn, bn),
      min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    let h = 0,
      s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      else if (max === gn) h = ((bn - rn) / d + 2) / 6;
      else h = ((rn - gn) / d + 4) / 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="color"
          value={valid ?? "#0ea5e9"}
          onChange={(e) => setHex(e.target.value)}
          className="h-12 w-16 cursor-pointer rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"
          aria-label="选择颜色"
        />
        <input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#0ea5e9"
          className="input-base flex-1 font-mono"
        />
      </div>
      <div
        className="h-24 rounded-xl border border-slate-200 dark:border-slate-700"
        style={{ backgroundColor: valid ?? "transparent" }}
      />
      {valid && rgb && (
        <div className="grid grid-cols-3 gap-3 text-sm">
          {[
            { label: "HEX", value: valid },
            { label: "RGB", value: `rgb(${rgb.join(", ")})` },
            { label: "HSL", value: toHsl(rgb[0], rgb[1], rgb[2]) },
          ].map((row) => (
            <div
              key={row.label}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="text-xs text-slate-500">{row.label}</div>
              <div className="mt-1 break-all font-mono text-xs text-slate-800 dark:text-slate-200">{row.value}</div>
              <CopyButton text={row.value} />
            </div>
          ))}
        </div>
      )}
      {!valid && hex.trim() && (
        <p className="text-sm text-red-500">请输入合法的 HEX 颜色，如 #0ea5e9</p>
      )}
    </div>
  );
}

async function digestHex(algorithm: string, message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const buf = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function HashTool() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const algorithms: Array<{ id: string; label: string }> = [
    { id: "SHA-1", label: "SHA-1" },
    { id: "SHA-256", label: "SHA-256" },
    { id: "SHA-384", label: "SHA-384" },
    { id: "SHA-512", label: "SHA-512" },
  ];

  const run = async () => {
    setError("");
    if (!input) {
      setResults({});
      return;
    }
    try {
      const entries = await Promise.all(
        algorithms.map(async (a) => [a.label, await digestHex(a.id, input)] as const),
      );
      setResults(Object.fromEntries(entries));
    } catch {
      setError("当前环境不支持 Web Crypto");
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入要哈希的文本…"
        className="input-base h-28 font-mono"
      />
      <button onClick={run} className="btn-primary rounded-xl px-4 py-2">
        计算哈希
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="space-y-2">
        {Object.entries(results).map(([label, value]) => (
          <div key={label} className="relative">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
              <span className="text-xs font-semibold text-slate-500">{label}</span>
              <code className="ml-2 flex-1 truncate font-mono text-xs text-slate-700 dark:text-slate-300">
                {value}
              </code>
            </div>
            <CopyButton text={value} />
          </div>
        ))}
      </div>
    </div>
  );
}

function inlineMarkdown(src: string): string {
  return src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
    );
}

function renderMarkdown(src: string): string {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inCode = false;
  let codeBuf: string[] = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (!inCode) {
        closeList();
        inCode = true;
        codeBuf = [];
      } else {
        html.push(
          `<pre class="md-pre"><code>${codeBuf.join("\n").replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code></pre>`,
        );
        inCode = false;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      closeList();
      const level = h[1].length;
      html.push(`<h${level} class="md-h${level}">${inlineMarkdown(h[2])}</h${level}>`);
      continue;
    }
    const li = line.match(/^\s*[-*]\s+(.*)$/);
    if (li) {
      if (!listOpen) {
        html.push('<ul class="md-ul">');
        listOpen = true;
      }
      html.push(`<li>${inlineMarkdown(li[1])}</li>`);
      continue;
    }
    if (!line.trim()) {
      closeList();
      continue;
    }
    closeList();
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  }
  if (inCode) {
    html.push(
      `<pre class="md-pre"><code>${codeBuf.join("\n").replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code></pre>`,
    );
  }
  closeList();
  return html.join("\n");
}

function MarkdownTool() {
  const [input, setInput] = useState(
    "# 标题\n\n**粗体** 与 *斜体*，`行内代码`。\n\n- 列表项一\n- 列表项二\n\n```ts\nconst a = 1;\n```\n",
  );
  const html = renderMarkdown(input);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        支持标题、粗斜体、行内代码、列表、链接与代码块（本地渲染，已转义 HTML）。
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-base h-64 font-mono"
          aria-label="Markdown 源码"
        />
        <div
          className="prose-preview h-64 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <style>{`
        .prose-preview .md-h1 { font-size: 1.5rem; font-weight: 700; margin: 0.6rem 0 0.4rem; }
        .prose-preview .md-h2 { font-size: 1.25rem; font-weight: 700; margin: 0.5rem 0 0.35rem; }
        .prose-preview .md-h3 { font-size: 1.1rem; font-weight: 600; margin: 0.4rem 0 0.3rem; }
        .prose-preview .md-ul { list-style: disc; padding-left: 1.25rem; margin: 0.4rem 0; }
        .prose-preview .md-pre { background: #0f172a; color: #e2e8f0; padding: 0.75rem 1rem; border-radius: 0.75rem; overflow: auto; margin: 0.5rem 0; }
        .prose-preview code { font-family: ui-monospace, monospace; background: rgba(148,163,184,.2); padding: 0 .25rem; border-radius: .25rem; }
        .prose-preview .md-pre code { background: transparent; padding: 0; }
        .prose-preview a { color: #0284c7; }
      `}</style>
    </div>
  );
}

function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = () => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      const keywords = [
        "SELECT",
        "FROM",
        "WHERE",
        "LEFT JOIN",
        "RIGHT JOIN",
        "INNER JOIN",
        "JOIN",
        "GROUP BY",
        "ORDER BY",
        "HAVING",
        "LIMIT",
        "OFFSET",
        "INSERT INTO",
        "VALUES",
        "UPDATE",
        "SET",
        "DELETE",
        "UNION ALL",
        "UNION",
        "ON",
        "AND",
        "OR",
        "AS",
        "DISTINCT",
      ];
      let sql = input.replace(/\s+/g, " ").trim();
      keywords.forEach((k) => {
        sql = sql.replace(new RegExp(`\\s+${k}\\s+`, "gi"), `\n${k} `);
        sql = sql.replace(new RegExp(`^${k}\\s+`, "i"), `${k} `);
      });
      sql = sql
        .replace(/\bSELECT\b/gi, "SELECT")
        .replace(/,\s*/g, ",\n  ")
        .replace(
          /\n(SELECT|FROM|WHERE|LEFT JOIN|RIGHT JOIN|INNER JOIN|JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|INSERT INTO|VALUES|UPDATE|SET|DELETE|UNION)/g,
          "\n$1",
        )
        .trim();
      setOutput(sql);
      setError("");
    } catch {
      setError("格式化失败");
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="select id,name from users where age>18 order by name"
        className="input-base h-36 font-mono"
      />
      <button onClick={format} className="btn-primary rounded-xl px-4 py-2">
        格式化
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {output && (
        <div className="relative">
          <pre className="w-full overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {output}
          </pre>
          <CopyButton text={output} />
        </div>
      )}
    </div>
  );
}

function CronTool() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const [error, setError] = useState("");

  const fields = [
    { label: "分", min: 0, max: 59 },
    { label: "时", min: 0, max: 23 },
    { label: "日", min: 0, max: 31 },
    { label: "月", min: 1, max: 12 },
    { label: "周", min: 0, max: 7 },
  ];

  const parts = expr.trim().split(/\s+/);
  const valid = parts.length === 5;

  const describeField = (
    value: string,
    field: { label: string; min: number; max: number },
    index: number,
  ) => {
    if (!valid) return "";
    if (value === "*") return `每${field.label}`;
    const range = value.match(/^(\d+)-(\d+)$/);
    if (range) return `${range[1]}-${range[2]} ${field.label}`;
    if (value.includes("/")) {
      const step = value.split("/")[1];
      return `每 ${step} ${field.label}`;
    }
    const n = Number(value);
    if (!Number.isFinite(n) || n < field.min || n > field.max) {
      setError(`第 ${index + 1} 段「${field.label}」超出 ${field.min}-${field.max}`);
      return "";
    }
    if (index === 4 && n === 0) return "周日";
    if (index === 4 && n === 7) return "周日";
    if (index === 4) return `周${["日", "一", "二", "三", "四", "五", "六"][n]}`;
    if (index === 0) return `${n} 分`;
    if (index === 1) return `${n} 时`;
    if (index === 2) return `${n} 日`;
    if (index === 3) return `${n} 月`;
    return value;
  };

  const summary = (() => {
    if (!valid) {
      setError("");
      return "Cron 需要 5 段：分 时 日 月 周";
    }
    setError("");
    const labels = parts.map((p, i) => describeField(p, fields[i], i));
    return labels.join(" · ");
  })();

  const examples = [
    { expr: "*/5 * * * *", desc: "每 5 分钟" },
    { expr: "0 9 * * 1-5", desc: "工作日 9:00" },
    { expr: "0 0 * * 0", desc: "每周日 0 点" },
    { expr: "30 18 1 * *", desc: "每月 1 日 18:30" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          className="input-base flex-1 font-mono"
          aria-label="Cron 表达式"
        />
      </div>
      <div
        className={`rounded-xl border p-4 text-sm ${
          error
            ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300"
            : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        }`}
      >
        {error || summary}
      </div>
      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex.expr}
            type="button"
            onClick={() => setExpr(ex.expr)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            {ex.expr} · {ex.desc}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2 text-center text-xs text-slate-500">
        {fields.map((f) => (
          <div key={f.label} className="rounded-lg bg-slate-50 py-2 dark:bg-slate-900">
            <div className="font-semibold text-slate-700 dark:text-slate-300">{f.label}</div>
            <div>
              {f.min}-{f.max}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HtmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const voidTags = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ]);

  const format = () => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      const tokens = input
        .replace(/>\s*</g, "><")
        .split(/(?=<)|(?<=>)/g)
        .filter(Boolean);
      let depth = 0;
      const lines: string[] = [];
      for (const raw of tokens) {
        const token = raw.trim();
        if (!token) continue;
        if (token.startsWith("</")) {
          depth = Math.max(0, depth - 1);
          lines.push("  ".repeat(depth) + token);
          continue;
        }
        if (token.startsWith("<")) {
          const tagMatch = token.match(/^<\/?([a-zA-Z][\w-]*)/);
          const isClosingOnly = token.startsWith("</");
          const selfClose = token.endsWith("/>") || (tagMatch && voidTags.has(tagMatch[1].toLowerCase()));
          lines.push("  ".repeat(depth) + token);
          if (!isClosingOnly && !selfClose && tagMatch) depth += 1;
          continue;
        }
        lines.push("  ".repeat(depth) + token);
      }
      setOutput(lines.join("\n"));
      setError("");
    } catch {
      setError("格式化失败");
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="<div><p>hello</p><br></div>"
        className="input-base h-36 font-mono"
      />
      <button onClick={format} className="btn-primary rounded-xl px-4 py-2">
        格式化
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {output && (
        <div className="relative">
          <pre className="w-full overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {output}
          </pre>
          <CopyButton text={output} />
        </div>
      )}
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
    <button
      onClick={copy}
      className="absolute right-2 top-2 rounded-lg bg-white p-1.5 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"
    >
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
  { id: "url", name: "URL 编解码", component: UrlTool },
  { id: "jwt", name: "JWT 解析", component: JwtDecoder },
  { id: "color", name: "颜色转换", component: ColorTool },
  { id: "hash", name: "哈希计算", component: HashTool },
  { id: "markdown", name: "Markdown 预览", component: MarkdownTool },
  { id: "sql", name: "SQL 格式化", component: SqlFormatter },
  { id: "cron", name: "Cron 解析", component: CronTool },
  { id: "html", name: "HTML 格式化", component: HtmlFormatter },
];

export default function ToolsPage() {
  const [active, setActive] = useState("json");
  const ActiveTool = tools.find((t) => t.id === active)?.component || JsonFormatter;

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Tools"
        title="开发者工具"
        description="浏览器端运行，数据不会上传到服务器。"
      />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0 lg:pb-0">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActive(tool.id)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors lg:w-full lg:rounded-xl ${
                active === tool.id
                  ? "bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400"
                  : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 lg:bg-transparent dark:lg:bg-transparent"
              }`}
            >
              {tool.name}
              {active === tool.id && <ChevronRight size={14} className="ml-auto hidden lg:block" />}
            </button>
          ))}
        </nav>

        <div className="card p-6">
          <ActiveTool />
        </div>
      </div>
    </main>
  );
}
