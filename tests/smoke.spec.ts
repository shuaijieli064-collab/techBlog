import { test, expect } from "@playwright/test";

const HOST = "https://example.com";

const routes = ["/", "/dashboard", "/posts", "/functions", "/tools", "/archive", "/posts/nextjs-beginner-notes"];

test.describe("SEO smoke", () => {
  for (const path of routes) {
    test(`canonical self-ref on ${path}`, async ({ page }) => {
      await page.goto(path);
      const href = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(href).toBe(path === "/" ? HOST : `${HOST}${path}`);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveCount(1);
    });
  }

  test("article page has Article JSON-LD and og:type=article", async ({ page }) => {
    await page.goto("/posts/nextjs-beginner-notes");
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
    const ld = page.locator('script[type="application/ld+json"]');
    await expect(ld).toHaveCount(2);
    const article = await ld.nth(1).textContent();
    expect(article).toContain('"@type":"Article"');
  });

  test("sitemap covers notes and tags", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBeTruthy();
    const xml = await res.text();
    expect(xml).toContain("/notes/");
    expect(xml).toContain("/tags/");
  });
});

test.describe("interactions", () => {
  test("functions search filters and clears", async ({ page }) => {
    await page.goto("/functions");
    await expect(page.locator("h3")).toHaveCount(10);
    await page.getByLabel("搜索函数").fill("split");
    await expect(page.locator("h3")).toHaveCount(1);
    await expect(page.locator("h3")).toHaveText("String split");
    await page.locator('button[aria-label="清除搜索"]').click();
    await expect(page.locator("h3")).toHaveCount(10);
  });

  test("functions ?category= filters to one section", async ({ page }) => {
    await page.goto(`/functions?category=${encodeURIComponent("集合")}`);
    await expect(page.locator("h2")).toHaveCount(1);
    await expect(page.locator("h2")).toHaveText("集合");
    await expect(page.getByText("FILTER")).toBeVisible();
    await page.getByRole("link", { name: "[ 清除筛选 ]" }).click();
    await expect(page.locator("h2")).toHaveCount(5);
  });

  test("tools tab switches and regex works", async ({ page }) => {
    await page.goto("/tools");
    await page.getByRole("button", { name: "Markdown 预览" }).click();
    await expect(page.getByLabel("Markdown 源码")).toBeVisible();
    await page.getByRole("button", { name: "正则测试" }).click();
    await page.getByPlaceholder("正则表达式").fill("\\d+");
    await page.getByPlaceholder("测试字符串...").fill("a1 b22 c333");
    await page.getByRole("button", { name: "测试", exact: true }).click();
    await expect(page.locator(".card .chip")).toHaveCount(3);
  });

  test("skip link jumps to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "跳到主要内容" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("dark canvas renders on load", async ({ page }) => {
    await page.goto("/");
    // 设计语言 v2 的空间底色令牌 --background: #05070e
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(5, 7, 14)");
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  });

  test("global search filters content and highlights matches", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByText("开始检索")).toBeVisible();
    await page.getByLabel("搜索内容").fill("split");
    // 命中函数速查中的 "String split"，结果以高亮 mark 呈现并跳转到 /tools?q=
    await expect(page.locator("mark").first()).toBeVisible();
    await expect(page.locator('a[href*="/tools?q="]').first()).toBeVisible();
    await page.getByLabel("清空").click();
    await expect(page.getByText("开始检索")).toBeVisible();
  });

  test("settings page renders data, env, migration and danger sections", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "数据概览" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "环境状态" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "数据迁移" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "危险区" })).toBeVisible();
    await expect(page.getByRole("button", { name: /导出全部数据/ })).toBeVisible();
  });
});

test.describe("phase 23: palette / search / feedback", () => {
  test("command palette opens with Ctrl+K and Enter navigates", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: "命令面板" });
    await expect(dialog).toBeVisible();
    await page.getByLabel("搜索命令").fill("归档");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/archive$/);
    await expect(dialog).toBeHidden();
  });

  test("palette fuzzy-matches latin subsequence", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    // 「psts」是 posts 的非连续子序列（p-o-s-t-s），检验跳字符模糊匹配
    await page.getByLabel("搜索命令").fill("psts");
    await expect(page.getByRole("dialog", { name: "命令面板" })).toContainText("文章列表");
  });

  test("search page keyboard nav opens the first hit", async ({ page }) => {
    await page.goto("/search");
    await page.getByLabel("搜索内容").fill("split");
    await expect(page.locator("mark").first()).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/tools\?q=/);
  });

  test("search records recent queries and offers one-click re-search", async ({ page }) => {
    await page.goto("/search");
    await page.getByLabel("搜索内容").fill("Redis");
    // recents are persisted after a short debounce
    await page.waitForTimeout(900);
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("nexus:recent-queries") ?? "[]"),
    );
    expect(stored).toContain("Redis");
    await page.getByLabel("清空").click();
    await expect(page.getByRole("button", { name: "Redis", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Redis", exact: true }).click();
    await expect(page.getByLabel("搜索内容")).toHaveValue("Redis");
  });

  test("toast appears after export from the command palette", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    await page.getByLabel("搜索命令").fill("导出全部数据");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("status")).toContainText(/导出/);
  });
});
