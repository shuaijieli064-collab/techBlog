// Phase 18 验证截图：AI 对话 / AI 模型 / AI Agents / 工作台
// 用法（在项目根目录）：node scripts/capture-phase18.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve(".tmp-screens/phase18");
mkdirSync(OUT, { recursive: true });

const pages = [
  { name: "ai-chat", path: "/ai/chat", scroll: true },
  { name: "ai-models", path: "/ai/models", scroll: true },
  { name: "ai-agents", path: "/ai/agents", scroll: true },
  { name: "dashboard", path: "/dashboard", scroll: true },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const p of pages) {
  await page.goto(`http://localhost:3000${p.path}`, { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(800);
  if (p.scroll) {
    // 触发 Reveal 滚动揭示
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: `${OUT}/${p.name}-desktop.png`, fullPage: true });
  console.log(`captured ${p.name}`);
}

await browser.close();
console.log(`done -> ${OUT}`);
