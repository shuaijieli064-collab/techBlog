import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
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
  metadataBase: new URL("https://example.com"),
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
    url: "https://example.com",
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
          <footer className="border-t border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-slate-300">
              <p>© 2026 林晨的博客</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link href="/dashboard" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">工作台</Link>
                <Link href="/knowledge" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">知识库</Link>
                <Link href="/posts" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">博客</Link>
                <Link href="/projects" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">项目</Link>
                <Link href="/learning" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">学习</Link>
                <Link href="/growth" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">成长</Link>
                <Link href="/profile" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">个人主页</Link>
                <Link href="/ai/models" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">AI 模型</Link>
                <Link href="/about" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">关于</Link>
                <a href="/rss.xml" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">RSS</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
