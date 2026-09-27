"use client";

import { useEffect, useState } from "react";

const POOL = "アイウエオカキクケコサシスセソ0123456789ABCDEF#%&<>/\\{}*+=";

export function ScrambleText({
  text,
  className,
  duration = 850,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let done = false;
    const start = performance.now();
    const id = window.setInterval(() => {
      if (done) return;
      const t = Math.min(1, (performance.now() - start) / duration);
      const revealed = Math.floor(t * (text.length + 3));
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < revealed || ch === "\n" || "、，。：· ".includes(ch)) out += ch;
        else out += POOL[(Math.random() * POOL.length) | 0];
      }
      setDisplay(out);
      if (t >= 1) {
        done = true;
        setDisplay(text);
        window.clearInterval(id);
      }
    }, 42);
    return () => {
      done = true;
      window.clearInterval(id);
    };
  }, [text, duration]);

  return <span className={className}>{display}</span>;
}
