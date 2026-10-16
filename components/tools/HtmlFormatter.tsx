"use client";

import { useState } from "react";

import CopyButton from "./CopyButton";

export default function HtmlFormatter() {
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
      <button onClick={format} className="btn-primary">
        格式化
      </button>
      {error && <p className="text-sm text-alert">{error}</p>}
      {output && (
        <div className="relative">
          <pre className="w-full overflow-auto whitespace-pre-wrap code-panel">
            {output}
          </pre>
          <CopyButton text={output} />
        </div>
      )}
    </div>
  );
}
