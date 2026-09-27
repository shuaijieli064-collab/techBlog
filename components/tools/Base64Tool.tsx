"use client";

import { useState } from "react";

import CopyButton from "./CopyButton";

export default function Base64Tool() {
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
        placeholder="输入内容..."
        className="input-base h-32 font-mono"
      />
      <button onClick={convert} className="btn-primary px-4 py-2">
        转换
      </button>
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
