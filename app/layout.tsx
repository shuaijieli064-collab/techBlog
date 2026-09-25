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
      <body className="min-h-full">
        <div className="min-h-screen">
          <SiteHeader />
          {children}
          <footer className="border-t border-hair bg-panel/70 backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-print">© 2026 林晨的博客</span>
                <span className="hidden font-mono text-xs text-muted sm:inline">
                  记录代码、学习与成长
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
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
                      className="rounded-[3px] px-2 py-1 font-mono text-xs text-print transition-colors hover:bg-wire/10 hover:text-wire"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <span className="ml-2 flex items-center gap-1.5 font-mono text-[11px] text-muted">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
                  ONLINE
                </span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
