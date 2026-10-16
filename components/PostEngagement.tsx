"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Eye, Share2, Check } from "lucide-react";

import { postMetric } from "@/lib/workspace/client";
import { seedMetric } from "@/lib/postMetricsSeed";
import type { MetricOp, PostMetric } from "@/lib/workspace/types";

export function PostEngagement({ slug, title }: { slug: string; title: string }) {
  const [metric, setMetric] = useState<PostMetric>(() => seedMetric(slug));
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Track view only once per session per slug: the backend increments on
    // every "view" op, so the guard must skip the call entirely — a re-mount
    // (client nav back, HMR) must not inflate the counter.
    const sessionKey = `post-view-${slug}`;
    const alreadyViewed =
      typeof window !== "undefined" && sessionStorage.getItem(sessionKey) === "1";

    let cancelled = false;
    void postMetric(slug, "view").then((m) => {
      if (cancelled) return;
      if (m) setMetric(m);
      if (!alreadyViewed && typeof window !== "undefined") {
        sessionStorage.setItem(sessionKey, "1");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const toggleLike = () => {
    const op: MetricOp = metric.liked ? "unlike" : "like";
    setMetric((m) => ({
      ...m,
      liked: !m.liked,
      likes: Math.max(0, m.likes + (op === "like" ? 1 : -1)),
    }));
    void postMetric(slug, op).then((m) => {
      if (m) setMetric(m);
    });
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
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 rounded-full border border-hair px-3 py-1.5 text-sm text-print">
        <Eye size={15} className="text-muted" />
        <span>{metric.views} 阅读</span>
      </div>

      <button
        type="button"
        onClick={toggleLike}
        aria-pressed={metric.liked}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
          metric.liked
            ? "border-alert bg-alert/10 text-alert"
            : "border-hair text-print hover:border-alert hover:text-alert"
        }`}
      >
        <Heart size={15} className={metric.liked ? "fill-alert" : ""} />
        <span>{metric.likes} 点赞</span>
      </button>

      <button
        type="button"
        onClick={share}
        className="flex items-center gap-1.5 rounded-full border border-hair px-3 py-1.5 text-sm text-print transition-colors hover:border-wire hover:text-wire"
      >
        {copied ? <Check size={15} className="pop text-wire" /> : <Share2 size={15} />}
        <span>{copied ? "已复制链接" : "分享"}</span>
      </button>
    </div>
  );
}
