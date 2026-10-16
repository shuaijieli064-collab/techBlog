// Phase 26 星空主题验证截图：桌面 1440 关键页 + 首页 375 移动端
// 用法（项目根目录，服务器已在 3100 运行）：node scripts/capture-phase26.mjs
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const BASE = process.env.BASE ?? "http://localhost:3100";
const OUT = resolve(".tmp-screens/phase26");
mkdirSync(OUT, { recursive: true });

const desktop = [
  ["home", "/"],
  ["dashboard", "/dashboard"],
  ["posts", "/posts"],
  ["post-detail", "/posts/nextjs-beginner-notes"],
  ["knowledge", "/knowledge"],
];

const browser = await chromium.launch();

for (const [name, path] of desktop) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await page.close();
}

// 移动端：首页 + 仪表盘
for (const [name, path] of [["home-mobile", "/"], ["dashboard-mobile", "/dashboard"]]) {
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await page.close();
}

await browser.close();
console.log("captured:", OUT);
