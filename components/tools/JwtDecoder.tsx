"use client";

import { useState } from "react";

import CopyButton from "./CopyButton";

function base64UrlDecode(segment: string): string {
  const pad = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = pad + "=".repeat((4 - (pad.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const parts = token.trim().split(".");
  const valid = parts.length === 3 && parts.every((p) => p.length > 0);

  let header = "";
  let payload = "";
  let error = "";
  if (valid) {
    try {
      header = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2);
      payload = JSON.stringify(JSON.parse(base64UrlDecode(parts[1])), null, 2);
    } catch {
      error = "无法解码：请确认是合法的 JWT（header.payload.signature）";
      header = "";
      payload = "";
    }
  } else if (token.trim()) {
    error = "格式不正确：JWT 应包含三段，用 . 分隔";
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        仅本地 Base64URL 解码预览，不校验签名。请勿粘贴生产环境真实令牌。
      </p>
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…"
        className="input-base h-28 font-mono text-xs"
      />
      {error && <p className="text-sm text-signal">{error}</p>}
      {header && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 label-mono">Header</p>
            <div className="relative">
              <pre className="overflow-auto code-panel">
                {header}
              </pre>
              <CopyButton text={header} />
            </div>
          </div>
          <div>
            <p className="mb-1 label-mono">Payload</p>
            <div className="relative">
              <pre className="overflow-auto code-panel">
                {payload}
              </pre>
              <CopyButton text={payload} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
