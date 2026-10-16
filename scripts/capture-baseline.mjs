// 视觉基线截图：21 页桌面暗色 + 关键页 375 移动
// 用法：node scripts/capture-baseline.mjs [before|after]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const phase = process.argv[2] ?? "before";
const BASE = "http://localhost:3000";
const OUT = path.resolve(process.cwd(), ".tmp-screens", phase);
mkdirSync(OUT, { recursive: true });

const pages = [
  ["home", "/"],
  ["dashboard", "/dashboard"],
  ["posts", "/posts"],
  ["post-detail", "/posts/nextjs-beginner-notes"],
  ["knowledge", "/knowledge"],
  ["projects", "/projects"],
  ["project-detail", "/projects/tech-blog"],
  ["learning", "/learning"],
  ["growth", "/growth"],
  ["profile", "/profile"],
  ["tools", "/tools"],
  ["functions", "/functions"],
  ["ai", "/ai"],
  ["ai-models", "/ai/models"],
  ["ai-agents", "/ai/agents"],
  ["ai-prompts", "/ai/prompts"],
  ["archive", "/archive"],
  ["notes", "/notes"],
  ["note-detail", "/notes/java-collections-cheatsheet"],
  ["tags", "/tags/Java"],
  ["about", "/about"],
];

const mobilePages = ["home", "dashboard", "posts", "tools"];

const browser = await chromium.launch();
const results = [];

for (const [name, route] of pages) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  try {
    const resp = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
    // 等待页面淡入 + boot 序列完成
    await page.waitForTimeout(2200);
    // 滚动一遍触发 <Reveal> 滚动揭示，再回顶
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y <= h; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 250));
    });
    await page.screenshot({
      path: path.join(OUT, `${name}-desktop.png`),
      fullPage: true,
    });
    results.push({ name, route, status: resp?.status() ?? "?", errors });
  } catch (e) {
    results.push({ name, route, status: "FAIL", errors: [String(e)] });
  }
  await ctx.close();
}

for (const name of mobilePages) {
  const [, route] = pages.find((p) => p[0] === name) ?? ["", "/"];
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 844 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  try {
    const resp = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1800);
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y <= h; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 250));
    });
    await page.screenshot({
      path: path.join(OUT, `${name}-mobile.png`),
      fullPage: true,
    });
    results.push({ name: `${name}-mobile`, route, status: resp?.status() ?? "?", errors });
  } catch (e) {
    results.push({ name: `${name}-mobile`, route, status: "FAIL", errors: [String(e)] });
  }
  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => r.status !== 200 || r.errors.length > 0);
console.log(`\n=== ${phase} 基线截图完成：${results.length} 张 ===`);
for (const r of results) {
  console.log(
    `${r.status === 200 && r.errors.length === 0 ? "OK " : "!! "} ${r.name.padEnd(16)} ${r.status} ${r.errors.length ? "errors: " + r.errors.slice(0, 3).join(" | ") : ""}`,
  );
}
if (failed.length) {
  console.log(`\n警告：${failed.length} 项异常`);
  process.exitCode = 1;
} else {
  console.log("全部正常");
}
