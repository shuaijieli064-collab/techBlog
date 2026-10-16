"use client";

import { useEffect, useState } from "react";

function greetingFor(hour: number): string {
  if (hour < 5) return "夜深了";
  if (hour < 9) return "早上好";
  if (hour < 12) return "上午好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  if (hour < 23) return "晚上好";
  return "夜深了";
}

/**
 * Time-aware greeting. Client-computed so it stays correct across timezones
 * and long-lived tabs without forcing the page to be dynamic.
 */
export function Greeting() {
  const [text, setText] = useState("你好");

  useEffect(() => {
    const update = () => setText(greetingFor(new Date().getHours()));
    update();
    // re-evaluate every minute so an open tab never shows a stale greeting
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="gradient-text">
      {text}，Developer
    </span>
  );
}
