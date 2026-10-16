"use client";

import { useEffect, useState } from "react";
import { Keyboard, X } from "lucide-react";

const shortcuts: Array<{ keys: string[]; label: string }> = [
  { keys: ["⌘", "K"], label: "打开命令面板（页面 / 工具 / 动作）" },
  { keys: ["?"], label: "显示 / 隐藏本快捷键帮助" },
  { keys: ["↑", "↓"], label: "在命令面板或搜索结果中移动选择" },
  { keys: ["Enter"], label: "打开当前选中的命令 / 结果" },
  { keys: ["Esc"], label: "关闭弹层 / 清空搜索" },
];

export function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing) return;
      if ((e.key === "?" || (e.shiftKey && e.key === "/")) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="快捷键帮助"
        title="快捷键帮助（?）"
        className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-5 z-40 hidden h-11 w-11 items-center justify-center rounded-full border border-hair bg-panel/90 text-print shadow-lift backdrop-blur-sm transition-colors hover:border-wire hover:text-wire sm:flex"
      >
        <Keyboard size={16} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="快捷键帮助"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="glass w-full max-w-md rounded-xl border border-hair p-6 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.9)]">
            <div className="mb-4 flex items-center justify-between border-b border-hair pb-3">
              <h2 className="section-title">快捷键</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted transition-colors hover:text-wire"
                aria-label="关闭"
              >
                <X size={16} />
              </button>
            </div>
            <ul className="space-y-3">
              {shortcuts.map((s) => (
                <li key={s.label} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-print">{s.label}</span>
                  <span className="flex shrink-0 items-center gap-1">
                    {s.keys.map((k) => (
                      <kbd
                        key={k}
                        className="rounded-xs border border-hair bg-raise px-2 py-1 font-mono text-[11px] text-foreground"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
