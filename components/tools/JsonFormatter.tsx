"use client";

import { useState } from "react";

export default function JsonFormatter() {
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
      <button onClick={format} className="btn-primary px-4 py-2">
        格式化
      </button>
      {error && <p className="text-sm text-alert">{error}</p>}
      {output && (
        <pre className="w-full overflow-auto code-panel">
          {output}
        </pre>
      )}
    </div>
  );
}
