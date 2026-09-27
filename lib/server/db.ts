import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

import type { Json, WorkspaceDomain } from "@/lib/workspace/types";

type Cached = { path: string; db: DatabaseSync };

function resolveDbPath(): string {
  return process.env.WORKSPACE_DB_PATH || path.join(process.cwd(), "data", "workspace.db");
}

function open(dbPath: string): DatabaseSync {
  if (dbPath !== ":memory:") {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  const db = new DatabaseSync(dbPath);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA busy_timeout = 5000;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS workspace_state (
      domain TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return db;
}

function getDb(): DatabaseSync {
  const g = globalThis as typeof globalThis & { __techBlogWorkspaceDb?: Cached };
  const dbPath = resolveDbPath();
  if (!g.__techBlogWorkspaceDb || g.__techBlogWorkspaceDb.path !== dbPath) {
    g.__techBlogWorkspaceDb = { path: dbPath, db: open(dbPath) };
  }
  return g.__techBlogWorkspaceDb.db;
}

export function readDomain(domain: WorkspaceDomain): Json | null {
  const row = getDb()
    .prepare("SELECT data FROM workspace_state WHERE domain = ?")
    .get(domain) as { data?: string } | undefined;
  if (!row || typeof row.data !== "string") return null;
  try {
    return JSON.parse(row.data) as Json;
  } catch {
    return null;
  }
}

export function writeDomain(domain: WorkspaceDomain, data: Json): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO workspace_state (domain, data, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(domain) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
  ).run(domain, JSON.stringify(data));
}

export function countDomains(): number {
  const row = getDb().prepare("SELECT COUNT(*) AS n FROM workspace_state").get() as {
    n: number | bigint;
  };
  return Number(row.n);
}

export function importDomains(states: Partial<Record<WorkspaceDomain, Json>>): WorkspaceDomain[] {
  const db = getDb();
  const imported: WorkspaceDomain[] = [];
  db.exec("BEGIN");
  try {
    for (const [domain, data] of Object.entries(states)) {
      if (data === undefined) continue;
      db.prepare(
        `INSERT INTO workspace_state (domain, data, updated_at)
         VALUES (?, ?, datetime('now'))
         ON CONFLICT(domain) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
      ).run(domain, JSON.stringify(data));
      imported.push(domain as WorkspaceDomain);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return imported;
}
