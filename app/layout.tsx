import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_SC, Saira } from "next/font/google";
import Link from "next/link";

import { AmbientBackground } from "@/components/AmbientBackground";
import { SiteHeader } from "@/components/SiteHeader";
import { BASE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const saira = Saira({
  variable: "--font-saira",
  subsets: ["latin"],
  display: "swap",
});

const notoSansSc = Noto_Sans_SC({
  variable: "--font-noto-sc",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nox7th 的开发者工作台 | 技术记录",
    template: "%s | Nox7th",
  },
  description: "记录软件工程学习、项目实践和成长复盘的个人技术博客与开发者工作台。",
  keywords: ["技术博客", "前端开发", "软件工程", "算法学习", "个人网站", "开发者工作台"],
  metadataBase: new URL(BASE_URL),
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: `${SITE_NAME} RSS` }],
    },
  },
  openGraph: {
    title: SITE_NAME,
    description: "记录学生阶段的技术学习与项目成长。",
    type: "website",
    locale: "zh_CN",
    siteName: SITE_NAME,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "记录学生阶段的技术学习与项目成长。",
    images: ["/og.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${saira.variable} ${notoSansSc.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: BASE_URL,
              description:
                "记录软件工程学习、项目实践和成长复盘的个人技术博客与开发者工作台。",
              inLanguage: "zh-CN",
            }),
          }}
        />
      </head>
      <body className="min-h-full">
        <AmbientBackground />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-wire focus:bg-panel focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-wire"
        >
          跳到主要内容
        </a>
        <div className="min-h-screen">
          <SiteHeader />
          {children}
          <footer className="border-t border-hair bg-panel/70 backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-print">© 2026 {SITE_NAME}</span>
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
                      className="px-2 py-1 font-mono text-xs text-print transition-colors hover:bg-wire/10 hover:text-wire"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <span
                  aria-hidden
                  className="ml-2 flex items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] text-muted"
                >
                  <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-wire" />
                  ALL SYSTEMS NOMINAL
                </span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
