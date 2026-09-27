import { Suspense } from "react";

import FunctionsExplorer from "@/components/FunctionsExplorer";
import { pageMeta } from "@/lib/site";

export const metadata = {
  title: "函数速查",
  description: "Java、Python 等编程语言的常用函数速查表",
  ...pageMeta("/functions"),
};

export default function FunctionsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 text-center">
          <h1 className="mx-auto mb-4 max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            函数速查
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-print">
            记住那些常用但不常想起的工具函数
          </p>
        </header>

        <Suspense
          fallback={<div className="h-11 border border-hair bg-panel/60" aria-hidden />}
        >
          <FunctionsExplorer />
        </Suspense>
      </div>
    </main>
  );
}
