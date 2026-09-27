import { readDomain, writeDomain } from "@/lib/server/db";
import { seedMetric } from "@/lib/postMetricsSeed";
import type { MetricOp, PostMetric, PostMetrics } from "@/lib/workspace/types";

function loadMetrics(): PostMetrics {
  const raw = readDomain("post-metrics");
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as PostMetrics;
  }
  return {};
}

export function applyMetricOp(slug: string, op: MetricOp): PostMetric {
  const metrics = loadMetrics();
  const current = metrics[slug] ?? seedMetric(slug);
  const next: PostMetric = { ...current };

  if (op === "view") {
    next.views += 1;
  } else if (op === "like") {
    if (!next.liked) {
      next.liked = true;
      next.likes += 1;
    }
  } else if (next.liked) {
    next.liked = false;
    next.likes = Math.max(0, next.likes - 1);
  }

  metrics[slug] = next;
  writeDomain("post-metrics", metrics);
  return next;
}
