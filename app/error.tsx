"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">Error</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 dark:text-slate-50">出了点问题</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          页面渲染失败，可以尝试重新加载。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="btn-primary px-5 py-3"
          >
            重试
          </button>
          <Link
            href="/"
            className="btn-secondary px-5 py-3"
          >
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}
