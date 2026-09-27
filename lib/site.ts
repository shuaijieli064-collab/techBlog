const raw = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;

export const BASE_URL = (raw || "https://example.com").replace(/\/$/, "");

export const SITE_NAME = "Nox7th 的开发者工作台";

/**
 * Per-page SEO fields: self-referencing canonical + complete OpenGraph.
 * Must be spread into each page's metadata because a child `openGraph`
 * fully replaces the layout's `openGraph` (no deep merge).
 */
export function pageMeta(path: string) {
  return {
    alternates: {
      canonical: path,
      types: {
        "application/rss+xml": [{ url: "/rss.xml", title: `${SITE_NAME} RSS` }],
      },
    },
    openGraph: {
      type: "website" as const,
      locale: "zh_CN",
      siteName: SITE_NAME,
      url: path,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_NAME }],
    },
  };
}
