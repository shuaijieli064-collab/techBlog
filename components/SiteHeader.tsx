"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

type NavChild = { href: string; label: string };
type NavItem = { href: string; label: string; children?: NavChild[] };

const navItems: NavItem[] = [
  { href: "/", label: "首页" },
  { href: "/dashboard", label: "工作台" },
  { href: "/knowledge", label: "知识库" },
  {
    href: "/posts",
    label: "博客",
    children: [
      { href: "/posts", label: "文章列表" },
      { href: "/notes", label: "笔记地图" },
      { href: "/archive", label: "归档" },
    ],
  },
  { href: "/projects", label: "项目" },
  { href: "/learning", label: "学习" },
  { href: "/growth", label: "成长" },
  { href: "/tools", label: "工具" },
  {
    href: "/ai",
    label: "AI 中心",
    children: [
      { href: "/ai", label: "总览" },
      { href: "/ai/models", label: "模型" },
      { href: "/ai/agents", label: "Agents" },
      { href: "/ai/prompts", label: "提示词库" },
    ],
  },
  { href: "/about", label: "关于" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function NavDropdown({
  item,
  pathname,
  className = "",
}: {
  item: NavItem;
  pathname: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = isActive(pathname, item.href);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`} onPointerEnter={() => setOpen(true)} onPointerLeave={() => setOpen(false)}>
      <div className="flex items-center gap-1">
        <Link
          href={item.href}
          className={`rounded-full px-2.5 py-1 text-sm font-medium transition-colors ${
            active
              ? "bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400"
              : "text-slate-600 hover:bg-slate-50 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-sky-400"
          }`}
        >
          {item.label}
        </Link>
        <button
          type="button"
          aria-label={`${item.label} 子菜单`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`rounded p-0.5 ${
            active ? "text-sky-600 dark:text-sky-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
        >
          <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open && item.children && (
        <div className="absolute left-0 top-full z-40 mt-2 min-w-[10.5rem] rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xl shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => setOpen(false)}
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                pathname === child.href
                  ? "bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

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
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 font-bold text-white shadow-md shadow-sky-600/25">
            L
          </span>
          <div className="hidden sm:block">
            <div className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              林晨的博客
            </div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Tech Journal
            </div>
          </div>
        </Link>

        <nav aria-label="主导航" className="hidden items-center gap-4 lg:flex xl:gap-6">
          {navItems.map((item) =>
            item.children ? (
              <NavDropdown key={item.href} item={item} pathname={pathname} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-2.5 py-1 text-sm font-medium transition-colors ${
                  isActive(pathname, item.href)
                    ? "bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400"
                    : "text-slate-600 hover:bg-slate-50 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-sky-400"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/posts"
            className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600 sm:inline-flex dark:bg-sky-600 dark:hover:bg-sky-500"
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
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive(pathname, item.href)
                      ? "bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 grid gap-0.5 border-l border-slate-200 pl-3 dark:border-slate-700">
                    {item.children
                      .filter((c) => c.href !== item.href)
                      .map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400"
                        >
                          {child.label}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
