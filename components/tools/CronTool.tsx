"use client";

import { useState } from "react";

export default function CronTool() {
  const [expr, setExpr] = useState("0 9 * * 1-5");

  const fields = [
    { label: "分", min: 0, max: 59 },
    { label: "时", min: 0, max: 23 },
    { label: "日", min: 0, max: 31 },
    { label: "月", min: 1, max: 12 },
    { label: "周", min: 0, max: 7 },
  ];

  const parts = expr.trim().split(/\s+/);
  const valid = parts.length === 5;
  let error = "";

  const describeField = (
    value: string,
    field: { label: string; min: number; max: number },
    index: number,
  ) => {
    if (!valid) return "";
    if (value === "*") return `每${field.label}`;
    const range = value.match(/^(\d+)-(\d+)$/);
    if (range) return `${range[1]}-${range[2]} ${field.label}`;
    if (value.includes("/")) {
      const step = value.split("/")[1];
      return `每 ${step} ${field.label}`;
    }
    const n = Number(value);
    if (!Number.isFinite(n) || n < field.min || n > field.max) {
      error = `第 ${index + 1} 段「${field.label}」超出 ${field.min}-${field.max}`;
      return "";
    }
    if (index === 4 && n === 0) return "周日";
    if (index === 4 && n === 7) return "周日";
    if (index === 4) return `周${["日", "一", "二", "三", "四", "五", "六"][n]}`;
    if (index === 0) return `${n} 分`;
    if (index === 1) return `${n} 时`;
    if (index === 2) return `${n} 日`;
    if (index === 3) return `${n} 月`;
    return value;
  };

  const summary = (() => {
    if (!valid) return "Cron 需要 5 段：分 时 日 月 周";
    const labels = parts.map((p, i) => describeField(p, fields[i], i));
    return labels.join(" · ");
  })();

  const examples = [
    { expr: "*/5 * * * *", desc: "每 5 分钟" },
    { expr: "0 9 * * 1-5", desc: "工作日 9:00" },
    { expr: "0 0 * * 0", desc: "每周日 0 点" },
    { expr: "30 18 1 * *", desc: "每月 1 日 18:30" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          className="input-base flex-1 font-mono"
          aria-label="Cron 表达式"
        />
      </div>
      <div
        className={`border p-4 font-mono text-sm ${
          error
            ? "border-signal bg-signal/10 text-signal"
            : "border-hair bg-background text-print"
        }`}
      >
        {error || summary}
      </div>
      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex.expr}
            type="button"
            onClick={() => setExpr(ex.expr)}
            className="border border-hair px-3 py-1.5 font-mono text-xs text-print transition-colors hover:border-wire hover:text-wire"
          >
            {ex.expr} · {ex.desc}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2 text-center label-mono">
        {fields.map((f) => (
          <div key={f.label} className="bg-background py-2">
            <div className="font-semibold text-foreground">{f.label}</div>
            <div>
              {f.min}-{f.max}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
