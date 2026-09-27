"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import FunctionGrid from "@/components/FunctionGrid";
import { searchFunctions } from "@/lib/functions";

const CATEGORIES = ["集合", "字符串", "数组", "时间", "数学", "排序", "查找", "异常", "多线程"];

export default function FunctionsExplorer() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [query, setQuery] = useState("");

  const activeCategory =
    categoryParam && CATEGORIES.includes(categoryParam)
      ? (categoryParam as string)
      : null;

  const matches = useMemo(() => searchFunctions(query.trim()), [query]);

  const sections = CATEGORIES.filter((c) => !activeCategory || c === activeCategory)
    .map((category) => ({
      category,
      items: matches.filter((f) => f.category === category),
    }))
    .filter((s) => s.items.length > 0);

  const total = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <div>
      <div className="relative mb-4">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <input
          type="text"
          placeholder="搜索函数或标签..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-base w-full pl-11!"
          aria-label="搜索函数"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="清除搜索"
            className="absolute right-2 top-1/2 -translate-y-1/2 border border-hair p-1 text-muted transition-colors hover:border-wire hover:text-wire"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {activeCategory && (
        <div className="mb-8 flex flex-wrap items-center gap-3 border border-wire/40 bg-wire/[0.06] px-4 py-2.5 font-mono text-sm text-wire">
          <span className="tracking-[0.1em] text-xs text-muted">FILTER</span>
          <span>#{activeCategory}</span>
          <span className="text-xs text-muted">{total} 项</span>
          <Link
            href="/functions"
            className="ml-auto text-xs transition-opacity hover:opacity-70"
          >
            [ 清除筛选 ]
          </Link>
        </div>
      )}

      {sections.length === 0 ? (
        <div className="border border-hair bg-panel/60 px-6 py-16 text-center">
          <p className="font-mono text-sm text-muted">
            未找到匹配 “{query}” 的函数
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="btn-secondary mt-5 px-4 py-2"
          >
            清除搜索
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          {sections.map(({ category, items }) => (
            <section key={category}>
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-2xl font-bold text-foreground">
                    {category}
                  </h2>
                  <span className="font-mono text-xs text-muted">
                    {items.length} 项
                  </span>
                </div>
                {!activeCategory && (
                  <Link
                    href={`/functions?category=${encodeURIComponent(category)}`}
                    className="text-sm font-medium text-wire hover:opacity-80"
                  >
                    查看全部
                  </Link>
                )}
              </div>
              <FunctionGrid functions={items} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
