import Link from "next/link";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/notes", label: "学习笔记" },
  { href: "/posts", label: "文章" },
  { href: "/archive", label: "归档" },
  { href: "/about", label: "关于" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 font-bold text-white shadow-lg shadow-sky-600/30">
            L
          </span>
          <div>
            <div className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              林晨的博客
            </div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Tech Journal
            </div>
          </div>
        </Link>

        <nav aria-label="主导航" className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/posts"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500"
        >
          阅读文章
        </Link>
      </div>
    </header>
  );
}
