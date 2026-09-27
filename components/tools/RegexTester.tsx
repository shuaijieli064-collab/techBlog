"use client";

import { useState } from "react";

export default function RegexTester() {
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
          className="input-base w-16! font-mono"
        />
        <button onClick={test} className="btn-primary px-4 py-2">
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
        <div className="code-panel">
          <p className="mb-2 text-sm text-muted">匹配结果 ({matches.length})</p>
          <div className="flex flex-wrap gap-2">
            {matches.map((m, i) => (
              <span
                key={i}
                className="chip text-wire"
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
