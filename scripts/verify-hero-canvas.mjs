// 一次性验证：首页 HeroNebula canvas 是否渲染了粒子（非空像素统计）
import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2500);

const stats = await page.evaluate(() => {
  const canvas = document.querySelector("canvas");
  if (!canvas) return { found: false };
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const img = ctx.getImageData(0, 0, w, h).data;
  let lit = 0;
  for (let i = 3; i < img.length; i += 4) {
    if (img[i] > 10) lit++;
  }
  return { found: true, w, h, litPixels: lit, total: img.length / 4 };
});
console.log(JSON.stringify({ canvas: stats, errors }, null, 2));
await browser.close();
