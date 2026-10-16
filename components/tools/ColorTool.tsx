"use client";

import { useState } from "react";

import CopyButton from "./CopyButton";

export default function ColorTool() {
  const [hex, setHex] = useState("#0ea5e9");

  const normalize = (value: string) => {
    let v = value.trim().replace(/^#/, "");
    if (v.length === 3)
      v = v
        .split("")
        .map((c) => c + c)
        .join("");
    if (!/^[0-9a-fA-F]{6}$/.test(v)) return null;
    return `#${v.toLowerCase()}`;
  };

  const valid = normalize(hex);
  const rgb = valid
    ? [parseInt(valid.slice(1, 3), 16), parseInt(valid.slice(3, 5), 16), parseInt(valid.slice(5, 7), 16)]
    : null;

  const toHsl = (r: number, g: number, b: number) => {
    const rn = r / 255,
      gn = g / 255,
      bn = b / 255;
    const max = Math.max(rn, gn, bn),
      min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    let h = 0,
      s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      else if (max === gn) h = ((bn - rn) / d + 2) / 6;
      else h = ((rn - gn) / d + 4) / 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="color"
          value={valid ?? "#0ea5e9"}
          onChange={(e) => setHex(e.target.value)}
          className="h-12 w-16 cursor-pointer rounded-md border border-hair bg-panel p-1"
          aria-label="选择颜色"
        />
        <input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#0ea5e9"
          className="input-base flex-1 font-mono"
        />
      </div>
      <div
        className="h-24 rounded-lg border border-hair"
        style={{ backgroundColor: valid ?? "transparent" }}
      />
      {valid && rgb && (
        <div className="grid grid-cols-3 gap-3 text-sm">
          {[
            { label: "HEX", value: valid },
            { label: "RGB", value: `rgb(${rgb.join(", ")})` },
            { label: "HSL", value: toHsl(rgb[0], rgb[1], rgb[2]) },
          ].map((row) => (
            <div
              key={row.label}
              className="code-panel relative"
            >
              <div className="label-mono">{row.label}</div>
              <div className="mt-1 break-all font-mono text-xs text-foreground">{row.value}</div>
              <CopyButton text={row.value} />
            </div>
          ))}
        </div>
      )}
      {!valid && hex.trim() && (
        <p className="text-sm text-alert">请输入合法的 HEX 颜色，如 #0ea5e9</p>
      )}
    </div>
  );
}
