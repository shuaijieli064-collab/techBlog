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
      className="card p-5"
    >
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
        <List size={16} className="text-wire" />
        目录
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block rounded-[4px] px-2 py-1.5 text-sm transition-colors ${
                activeId === item.id
                  ? "bg-wire/10 font-medium text-wire"
                  : "text-print hover:bg-background hover:text-wire"
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
