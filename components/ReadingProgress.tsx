"use client";

import { useEffect, useState } from "react";

/** 顶部阅读进度条：根据文章主体在视口中的滚动比例填充。 */
export function ReadingProgress({ targetId = "main-content" }: { targetId?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById(targetId);
      if (!el) return;
      const start = el.offsetTop;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = window.scrollY - start;
      const ratio = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
      setProgress(ratio);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-40 h-0.5 bg-transparent"
    >
      <div
        className="h-full bg-wire transition-[width] duration-100"
        style={{ width: `${progress * 100}%`, boxShadow: "0 0 10px -2px var(--glow)" }}
      />
    </div>
  );
}
