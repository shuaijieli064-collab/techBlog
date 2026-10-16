"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Download, Eye, FileText, Inbox } from "lucide-react";

import { Markdown } from "@/components/Markdown";
import { posts } from "@/lib/posts";
import { userPostsFrom, type UserPost } from "@/lib/posts";
import { useWorkspace } from "@/lib/workspace/client";
import type { Json } from "@/lib/workspace/types";

function slugify(title: string): string {
  const base =
    title
      .trim()
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "") || "post";
  return `${base}-${Date.now().toString(36).slice(-5)}`;
}

function estimateReadTime(content: string): string {
  const minutes = Math.max(1, Math.round(content.replace(/\s/g, "").length / 400));
  return `${minutes} 分钟`;
}

type Draft = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string;
  date: string;
  status: "draft" | "published";
  author: string;
  content: string;
};

const emptyDraft = (): Draft => ({
  slug: "",
  title: "",
  excerpt: "",
  category: "未分类",
  tags: "",
  date: new Date().toISOString().slice(0, 10),
  status: "published",
  author: "",
  content: "",
});

export function BlogManager({
  initialQuery,
}: {
  initialQuery?: { new?: string; title?: string; content?: string };
}) {
  const [raw, save, ready] = useWorkspace<Json[]>("blog-posts", []);
  const userPosts = useMemo(() => userPostsFrom(raw), [raw]);

  // AI 起草器跳转预填：?new=1&title=…&content=…。由服务端 searchParams 传入，
  // 直接在 useState 初始值中展开（无渲染期 setState，避免干扰 ViewTransition）。
  const [initialDraft] = useState<Draft | null>(() => {
    if (initialQuery?.new !== "1") return null;
    const title = initialQuery.title ?? "";
    const content = initialQuery.content ?? "";
    if (!title && !content) return null;
    const d = emptyDraft();
    d.title = title;
    d.content = content;
    d.author = "Nox7th";
    return d;
  });

  const [editing, setEditing] = useState<Draft | null>(initialDraft);
  const [isNew, setIsNew] = useState(initialDraft !== null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const startCreate = () => {
    const d = emptyDraft();
    d.author = "Nox7th";
    setEditing(d);
    setIsNew(true);
    setError(null);
    setNotice(null);
  };

  const startEdit = (p: UserPost) => {
    setEditing({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      tags: p.tags.join(", "),
      date: p.date,
      status: p.status ?? "published",
      author: p.author,
      content: p.content,
    });
    setIsNew(false);
    setError(null);
    setNotice(null);
  };

  const saveDraft = () => {
    if (!editing) return;
    const title = editing.title.trim();
    const content = editing.content.trim();
    if (!title) {
      setError("标题不能为空");
      return;
    }
    if (!content) {
      setError("正文不能为空");
      return;
    }
    const slug = editing.slug.trim() || slugify(title);
    if (!/^[a-z0-9\u4e00-\u9fa5-]+$/i.test(slug)) {
      setError("slug 只能包含字母、数字、中文与连字符");
      return;
    }
    if (userPosts.some((p) => p.slug === slug && (isNew || p.slug !== editing.slug))) {
      setError(`slug「${slug}」已存在，请换一个`);
      return;
    }
    const next: UserPost = {
      slug,
      title,
      excerpt: editing.excerpt.trim(),
      category: editing.category.trim() || "未分类",
      tags: editing.tags
        .split(/[,，]/)
        .map((t) => t.trim())
        .filter(Boolean),
      date: editing.date,
      status: editing.status,
      author: editing.author.trim() || "访客",
      content,
      readTime: estimateReadTime(content),
    };
    const list = isNew
      ? [...userPosts, next]
      : userPosts.map((p) => (p.slug === editing.slug ? next : p));
    try {
      save(list as unknown as Json[]);
      setNotice(
        isNew
          ? next.status === "draft"
            ? `已保存草稿「${title}」`
            : `已发布文章「${title}」`
          : `已更新文章「${title}」`,
      );
      setEditing(null);
      setIsNew(false);
    } catch {
      setError("保存失败（数据可能超过容量上限）");
    }
  };

  const removePost = (p: UserPost) => {
    if (!window.confirm(`确定删除「${p.title}」？此操作不可撤销。`)) return;
    save(userPosts.filter((x) => x.slug !== p.slug) as unknown as Json[]);
    setNotice(`已删除「${p.title}」`);
  };

  const exportAll = async () => {
    try {
      const res = await fetch("/api/workspace/export", { cache: "no-store" });
      if (!res.ok) throw new Error(`export failed ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `workspace-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setNotice("已导出全部工作台数据（JSON）");
    } catch {
      setError("导出失败，请稍后重试");
    }
  };

  const clearAll = () => {
    if (userPosts.length === 0) return;
    if (!window.confirm(`确定清空全部 ${userPosts.length} 篇自定义文章？内置示例不受影响。`)) return;
    save([]);
    setNotice("已清空全部自定义文章");
  };

  if (editing) {
    return (
      <div className="card p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">
            {isNew ? "新建文章" : "编辑文章"}
          </h2>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setIsNew(false);
              setError(null);
            }}
            className="font-mono text-xs text-muted transition-colors hover:text-wire"
          >
            ← 返回列表
          </button>
        </div>

        {error && (
          <div className="mb-5 border border-alert/40 bg-alert/10 px-4 py-3 text-sm text-alert">
            {error}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs tracking-[0.14em] text-muted">标题 *</span>
              <input
                className="input-base w-full"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="文章标题"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs tracking-[0.14em] text-muted">Slug（留空自动生成）</span>
              <input
                className="input-base w-full"
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                placeholder="my-first-post"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block font-mono text-xs tracking-[0.14em] text-muted">分类</span>
                <input
                  className="input-base w-full"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  placeholder="前端开发"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-xs tracking-[0.14em] text-muted">标签（逗号分隔）</span>
                <input
                  className="input-base w-full"
                  value={editing.tags}
                  onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
                  placeholder="Next.js, React"
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block font-mono text-xs tracking-[0.14em] text-muted">日期</span>
                <input
                  type="date"
                  className="input-base w-full"
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-xs tracking-[0.14em] text-muted">作者</span>
                <input
                  className="input-base w-full"
                  value={editing.author}
                  onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                  placeholder="Nox7th"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs tracking-[0.14em] text-muted">摘要</span>
              <textarea
                className="input-base w-full resize-none"
                rows={3}
                value={editing.excerpt}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                placeholder="列表页展示的一句话摘要"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-xs tracking-[0.14em] text-muted">正文（Markdown）*</span>
              <textarea
                className="input-base w-full resize-y font-mono text-[13px] leading-6"
                rows={14}
                value={editing.content}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                placeholder={"## 小节标题\n\n正文段落，支持 ```代码块```、列表、引用等 Markdown 语法"}
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-print">
                <input
                  type="checkbox"
                  checked={editing.status === "published"}
                  onChange={(e) =>
                    setEditing({ ...editing, status: e.target.checked ? "published" : "draft" })
                  }
                  className="h-4 w-4 accent-[#5ce1ff]"
                />
                发布（未勾选则为草稿）
              </label>
              <button type="button" onClick={saveDraft} className="btn-primary">
                保存文章
              </button>
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-muted">
              <Eye size={13} /> 实时预览
            </div>
            <div className="max-h-[560px] overflow-y-auto rounded-lg border border-hair bg-background p-5">
              <Markdown content={editing.content || "（正文为空，输入 Markdown 后在此预览）"} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {notice && (
        <div className="rounded-md border border-wire/40 bg-wire/10 px-4 py-3 text-sm text-wire">{notice}</div>
      )}
      {error && (
        <div className="border border-alert/40 bg-alert/10 px-4 py-3 text-sm text-alert">{error}</div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-print">
          共 {userPosts.length} 篇自定义文章 · 存储 {ready ? "已同步" : "同步中"}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportAll}
            className="flex items-center gap-2 rounded-md border border-hair bg-panel px-4 py-2 text-sm text-print transition-colors hover:border-wire hover:text-wire"
          >
            <Download size={14} /> 导出全部数据
          </button>
          {userPosts.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-2 border border-alert/40 bg-alert/10 px-4 py-2 text-sm text-alert transition-colors hover:border-alert"
            >
              清空自定义文章
            </button>
          )}
          <button
            type="button"
            onClick={startCreate}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={14} /> 新建文章
          </button>
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-muted">
          <FileText size={13} /> 我的文章
        </div>
        {userPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-hair bg-panel/50 py-14 text-center">
            <Inbox size={22} className="mb-3 text-muted" />
            <p className="text-sm text-print">还没有自定义文章</p>
            <p className="mt-1 text-xs text-muted">点击右上角「新建文章」，或先用 AI 起草器生成草稿再保存</p>
          </div>
        ) : (
          <ul className="divide-y divide-hair">
            {userPosts.map((p) => (
              <li key={p.slug} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">{p.title}</span>
                    {p.status === "draft" && (
                      <span className="bg-signal/10 px-2 py-0.5 text-xs text-signal">草稿</span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted">
                    <span>{p.date}</span>
                    <span>{p.category}</span>
                    <span className="font-mono">/{p.slug}</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <a
                    href={`/posts/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-hair px-3 py-1.5 text-xs text-print transition-colors hover:border-wire hover:text-wire"
                  >
                    查看
                  </a>
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="flex items-center gap-1.5 rounded-full border border-hair px-3 py-1.5 text-xs text-print transition-colors hover:border-wire hover:text-wire"
                  >
                    <Pencil size={12} /> 编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => removePost(p)}
                    className="flex items-center gap-1.5 rounded-full border border-hair px-3 py-1.5 text-xs text-alert transition-colors hover:border-alert hover:bg-alert/10"
                  >
                    <Trash2 size={12} /> 删除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-muted">
          <FileText size={13} /> 内置示例（只读，可作写作参考）
        </div>
        <ul className="divide-y divide-hair">
          {posts.map((p) => (
            <li key={p.slug} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
              <div className="min-w-0">
                <span className="font-medium text-print">{p.title}</span>
                <span className="ml-2 rounded-full border border-hair px-2 py-0.5 text-xs text-muted">
                  示例
                </span>
              </div>
              <a
                href={`/posts/${p.slug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-hair px-3 py-1.5 text-xs text-print transition-colors hover:border-wire hover:text-wire"
              >
                查看
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
