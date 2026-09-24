import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { BASE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "林晨的博客 | 技术成长记录",
    template: "%s | 林晨的博客",
  },
  description: "记录软件工程学习、项目实践和成长复盘的个人技术博客与开发者工作台。",
  keywords: ["技术博客", "前端开发", "软件工程", "算法学习", "个人网站", "开发者工作台"],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: "林晨的博客 RSS" }],
    },
  },
  openGraph: {
    title: "林晨的博客",
    description: "记录学生阶段的技术学习与项目成长。",
    type: "website",
    locale: "zh_CN",
    url: BASE_URL,
    siteName: "林晨的博客",
  },
  twitter: {
    card: "summary",
    title: "林晨的博客",
    description: "记录学生阶段的技术学习与项目成长。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_40%),linear-gradient(to_bottom,_#f8fafc,_#f8fafc_40%,_#f1f5f9)] dark:bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.22),_transparent_35%),linear-gradient(to_bottom,_#020617,_#020617_35%,_#0f172a)]">
          <SiteHeader />
          {children}
          <footer className="border-t border-slate-200/80 bg-white/70 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">© 2026 林晨的博客</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  记录代码、学习与成长 · Developer Workspace
                </p>
              </div>
              <nav aria-label="页脚导航" className="flex flex-wrap items-center gap-x-1 gap-y-2">
                {[
                  { href: "/dashboard", label: "工作台" },
                  { href: "/knowledge", label: "知识库" },
                  { href: "/posts", label: "博客" },
                  { href: "/projects", label: "项目" },
                  { href: "/learning", label: "学习" },
                  { href: "/growth", label: "成长" },
                  { href: "/profile", label: "个人主页" },
                  { href: "/ai/models", label: "AI 模型" },
                  { href: "/about", label: "关于" },
                  { href: "/rss.xml", label: "RSS" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full px-2.5 py-1 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-sky-400"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
