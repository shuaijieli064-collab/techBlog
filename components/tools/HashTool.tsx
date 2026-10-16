"use client";

import { useState } from "react";

import CopyButton from "./CopyButton";

async function digestHex(algorithm: string, message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const buf = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function HashTool() {
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
      <button onClick={run} className="btn-primary">
        计算哈希
      </button>
      {error && <p className="text-sm text-alert">{error}</p>}
      <div className="space-y-2">
        {Object.entries(results).map(([label, value]) => (
          <div key={label} className="relative">
            <div className="flex items-center justify-between rounded-md border border-hair bg-background px-3 py-2">
              <span className="label-mono">{label}</span>
              <code className="ml-2 flex-1 truncate font-mono text-xs text-foreground">
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
