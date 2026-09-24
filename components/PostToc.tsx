"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

type Item = { id: string; label: string };

export function PostToc({ items }: { items: Item[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] },
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="文章目录"
      className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
        <List size={16} className="text-sky-600" />
        目录
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block rounded-lg px-2 py-1.5 text-sm transition-colors ${
                activeId === item.id
                  ? "bg-sky-50 font-medium text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
                  : "text-slate-600 hover:bg-slate-50 hover:text-sky-600 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-sky-400"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
