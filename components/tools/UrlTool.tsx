"use client";

import { useState } from "react";

import CopyButton from "./CopyButton";

export default function UrlTool() {
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
          className={`px-3 py-1.5 font-mono text-sm ${
            mode === "encode"
              ? "border border-wire bg-wire text-[#04131b]"
              : "border border-hair text-print hover:border-wire hover:text-wire"
          }`}
        >
          编码
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`px-3 py-1.5 font-mono text-sm ${
            mode === "decode"
              ? "border border-wire bg-wire text-[#04131b]"
              : "border border-hair text-print hover:border-wire hover:text-wire"
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
          <pre className="w-full overflow-auto code-panel">
            {output}
          </pre>
          <CopyButton text={output} />
        </div>
      )}
    </div>
  );
}
