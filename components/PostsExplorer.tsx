"use client";

import { useMemo, useState } from "react";

import { PostCard } from "@/components/PostCard";
import type { Post } from "@/lib/posts";

type SortType = "latest" | "oldest" | "readTime";

const PAGE_SIZE = 4;

function readMinutes(value: string) {
  const matched = value.match(/\d+/);
  return matched ? Number(matched[0]) : 0;
}

export function PostsExplorer({
  allPosts,
  categories,
  tags,
}: {
  allPosts: Post[];
  categories: string[];
  tags: string[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [tag, setTag] = useState("all");
  const [sortBy, setSortBy] = useState<SortType>("latest");
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return allPosts
      .filter((post) => {
        if (category !== "all" && post.category !== category) {
          return false;
        }
        if (tag !== "all" && !post.tags.includes(tag)) {
          return false;
        }
        if (!normalizedSearch) {
          return true;
        }

        return [post.title, post.excerpt, post.category, post.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === "readTime") {
          return readMinutes(a.readTime) - readMinutes(b.readTime);
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [allPosts, category, search, sortBy, tag]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedPosts = filteredPosts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const updatePage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setTag("all");
    setSortBy("latest");
    setPage(1);
  };

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="grid gap-4 lg:grid-cols-4">
          <label className="text-sm text-slate-600 dark:text-slate-300 lg:col-span-2">
            搜索文章
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="标题、标签、分类..."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-sky-200 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="text-sm text-slate-600 dark:text-slate-300">
            分类
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-sky-200 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="all">全部分类</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-slate-600 dark:text-slate-300">
            标签
            <select
              value={tag}
              onChange={(event) => {
                setTag(event.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-sky-200 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="all">全部标签</option>
              {tags.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="text-sm text-slate-600 dark:text-slate-300">
            排序
            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value as SortType);
                setPage(1);
              }}
              className="ml-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-sky-200 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="latest">最新优先</option>
              <option value="oldest">最早优先</option>
              <option value="readTime">阅读时长最短</option>
            </select>
          </label>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:text-slate-200"
          >
            重置筛选
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">共 {filteredPosts.length} 篇文章</p>

      {pagedPosts.length > 0 ? (
        <>
          <div className="grid gap-8 md:grid-cols-2">
            {pagedPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => updatePage(safePage - 1)}
              disabled={safePage === 1}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
            >
              上一页
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              第 {safePage} / {totalPages} 页
            </span>
            <button
              type="button"
              onClick={() => updatePage(safePage + 1)}
              disabled={safePage === totalPages}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
            >
              下一页
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
          未找到符合当前筛选条件的文章。
        </div>
      )}
    </section>
  );
}
