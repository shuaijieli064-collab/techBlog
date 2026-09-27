"use client";

import { useState } from "react";

import CopyButton from "./CopyButton";

export default function TimestampConverter() {
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
        <label className="mb-1 block text-sm text-muted">时间戳 → 日期</label>
        <div className="flex gap-2">
          <input
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="1693000000"
            className="input-base flex-1 font-mono"
          />
          <button onClick={toHuman} className="btn-primary px-4 py-2">
            转换
          </button>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted">日期 → 时间戳</label>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="input-base flex-1"
          />
          <button onClick={toTimestamp} className="btn-primary px-4 py-2">
            转换
          </button>
        </div>
      </div>
      {result && (
        <div className="relative">
          <pre className="w-full code-panel">
            {result}
          </pre>
          <CopyButton text={result} />
        </div>
      )}
    </div>
  );
}
