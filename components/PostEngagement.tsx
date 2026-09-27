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
      <div className="flex items-center gap-1.5 rounded-full border border-hair px-3 py-1.5 text-sm text-print">
        <Eye size={15} className="text-muted" />
        <span>{views} 阅读</span>
      </div>

      <button
        type="button"
        onClick={toggleLike}
        aria-pressed={liked}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
          liked
            ? "border-alert bg-alert/10 text-alert"
            : "border-hair text-print hover:border-alert hover:text-alert"
        }`}
      >
        <Heart size={15} className={liked ? "fill-alert" : ""} />
        <span>{likes} 点赞</span>
      </button>

      <button
        type="button"
        onClick={share}
        className="flex items-center gap-1.5 border border-hair px-3 py-1.5 text-sm text-print transition-colors hover:border-wire hover:text-wire"
      >
        {copied ? <Check size={15} className="text-wire" /> : <Share2 size={15} />}
        <span>{copied ? "已复制链接" : "分享"}</span>
      </button>
    </div>
  );
}
