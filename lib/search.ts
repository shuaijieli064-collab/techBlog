import {
  getPublishedPosts,
  postToMarkdown,
  type AnyPost,
  type UserPost,
} from "@/lib/posts";
import { notes } from "@/lib/notes";
import { functionLibrary, type FunctionCard } from "@/lib/functions";

export type SearchKind = "post" | "note" | "function";

export type SearchItem = {
  kind: SearchKind;
  title: string;
  excerpt: string;
  href: string;
  tags: string[];
  meta: string;
  text: string;
};

/** 服务端构建统一搜索索引（文章 + 笔记 + 函数速查）。 */
export function buildSearchIndex(userPosts: UserPost[]): SearchItem[] {
  const published = getPublishedPosts(userPosts);

  const postItems: SearchItem[] = published.map((p: AnyPost) => ({
    kind: "post",
    title: p.title,
    excerpt: p.excerpt,
    href: `/posts/${p.slug}`,
    tags: p.tags,
    meta: `${p.category} · ${p.date}`,
    text: [p.title, p.excerpt, p.category, ...p.tags, postToMarkdown(p)].join("\n"),
  }));

  const noteItems: SearchItem[] = notes.map((n) => ({
    kind: "note",
    title: n.title,
    excerpt: n.summary,
    href: `/notes/${n.slug}`,
    tags: n.tags,
    meta: n.group,
    text: [n.title, n.summary, n.group, ...n.tags, n.content].join("\n"),
  }));

  const functionItems: SearchItem[] = functionLibrary.map((f: FunctionCard) => ({
    kind: "function",
    title: f.name,
    excerpt: f.description,
    href: `/tools?q=${encodeURIComponent(f.name)}`,
    tags: f.tags,
    meta: `${f.language} · ${f.category}`,
    text: [f.name, f.signature, f.description, f.example, ...f.tags, f.language, f.category].join(
      "\n",
    ),
  }));

  return [...postItems, ...noteItems, ...functionItems];
}

/** 纯函数：在已构建的索引中按关键词过滤（客户端实时调用）。 */
export function searchIndex(items: SearchItem[], query: string): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((it) => it.text.toLowerCase().includes(q));
}
