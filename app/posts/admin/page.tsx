import type { Metadata } from "next";

import { BlogManager } from "@/components/blog/BlogManager";
import { PageHeader, BackHome } from "@/components/PageHeader";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = {
  title: "文章管理",
  description: "博客内容管理：新建、编辑、删除自定义文章，导出工作台数据。",
  robots: { index: false, follow: false },
  ...pageMeta("/posts/admin"),
};

// 服务端读取 AI 起草器预填参数（?new=1&title=…&content=…）后传给客户端组件，
// 避免 useSearchParams + 渲染期 setState 干扰 ViewTransition（曾触发
// "Transition was aborted" 控制台报错）。
export default async function BlogAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; title?: string; content?: string }>;
}) {
  const query = await searchParams;
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <PageHeader
        code="BLOG"
        eyebrow="文章管理"
        title="自由增删改你的博客内容"
        action={<BackHome />}
      />
      <div className="mt-8">
        <BlogManager initialQuery={query} />
      </div>
    </main>
  );
}
