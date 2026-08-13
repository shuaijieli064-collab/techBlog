"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/notes", label: "学习笔记" },
  { href: "/posts", label: "文章" },
  { href: "/tags", label: "标签" },
  { href: "/archive", label: "归档" },
  { href: "/about", label: "关于" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-cyan-400 font-bold text-white shadow-lg shadow-sky-600/30">
            L
          </span>
          <div>
            <div className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">林晨的博客</div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Tech Journal</div>
          </div>
        </Link>

        <nav aria-label="主导航" className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300"
                    : "text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/posts"
            className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500 md:inline-flex"
          >
            阅读文章
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 md:hidden dark:border-slate-700 dark:text-slate-200"
            aria-label="打开移动端导航"
          >
            ☰
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <nav className="flex flex-col gap-2" aria-label="移动端导航">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-sky-50 hover:text-sky-600 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-sky-400"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/posts"
              onClick={() => setMobileOpen(false)}
              className="mt-1 rounded-xl bg-slate-900 px-3 py-2 text-center text-sm font-medium text-white dark:bg-sky-600"
            >
              阅读文章
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
