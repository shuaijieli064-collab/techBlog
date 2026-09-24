"use client";

import { useEffect, useState } from "react";
import { Heart, Eye, Share2, Check } from "lucide-react";

const viewsKey = (slug: string) => `post:views:${slug}`;
const likesKey = (slug: string) => `post:likes:${slug}`;
const likedKey = (slug: string) => `post:liked:${slug}`;

const baseViews: Record<string, number> = {
  "nextjs-beginner-notes": 128,
  "data-structures-learning-routine": 96,
  "project-retrospective-first-website": 74,
  "weekly-learning-routine": 63,
  "java-core-notes": 142,
  "springboot-learning-notes": 118,
  "mysql-mybatis-practice-notes": 87,
  "redis-message-queue-java-notes": 105,
};

const baseLikes: Record<string, number> = {
  "nextjs-beginner-notes": 24,
  "data-structures-learning-routine": 18,
  "project-retrospective-first-website": 15,
  "weekly-learning-routine": 12,
  "java-core-notes": 31,
  "springboot-learning-notes": 22,
  "mysql-mybatis-practice-notes": 16,
  "redis-message-queue-java-notes": 20,
};

function readNumber(key: string, fallback: number): number {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

export function PostEngagement({ slug, title }: { slug: string; title: string }) {
  const [views, setViews] = useState(baseViews[slug] ?? 0);
  const [likes, setLikes] = useState(baseLikes[slug] ?? 0);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextViews = readNumber(viewsKey(slug), baseViews[slug] ?? 0) + 1;
      try {
        localStorage.setItem(viewsKey(slug), String(nextViews));
      } catch {
        /* ignore */
      }
      setViews(nextViews);
      setLikes(readNumber(likesKey(slug), baseLikes[slug] ?? 0));
      try {
        setLiked(localStorage.getItem(likedKey(slug)) === "1");
      } catch {
        setLiked(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [slug]);

  const toggleLike = () => {
    const nextLiked = !liked;
    const nextLikes = Math.max(0, likes + (nextLiked ? 1 : -1));
    setLiked(nextLiked);
    setLikes(nextLikes);
    try {
      localStorage.setItem(likedKey(slug), nextLiked ? "1" : "0");
      localStorage.setItem(likesKey(slug), String(nextLikes));
    } catch {
      /* ignore */
    }
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      /* user cancelled or unsupported */
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
        <Eye size={15} className="text-slate-400" />
        <span>{views} 阅读</span>
      </div>

      <button
        type="button"
        onClick={toggleLike}
        aria-pressed={liked}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
          liked
            ? "border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400"
            : "border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-rose-400"
        }`}
      >
        <Heart size={15} className={liked ? "fill-rose-500" : ""} />
        <span>{likes} 点赞</span>
      </button>

      <button
        type="button"
        onClick={share}
        className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-sky-400"
      >
        {copied ? <Check size={15} className="text-green-500" /> : <Share2 size={15} />}
        <span>{copied ? "已复制链接" : "分享"}</span>
      </button>
    </div>
  );
}
