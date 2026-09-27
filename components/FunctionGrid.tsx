"use client";

import type { FunctionCard } from "@/lib/functions";
import CodeBlock from "@/components/CodeBlock";
import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";

export default function FunctionGrid({ functions }: { functions: FunctionCard[] }) {
  if (functions.length === 0) {
    return (
      <div className="py-12 text-center text-muted">暂无函数</div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {functions.map((func) => (
        <FunctionCardItem key={func.id} func={func} />
      ))}
    </div>
  );
}

function FunctionCardItem({ func }: { func: FunctionCard }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(func.example);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="group relative card card-hover p-6">
      <button
        onClick={copyCode}
        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center bg-panel text-print transition-colors hover:bg-raise hover:text-foreground"
        aria-label="复制代码"
      >
        {copied ? <CopyCheck size={16} /> : <Copy size={16} />}
      </button>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-wire/10 px-2.5 py-1 text-xs font-medium text-wire">
          {func.language}
        </span>
        <span className="rounded-full border border-hair bg-raise px-2.5 py-1 text-xs font-medium text-print">
          {func.category}
        </span>
      </div>

      <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
        {func.name}
      </h3>

      <code className="mb-4 inline-block bg-raise px-2 py-1 text-xs font-mono text-foreground">
        {func.signature}
      </code>

      <p className="mb-4 text-sm leading-6 text-print">
        {func.description}
      </p>

      {func.note && (
        <div className="mb-4 border border-signal/30 bg-signal/10 px-3 py-2 text-xs text-signal">
          💡 {func.note}
        </div>
      )}

      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-print">示例</span>
          <div className="flex gap-1.5">
            {func.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs text-muted">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <CodeBlock code={func.example} language="java" />
      </div>
    </article>
  );
}
