"use client";

import { useState } from "react";
import { growthEvents, typeLabels, typeColors, type GrowthEventType } from "@/lib/growth";

const filters: Array<"all" | GrowthEventType> = ["all", "milestone", "post", "project", "learning", "achievement"];

export function GrowthTimeline() {
  const [active, setActive] = useState<"all" | GrowthEventType>("all");
  const list = active === "all" ? growthEvents : growthEvents.filter((e) => e.type === active);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              active === f
                ? "border-wire bg-wire text-white"
                : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            {f === "all" ? "全部" : typeLabels[f]}
          </button>
        ))}
      </div>

      <div className="relative ml-3 border-l-2 border-slate-200 pl-8 dark:border-slate-800">
        {list.length === 0 && (
          <p className="text-sm text-slate-500">该类型下暂无事件。</p>
        )}
        {list.map((event) => {
          const colors = typeColors[event.type];
          return (
            <div key={event.id} className="relative mb-8 last:mb-0">
              <span
                className={`absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-2 border-white ${colors.dot} dark:border-slate-950`}
              />
              <article className="card card-hover p-5">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                    {typeLabels[event.type]}
                  </span>
                  <time className="text-xs text-slate-500 dark:text-slate-400" dateTime={event.date}>
                    {event.date}
                  </time>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{event.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{event.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}
