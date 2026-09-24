"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/dashboard", label: "工作台" },
  { href: "/knowledge", label: "知识库" },
  { href: "/posts", label: "博客" },
  { href: "/projects", label: "项目" },
  { href: "/learning", label: "学习" },
  { href: "/growth", label: "成长" },
  { href: "/tools", label: "工具" },
  { href: "/ai/models", label: "AI 模型" },
  { href: "/ai/prompts", label: "提示词库" },
  { href: "/about", label: "关于" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 font-bold text-white shadow-lg shadow-sky-600/30">
            L
          </span>
          <div className="hidden sm:block">
            <div className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              林晨的博客
            </div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Tech Journal
            </div>
          </div>
        </Link>

        <nav aria-label="主导航" className="hidden items-center gap-4 lg:flex xl:gap-6">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? "text-sky-600 dark:text-sky-400"
                    : "text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/posts"
            className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500 sm:inline-flex"
          >
            阅读文章
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 lg:hidden"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="移动导航"
          className="border-t border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 lg:hidden"
        >
          <div className="mx-auto grid max-w-6xl gap-1 px-4 py-4 sm:px-6">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
