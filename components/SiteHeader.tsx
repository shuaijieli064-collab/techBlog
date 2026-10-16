"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Search } from "lucide-react";

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
      { href: "/posts/admin", label: "文章管理" },
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
      { href: "/ai/chat", label: "AI 对话" },
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
      <div className="flex items-center gap-0.5">
        <Link
          href={item.href}
          className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
            active
              ? "bg-wire/10 text-wire"
              : "text-print hover:bg-raise hover:text-foreground"
          }`}
        >
          {item.label}
        </Link>
        <button
          type="button"
          aria-label={`${item.label} 子菜单`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`p-0.5 ${active ? "text-wire" : "text-muted hover:text-print"}`}
        >
          <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open && item.children && (
        <div className="absolute left-0 top-full z-40 min-w-[10.5rem] pt-2">
          <div className="glass rounded-md border border-hair p-1 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.8)]">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 text-[13px] transition-colors ${
                  pathname === child.href
                    ? "bg-wire/10 text-wire"
                    : "text-print hover:bg-raise hover:text-foreground"
                }`}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // 路由变化时收起移动菜单（React 官方推荐的渲染期 state 调整模式）
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="glass sticky top-0 z-30 border-b border-hair">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-md border border-wire/50 text-wire transition-colors group-hover:border-wire group-hover:shadow-[0_0_14px_-6px_var(--glow)]"
          >
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10 1.5v3.2M10 15.3v3.2M1.5 10h3.2M15.3 10h3.2" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="10" cy="10" r="1.4" fill="currentColor" />
            </svg>
          </span>
          <div className="hidden sm:block">
            <div className="font-display text-[15px] font-extrabold leading-none tracking-[0.08em] text-foreground">
              NEXUS
            </div>
            <div className="mt-1 font-mono text-[9.5px] tracking-[0.16em] text-muted">
              DEV WORKSPACE
            </div>
          </div>
        </Link>

        <nav aria-label="主导航" className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          {navItems.map((item) =>
            item.children ? (
              <NavDropdown key={item.href} item={item} pathname={pathname} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  isActive(pathname, item.href)
                    ? "bg-wire/10 text-wire"
                    : "text-print hover:bg-raise hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* 搜索/命令入口：整条可点，直达命令面板（⌘/Ctrl + K） */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("command-palette:toggle"))}
            className="press hidden items-center gap-2 rounded-md border border-hair bg-panel px-3 py-1.5 text-xs text-muted transition-colors hover:border-wire/60 hover:text-print md:flex"
            aria-label="打开命令面板"
            title="命令面板（Ctrl/⌘ + K）"
          >
            <Search size={13} className="shrink-0" />
            <span>搜索页面、工具或执行命令…</span>
            <kbd className="kbd shrink-0">⌘K</kbd>
          </button>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("command-palette:toggle"))}
            className="press flex h-9 w-9 items-center justify-center rounded-md border border-hair bg-panel text-print transition-colors hover:border-wire hover:text-wire md:hidden"
            aria-label="打开命令面板"
            title="命令面板（Ctrl/⌘ + K）"
          >
            <Search size={16} />
          </button>
          <Link href="/posts" className="btn-primary btn-sm press hidden font-semibold sm:inline-flex">
            阅读文章
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-hair bg-panel text-print transition-colors hover:border-wire hover:text-wire lg:hidden"
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
          className="glass border-t border-hair lg:hidden"
        >
          <div className="mx-auto grid max-w-6xl gap-0.5 px-4 py-4 sm:px-6">
            {navItems.map((item, i) => (
              <div
                key={item.href}
                className="fade-up"
                style={{ animationDelay: `${i * 35}ms` }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-r-md border-l-2 px-4 py-2.5 text-sm transition-colors ${
                    isActive(pathname, item.href)
                      ? "border-wire bg-wire/10 font-medium text-wire"
                      : "border-transparent text-print hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 grid gap-0.5 border-l border-hair pl-3">
                    {item.children
                      .filter((c) => c.href !== item.href)
                      .map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="px-3 py-2 text-[13px] text-muted transition-colors hover:text-wire"
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
