"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Database,
  Download,
  GitBranch,
  Server,
  Trash2,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { useToast } from "@/components/Toast";

const domainLabels: Record<string, string> = {
  "daily-tasks": "今日任务",
  "task-board": "任务箱",
  "project-todos": "项目 TODO",
  "learning-mastered": "已掌握算法",
  algorithms: "算法进度",
  "study-records": "学习记录",
  "skill-levels": "技能等级",
  "prompt-library": "提示词库",
  "post-metrics": "文章指标",
  "blog-posts": "自定义文章",
};

function countOf(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (Array.isArray(value)) return value.length;
  if (typeof value === "object") return Object.keys(value as object).length;
  return 1;
}

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] ${
        ok ? "border-wire/40 text-wire" : "border-alert/40 text-alert"
      }`}
    >
      {ok ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
      {label}
    </span>
  );
}

export function SettingsView() {
  const toast = useToast();
  const [overview, setOverview] = useState<Record<string, unknown> | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);

  const [ai, setAi] = useState<{ configured: boolean; baseUrl: string; defaultModel: string } | null>(
    null,
  );
  const [github, setGithub] = useState<{ username: string; ok: boolean } | null>(null);
  const [siteUrl, setSiteUrl] = useState("");

  const [importing, setImporting] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearing, setClearing] = useState(false);

  const loadOverview = useCallback(async () => {
    try {
      const res = await fetch("/api/workspace/export", { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as { domains: Record<string, unknown> };
        setOverview(json.domains);
      }
    } catch {
      /* ignore */
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/workspace/export", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json: { domains?: Record<string, unknown> } | null) => {
        if (json?.domains) setOverview(json.domains);
      })
      .catch(() => {
        /* ignore */
      })
      .finally(() => setOverviewLoading(false));
    // window.location 仅在客户端可读：放入 rAF，避免 SSR 水合不匹配与同步 setState。
    const raf = requestAnimationFrame(() => setSiteUrl(window.location.origin));
    fetch("/api/ai/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) =>
        setAi(d ? { configured: d.configured, baseUrl: d.baseUrl, defaultModel: d.defaultModel } : null),
      )
      .catch(() => setAi(null));
    fetch("/api/github/events", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setGithub(d ? { username: d.username, ok: d.ok && !d.fallback } : null))
      .catch(() => setGithub(null));
    return () => cancelAnimationFrame(raf);
  }, []);

  const overviewRows = useMemo(() => {
    if (!overview) return [];
    return Object.keys(domainLabels)
      .filter((d) => d in overview)
      .map((d) => ({ domain: d, label: domainLabels[d], count: countOf(overview[d]) }))
      .sort((a, b) => a.label.localeCompare(b.label, "zh"));
  }, [overview]);

  const downloadExport = async () => {
    try {
      const res = await fetch("/api/workspace/export", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `workspace-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast("数据导出成功，快照已开始下载", "success");
    } catch {
      toast("导出失败，请稍后重试", "error");
    }
  };

  const onImport = async (file: File) => {
    setImporting(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { domains?: Record<string, unknown> };
      if (!parsed.domains || typeof parsed.domains !== "object") {
        toast("文件格式无效：缺少 domains 字段", "error");
        return;
      }
      const domains = parsed.domains;
      let okCount = 0;
      for (const [domain, data] of Object.entries(domains)) {
        const res = await fetch(`/api/workspace/${domain}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });
        if (res.ok) okCount += 1;
      }
      if (okCount === Object.keys(domains).length) {
        toast(`恢复完成（${okCount} 个数据域），刷新后生效`, "success");
      } else {
        toast(`部分恢复失败（${okCount}/${Object.keys(domains).length} 个数据域）`, "error");
      }
      await loadOverview();
    } catch {
      toast("解析失败：不是合法的 JSON 备份文件", "error");
    } finally {
      setImporting(false);
    }
  };

  const onClearPosts = async () => {
    setClearing(true);
    try {
      const res = await fetch("/api/workspace/blog-posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [] }),
      });
      if (res.ok) {
        toast("自定义文章已清空", "success");
        setConfirmClear(false);
      } else {
        toast("清空失败，请重试", "error");
      }
      await loadOverview();
    } catch {
      toast("清空失败，请重试", "error");
    } finally {
      setClearing(false);
    }
  };

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        code="settings"
        eyebrow="系统 / 数据"
        title="设置与数据中心"
        description="查看工作台数据分布、环境状态，并自由导出或恢复你的全部数据。"
      />

      <div className="space-y-10">
        {/* 数据概览 */}
        <section>
          <div className="mb-3 flex items-center gap-2 border-b border-hair pb-2">
            <Database size={14} className="text-wire" />
            <h2 className="section-title">数据概览</h2>
          </div>
          {overviewLoading ? (
            <p className="font-mono text-xs text-muted">{"//"} 读取中…</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {overviewRows.map((row) => (
                <div key={row.domain} className="card p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {row.domain}
                  </div>
                  <div className="mt-2 text-2xl font-bold text-foreground">{row.count}</div>
                  <div className="mt-1 text-xs text-print">{row.label}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 环境状态 */}
        <section>
          <div className="mb-3 flex items-center gap-2 border-b border-hair pb-2">
            <Server size={14} className="text-wire" />
            <h2 className="section-title">环境状态</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="card p-4">
              <div className="flex items-center gap-2 text-xs text-print">
                <Activity size={14} className="text-wire" /> AI 模型服务
              </div>
              <div className="mt-3">
                {ai ? (
                  <>
                    <StatusBadge ok={ai.configured} label={ai.configured ? "已配置" : "未配置"} />
                    <p className="mt-2 font-mono text-[11px] text-muted break-all">
                      {ai.baseUrl}
                    </p>
                    <p className="mt-1 text-xs text-print">默认模型：{ai.defaultModel}</p>
                  </>
                ) : (
                  <span className="font-mono text-[11px] text-muted">{"//"} 状态不可用</span>
                )}
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center gap-2 text-xs text-print">
                <GitBranch size={14} className="text-wire" /> GitHub 账号
              </div>
              <div className="mt-3">
                {github ? (
                  <>
                    <StatusBadge ok={github.ok} label={github.ok ? "已连接" : "示例数据"} />
                    <p className="mt-2 font-mono text-[11px] text-muted">{github.username}</p>
                  </>
                ) : (
                  <span className="font-mono text-[11px] text-muted">{"//"} 状态不可用</span>
                )}
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center gap-2 text-xs text-print">
                <Server size={14} className="text-wire" /> 站点地址
              </div>
              <div className="mt-3">
                <StatusBadge ok={Boolean(siteUrl)} label={siteUrl ? "运行中" : "未知"} />
                <p className="mt-2 break-all font-mono text-[11px] text-muted">
                  {siteUrl || "// 读取中"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 数据迁移 */}
        <section>
          <div className="mb-3 flex items-center gap-2 border-b border-hair pb-2">
            <Upload size={14} className="text-wire" />
            <h2 className="section-title">数据迁移</h2>
          </div>
          <div className="card p-5">
            <p className="text-sm leading-6 text-print">
              你的全部工作台数据均可带走：导出为 JSON 快照，或上传此前导出的备份以恢复。
              导入会<span className="text-alert">覆盖</span>同名数据域的当前内容。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void downloadExport()}
                className="btn-primary btn-sm inline-flex items-center gap-2"
              >
                <Download size={14} /> 导出全部数据
              </button>
              <label className="btn-secondary btn-sm inline-flex cursor-pointer items-center gap-2">
                <Upload size={14} /> 导入 / 恢复备份
                <input
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  disabled={importing}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void onImport(f);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            {importing && (
              <p className="mt-3 flex items-center gap-2 font-mono text-xs text-wire">
                <Loader2 size={12} className="animate-spin" /> 正在恢复…
              </p>
            )}
          </div>
        </section>

        {/* 危险区 */}
        <section>
          <div className="mb-3 flex items-center gap-2 border-b border-hair pb-2">
            <Trash2 size={14} className="text-alert" />
            <h2 className="section-title text-alert">危险区</h2>
          </div>
          <div className="card border-alert/30 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">清空自定义文章</p>
                <p className="mt-1 text-xs text-print">
                  删除所有在「文章管理」中创建的自定义文章（静态文章不受影响）。此操作不可撤销。
                </p>
              </div>
              {confirmClear ? (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    disabled={clearing}
                    onClick={() => setConfirmClear(false)}
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    className="btn-sm inline-flex items-center gap-1.5 border border-alert bg-alert/15 text-alert transition-colors hover:bg-alert/25"
                    disabled={clearing}
                    onClick={() => void onClearPosts()}
                  >
                    {clearing ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    确认清空
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-sm inline-flex shrink-0 items-center gap-1.5 border border-alert/40 text-alert transition-colors hover:bg-alert/10"
                  onClick={() => setConfirmClear(true)}
                >
                  <Trash2 size={12} /> 清空
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
