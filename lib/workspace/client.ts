"use client";

import { useCallback, useEffect, useState } from "react";

import type { Json, MetricOp, PostMetric, WorkspaceDomain } from "./types";

const MIGRATED_FLAG = "workspace:migrated";

const LEGACY_KEYS: Array<[WorkspaceDomain, string]> = [
  ["daily-tasks", "dashboard:tasks:v1"],
  ["project-todos", "projects:todos:v1"],
  ["learning-mastered", "learning:mastered:v1"],
  ["algorithms", "learning:algorithms:v1"],
  ["study-records", "learning:study-records:v1"],
  ["skill-levels", "growth:skill-levels:v1"],
  ["prompt-library", "prompt-library:v1"],
];

function readLegacyMetrics(): Record<string, PostMetric> | null {
  const out: Record<string, PostMetric> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("post:")) continue;
      const [, kind, slug] = key.split(":");
      if (!slug || !kind) continue;
      const raw = localStorage.getItem(key);
      if (raw === null) continue;
      const metric = (out[slug] ??= { views: 0, likes: 0, liked: false });
      if (kind === "views" || kind === "likes") {
        const n = Number(raw);
        if (Number.isFinite(n)) metric[kind] = n;
      } else if (kind === "liked") {
        metric.liked = raw === "1";
      }
    }
  } catch {
    return null;
  }
  return Object.keys(out).length > 0 ? out : null;
}

function readLegacyStates(): Partial<Record<WorkspaceDomain, Json>> {
  const states: Partial<Record<WorkspaceDomain, Json>> = {};
  for (const [domain, key] of LEGACY_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      states[domain] = JSON.parse(raw) as Json;
    } catch {
      /* skip malformed legacy value */
    }
  }
  const metrics = readLegacyMetrics();
  if (metrics) states["post-metrics"] = metrics;
  return states;
}

let migratePromise: Promise<void> | null = null;

function runMigration(): Promise<void> {
  const states = readLegacyStates();
  return fetch("/api/workspace/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ states }),
  }).then((res) => {
    // 409 = another browser already initialized the DB; safe to proceed.
    if (!res.ok && res.status !== 409) {
      throw new Error(`workspace import failed with ${res.status}`);
    }
    try {
      localStorage.setItem(MIGRATED_FLAG, "1");
    } catch {
      /* ignore */
    }
  });
}

/**
 * Import this browser's legacy localStorage snapshot into the local backend.
 * Runs at most once per browser; retries after network failures.
 * All workspace writes must await this so a stale import can never clobber
 * freshly written server state.
 */
export function ensureMigrated(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  try {
    if (localStorage.getItem(MIGRATED_FLAG)) return Promise.resolve();
  } catch {
    /* storage unavailable — attempt import anyway */
  }
  if (!migratePromise) {
    migratePromise = runMigration().catch((err) => {
      migratePromise = null;
      throw err;
    });
  }
  return migratePromise;
}

type Entry = {
  value: Json | null;
  ready: boolean;
  loading: boolean;
  subs: Set<() => void>;
  timer: ReturnType<typeof setTimeout> | null;
};

const store = new Map<WorkspaceDomain, Entry>();

function getEntry(domain: WorkspaceDomain): Entry {
  let entry = store.get(domain);
  if (!entry) {
    entry = { value: null, ready: false, loading: false, subs: new Set(), timer: null };
    store.set(domain, entry);
  }
  return entry;
}

function notify(entry: Entry) {
  for (const sub of entry.subs) sub();
}

function loadEntry(domain: WorkspaceDomain) {
  const entry = getEntry(domain);
  if (entry.loading || entry.ready) return;
  entry.loading = true;
  void (async () => {
    try {
      await ensureMigrated();
      const res = await fetch(`/api/workspace/${domain}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`GET ${domain} failed: ${res.status}`);
      const body = (await res.json()) as { data?: Json | null };
      // Never clobber an edit made while the fetch was in flight.
      if (entry.value === null && body.data !== null && body.data !== undefined) {
        entry.value = body.data;
      }
    } catch {
      /* backend unavailable — keep component defaults (pre-backend behavior) */
    } finally {
      entry.loading = false;
      entry.ready = true;
      notify(entry);
    }
  })();
}

function commitEntry(domain: WorkspaceDomain, next: Json) {
  const entry = getEntry(domain);
  entry.value = next;
  notify(entry);
  if (entry.timer) clearTimeout(entry.timer);
  entry.timer = setTimeout(() => {
    entry.timer = null;
    void fetch(`/api/workspace/${domain}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: next }),
    }).catch(() => {
      /* backend unavailable — in-memory state still serves this session */
    });
  }, 120);
}

/**
 * Shared reactive state for one workspace domain. All components using the
 * same domain see each other's writes immediately (single module-level store),
 * and the latest value is debounced to the local backend.
 */
export function useWorkspace<T extends Json>(
  domain: WorkspaceDomain,
  defaultValue: T,
): [T, (next: T) => void, boolean] {
  const [, setVersion] = useState(0);
  // Captured on mount; every call site passes a stable reference (module
  // constant or useMemo), so identity churn is a non-issue.
  const [fallback] = useState(defaultValue);

  useEffect(() => {
    const entry = getEntry(domain);
    const sub = () => setVersion((v) => v + 1);
    entry.subs.add(sub);
    loadEntry(domain);
    return () => {
      entry.subs.delete(sub);
    };
  }, [domain]);

  const entry = getEntry(domain);
  const value = (entry.value !== null ? entry.value : fallback) as T;
  const save = useCallback((next: T) => commitEntry(domain, next), [domain]);

  return [value, save, entry.ready];
}

/** Apply a counter operation (view/like/unlike) on the local backend. */
export async function postMetric(slug: string, op: MetricOp): Promise<PostMetric | null> {
  try {
    await ensureMigrated();
    const res = await fetch("/api/workspace/post-metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, op }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { metric?: PostMetric };
    return body.metric ?? null;
  } catch {
    return null;
  }
}
