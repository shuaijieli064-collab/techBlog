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
                ? "border-wire bg-wire text-[#04131b]"
                : "border-hair bg-panel text-print"
            }`}
          >
            {f === "all" ? "全部" : typeLabels[f]}
          </button>
        ))}
      </div>

      <div className="relative ml-3 border-l-2 border-hair pl-8">
        {list.length === 0 && (
          <p className="text-sm text-print">该类型下暂无事件。</p>
        )}
        {list.map((event) => {
          const colors = typeColors[event.type];
          return (
            <div key={event.id} className="relative mb-8 last:mb-0">
              <span
                className={`absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-2 border-background ${colors.dot}`}
              />
              <article className="card card-hover p-5">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span className={` px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                    {typeLabels[event.type]}
                  </span>
                  <time className="text-xs text-print" dateTime={event.date}>
                    {event.date}
                  </time>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{event.title}</h3>
                <p className="mt-1 text-sm leading-6 text-print">{event.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-raise px-2 py-0.5 text-[11px] text-print"
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
