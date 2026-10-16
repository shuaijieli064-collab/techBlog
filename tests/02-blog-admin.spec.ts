import { test, expect, type Page } from "@playwright/test";

function waitForPut(page: Page, domain: string) {
  return page.waitForResponse(
    (r) => r.url().includes(`/api/workspace/${domain}`) && r.request().method() === "PUT",
  );
}

test.describe("blog content management (Phase 20)", () => {
  test("admin: create -> list/detail appear -> edit -> delete", async ({ page }) => {
    await page.goto("/posts/admin");

    // 新建
    await page.getByRole("button", { name: "新建文章" }).click();
    await page.getByLabel(/标题/).fill("Playwright 博客 CRUD 测试");
    await page.getByLabel(/正文/).fill("## 测试章节\n\n这是一篇用于验证增删改链路的文章正文。");
    await page.getByLabel(/标签/).fill("测试, Playwright");
    const putCreate = waitForPut(page, "blog-posts");
    await page.getByRole("button", { name: "保存文章" }).click();
    await putCreate;

    // 管理列表出现
    await expect(page.getByText("Playwright 博客 CRUD 测试", { exact: true })).toBeVisible();
    await expect(page.getByText("共 1 篇自定义文章")).toBeVisible();

    // 列表页可见（发布状态）
    await page.goto("/posts");
    await expect(page.getByText("Playwright 博客 CRUD 测试", { exact: true })).toBeVisible();

    // 详情页渲染用户文章（正文 Markdown 生效）
    await page.goto("/posts/admin");
    const adminCard = page.locator(".card").filter({ hasText: "我的文章" });
    await expect(adminCard.getByText("Playwright 博客 CRUD 测试", { exact: true })).toBeVisible();
    const link = adminCard.getByRole("link", { name: "查看" }).first();
    const href = (await link.getAttribute("href")) ?? "";
    expect(href).toMatch(/^\/posts\//);
    const slug = href.split("/").pop()!;
    const encoded = `/posts/${encodeURIComponent(slug)}`;

    // 服务器真相：详情页 document 请求返回文章 HTML（含 Markdown 正文）
    const detailResp = await page.request.get(encoded, { headers: { accept: "text/html" } });
    expect(detailResp.status()).toBe(200);
    const detailHtml = await detailResp.text();
    expect(detailHtml).toContain("Playwright 博客 CRUD 测试");
    expect(detailHtml).toContain("测试章节");

    // 浏览器导航（真实点击路径）也应为 200 且渲染标题
    await page.goto(encoded);
    await expect(page.getByRole("heading", { name: "Playwright 博客 CRUD 测试" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "测试章节" })).toBeVisible();
    await expect(page.getByText("这是一篇用于验证增删改链路的文章正文。")).toBeVisible();

    // 编辑：改标题并生效
    await page.goto("/posts/admin");
    await page.getByRole("button", { name: /编辑/ }).first().click();
    await page.getByLabel(/标题/).fill("Playwright 博客 CRUD 测试（已编辑）");
    const putEdit = waitForPut(page, "blog-posts");
    await page.getByRole("button", { name: "保存文章" }).click();
    await putEdit;
    await expect(page.getByText("Playwright 博客 CRUD 测试（已编辑）", { exact: true })).toBeVisible();

    // 删除：列表与详情均消失
    page.on("dialog", (d) => void d.accept());
    const putDelete = waitForPut(page, "blog-posts");
    await page.getByRole("button", { name: /删除/ }).first().click();
    await putDelete;
    await expect(page.getByText("共 0 篇自定义文章")).toBeVisible();
    await expect(page.getByText("Playwright 博客 CRUD 测试（已编辑）", { exact: true })).toBeHidden();

    await page.goto("/posts");
    await expect(page.getByText("Playwright 博客 CRUD 测试（已编辑）", { exact: true })).toBeHidden();
  });

  test("admin: draft posts stay hidden on the public list", async ({ page }) => {
    await page.goto("/posts/admin");
    await page.getByRole("button", { name: "新建文章" }).click();
    await page.getByLabel(/标题/).fill("草稿不应公开");
    await page.getByLabel(/正文/).fill("## 草稿\n\n未发布内容。");
    await page.getByLabel("发布（未勾选则为草稿）").uncheck();
    const put = waitForPut(page, "blog-posts");
    await page.getByRole("button", { name: "保存文章" }).click();
    await put;

    // 管理列表可见带草稿角标
    await expect(page.getByText("草稿不应公开", { exact: true })).toBeVisible();
    await expect(page.getByText("草稿", { exact: true })).toBeVisible();

    // 公开列表不可见
    await page.goto("/posts");
    await expect(page.getByText("草稿不应公开")).toBeHidden();

    // 清理
    await page.goto("/posts/admin");
    page.on("dialog", (d) => void d.accept());
    const putClean = waitForPut(page, "blog-posts");
    await page.getByRole("button", { name: /删除/ }).first().click();
    await putClean;
  });
});
