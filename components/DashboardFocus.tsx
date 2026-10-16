"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Dashboard deep-link focus: the command palette and WeekPlan link here with
 * ?focus=task|tasks|aiplan|week. Scrolls the matching section into view and
 * focuses its primary control, with a brief highlight ring.
 */

type FocusTarget = { id: string; control?: "input" | "button" };

const TARGETS: Record<string, FocusTarget> = {
  task: { id: "daily-tasks", control: "input" },
  tasks: { id: "task-board" },
  aiplan: { id: "daily-tasks", control: "button" },
  week: { id: "week-overview" },
};

const HIGHLIGHT = ["focus-highlight"];

export function DashboardFocus() {
  const searchParams = useSearchParams();
  const focus = searchParams.get("focus");

  useEffect(() => {
    if (!focus) return;
    const target = TARGETS[focus];
    if (!target) return;

    // Allow Reveal mount animations and workspace hydration to settle first.
    const timer = setTimeout(() => {
      const el = document.getElementById(target.id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      if (target.control) {
        const control = el.querySelector<HTMLElement>(
          target.control === "input" ? "input" : "button",
        );
        control?.focus({ preventScroll: true });
      }
      el.classList.add(...HIGHLIGHT);
      setTimeout(() => el.classList.remove(...HIGHLIGHT), 1800);
    }, 400);

    return () => clearTimeout(timer);
  }, [focus]);

  return null;
}
