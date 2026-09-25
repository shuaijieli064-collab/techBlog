"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "切换到浅色模式" : "切换到深色模式"}
      className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-hair bg-panel text-print transition-colors hover:border-wire hover:text-wire"
    >
      <Sun size={16} className={dark ? "hidden" : "block"} />
      <Moon size={16} className={dark ? "block" : "hidden"} />
    </button>
  );
}
