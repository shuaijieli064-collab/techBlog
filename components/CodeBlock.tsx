"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CodeBlock({
  code,
  language
}: {
  code: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-4 py-2">
        <span className="text-xs font-medium text-slate-300">{language}</span>
        <button
          onClick={handleCopy}
          className="ml-auto flex h-7 w-7 items-center justify-center rounded hover:bg-slate-700 transition-colors"
          aria-label="复制代码"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-slate-300" />}
        </button>
      </div>
      <pre className="p-4 font-mono text-xs sm:text-sm leading-6">
        <code className="text-slate-300">{code}</code>
      </pre>
    </div>
  );
}
