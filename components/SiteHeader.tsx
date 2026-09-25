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
      <div className="flex items-center gap-0.5">
        <Link
          href={item.href}
          className={`rounded-[3px] px-2 py-1 font-mono text-[13px] transition-colors ${
            active
              ? "bg-wire/10 text-wire"
              : "text-print hover:bg-wire/10 hover:text-wire"
          }`}
        >
          {active ? `[${item.label}]` : item.label}
        </Link>
        <button
          type="button"
          aria-label={`${item.label} 子菜单`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`rounded p-0.5 ${
            active ? "text-wire" : "text-muted hover:text-print"
          }`}
        >
          <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open && item.children && (
        <div className="absolute left-0 top-full z-40 mt-2 min-w-[10.5rem] rounded-[4px] border border-hair bg-panel p-1">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => setOpen(false)}
              className={`block rounded-[3px] px-3 py-2 font-mono text-[13px] transition-colors ${
                pathname === child.href
                  ? "bg-wire/10 text-wire"
                  : "text-print hover:bg-wire/10 hover:text-wire"
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
    <header className="sticky top-0 z-30 border-b border-hair bg-panel/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-hair bg-wire font-mono text-sm font-bold text-white">
            L
          </span>
          <div className="hidden sm:block">
            <div className="text-[15px] font-bold tracking-tight text-foreground">
              林晨的博客
            </div>
            <div className="font-mono text-[10px] tracking-[0.08em] text-muted">
              ~/dev-workspace
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
                className={`rounded-[3px] px-2 py-1 font-mono text-[13px] transition-colors ${
                  isActive(pathname, item.href)
                    ? "bg-wire/10 text-wire"
                    : "text-print hover:bg-wire/10 hover:text-wire"
                }`}
              >
                {isActive(pathname, item.href) ? `[${item.label}]` : item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/posts"
            className="hidden rounded-[4px] bg-wire px-4 py-2 font-mono text-[13px] font-semibold text-white transition-[filter] hover:brightness-110 sm:inline-flex"
          >
            阅读文章
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-hair bg-panel text-print transition-colors hover:border-wire hover:text-wire lg:hidden"
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
          className="border-t border-hair bg-panel/95 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto grid max-w-6xl gap-1 px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-[3px] px-4 py-2.5 font-mono text-sm transition-colors ${
                    isActive(pathname, item.href)
                      ? "bg-wire/10 text-wire"
                      : "text-print hover:bg-wire/10 hover:text-wire"
                  }`}
                >
                  {isActive(pathname, item.href) ? `[${item.label}]` : item.label}
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
                          className="rounded-[3px] px-3 py-2 font-mono text-[13px] text-muted hover:text-wire"
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
