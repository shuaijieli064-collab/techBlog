"use client";

import type { FunctionCard } from "@/lib/functions";
import { getFunctionsByCategory, functionLibrary } from "@/lib/functions";
import CodeBlock from "@/components/CodeBlock";
import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";

export default function FunctionGrid({ category }: { category: string }) {
  const isFiltered = true;
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {isFiltered ? (
        <AllFunctions category={category} />
      ) : (
        <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
          暂无函数
        </div>
      )}
    </div>
  );
}

function AllFunctions({ category }: { category: string }) {
  const allFunctions = category
    ? getFunctionsByCategory(category)
    : functionLibrary;

  if (allFunctions.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
        {category ? `${category} 暂无函数` : "暂无函数"}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {allFunctions.map((func) => (
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
    <article className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
      <button
        onClick={copyCode}
        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        aria-label="复制代码"
      >
        {copied ? <CopyCheck size={16} /> : <Copy size={16} />}
      </button>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900 dark:text-sky-300">
          {func.language}
        </span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          {func.category}
        </span>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
        {func.name}
      </h3>

      <code className="mb-4 inline-block rounded-lg bg-slate-100 px-2 py-1 text-xs font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300">
        {func.signature}
      </code>

      <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {func.description}
      </p>

      {func.note && (
        <div className="mb-4 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
          💡 {func.note}
        </div>
      )}

      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-slate-500">示例</span>
          <div className="flex gap-1.5">
            {func.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs text-slate-400">
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
