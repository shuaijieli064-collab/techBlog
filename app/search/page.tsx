import type { Metadata } from "next";
import { Suspense } from "react";

import { buildSearchIndex } from "@/lib/search";
import { userPostsFrom } from "@/lib/posts";
import { readDomain } from "@/lib/server/db";
import { SearchView } from "@/components/SearchView";

export const metadata: Metadata = {
  title: "搜索 · NEXUS 工作台",
  description: "跨文章、笔记与函数速查的全文检索。",
};

export const dynamic = "force-dynamic";

export default function SearchPage() {
  const userPosts = userPostsFrom(readDomain("blog-posts"));
  const index = buildSearchIndex(userPosts);
  return (
    <Suspense fallback={null}>
      <SearchView index={index} />
    </Suspense>
  );
}
