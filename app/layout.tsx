import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { siteConfig } from "@/lib/site";
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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | 林晨的博客",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${siteConfig.url}/feed.xml`,
    },
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    locale: "zh_CN",
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_40%),linear-gradient(to_bottom,_#f8fafc,_#f8fafc_40%,_#f1f5f9)] dark:bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.22),_transparent_35%),linear-gradient(to_bottom,_#020617,_#020617_35%,_#0f172a)]">
          <SiteHeader />
          {children}
          <footer className="border-t border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 dark:text-slate-300">
              <p>© 2026 林晨的博客</p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/notes" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">
                  学习笔记
                </Link>
                <Link href="/posts" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">
                  文章
                </Link>
                <Link href="/archive" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">
                  归档
                </Link>
                <Link href="/tags" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">
                  标签
                </Link>
                <Link href="/about" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">
                  关于
                </Link>
                <Link href="/feed.xml" className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">
                  RSS
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
