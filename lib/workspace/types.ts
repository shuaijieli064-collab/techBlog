export const WORKSPACE_DOMAINS = [
  "daily-tasks",
  "project-todos",
  "learning-mastered",
  "algorithms",
  "study-records",
  "skill-levels",
  "prompt-library",
  "post-metrics",
] as const;

export type WorkspaceDomain = (typeof WORKSPACE_DOMAINS)[number];

export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

export type PostMetric = { views: number; likes: number; liked: boolean };

export type PostMetrics = Record<string, PostMetric>;

export type MetricOp = "view" | "like" | "unlike";

export const MAX_DOMAIN_BYTES = 256 * 1024;

export function isWorkspaceDomain(value: string): value is WorkspaceDomain {
  return (WORKSPACE_DOMAINS as readonly string[]).includes(value);
}

export function isMetricOp(value: string): value is MetricOp {
  return value === "view" || value === "like" || value === "unlike";
}
