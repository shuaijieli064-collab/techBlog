"use client";

import { useEffect, useState } from "react";

const defaults = [
  { name: "数组", count: 12, mastered: 8 },
  { name: "字符串", count: 8, mastered: 5 },
  { name: "双指针", count: 5, mastered: 3 },
  { name: "滑动窗口", count: 4, mastered: 2 },
  { name: "链表", count: 6, mastered: 3 },
  { name: "栈/队列", count: 5, mastered: 3 },
  { name: "哈希", count: 7, mastered: 4 },
  { name: "二叉树", count: 8, mastered: 4 },
  { name: "DFS/BFS", count: 6, mastered: 3 },
  { name: "回溯", count: 5, mastered: 2 },
  { name: "动态规划", count: 10, mastered: 4 },
  { name: "贪心", count: 4, mastered: 2 },
];

const STORAGE_KEY = "learning:algorithms:v1";

export function AlgorithmProgress() {
  const [items, setItems] = useState(defaults);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as Array<{ name: string; mastered: number }>;
        if (!Array.isArray(parsed)) return;
        setItems((prev) =>
          prev.map((item) => {
            const hit = parsed.find((p) => p.name === item.name);
            return hit ? { ...item, mastered: Math.min(item.count, Math.max(0, hit.mastered)) } : item;
          }),
        );
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const bump = (name: string, delta: number) => {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.name === name
          ? { ...item, mastered: Math.min(item.count, Math.max(0, item.mastered + delta)) }
          : item,
      );
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(next.map(({ name: n, mastered }) => ({ name: n, mastered }))),
        );
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((algo) => {
        const progress = Math.round((algo.mastered / algo.count) * 100);
        return (
          <div
            key={algo.name}
            className="card card-hover p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display font-medium text-foreground">{algo.name}</h3>
              <span className="text-xs text-print">
                {algo.mastered}/{algo.count}
              </span>
            </div>
            <div className="mb-3 h-2 rounded-full bg-hair">
              <div
                className="h-full rounded-full bg-wire transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => bump(algo.name, -1)}
                className="flex-1 border border-hair py-1 text-xs text-print"
                aria-label={`减少 ${algo.name} 已掌握`}
              >
                −
              </button>
              <button
                type="button"
                onClick={() => bump(algo.name, 1)}
                className="flex-1 border border-hair py-1 text-xs text-print hover:border-wire hover:text-wire"
                aria-label={`增加 ${algo.name} 已掌握`}
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
