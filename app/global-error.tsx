"use client";

import { useEffect } from "react";
import Link from "next/link";

import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>出错了 - Nexus</title>
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <main id="main-content" tabIndex={-1} className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-16">
          <div className="text-center">
            <p className="page-eyebrow text-alert">Error</p>
            <h1 className="page-title mt-4">应用出现错误</h1>
            <p className="page-desc mx-auto">
              发生了意外错误，可以尝试重新加载页面。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <button type="button" onClick={reset} className="btn-primary">
                重试
              </button>
              <Link href="/" className="btn-secondary">
                返回首页
              </Link>
            </div>
            {error.digest && (
              <p className="mt-6 font-mono text-[11px] text-muted">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
