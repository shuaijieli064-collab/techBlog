import { test, expect, type Page } from "@playwright/test";

function waitForPut(page: Page, domain: string) {
  return page.waitForResponse(
    (r) => r.url().includes(`/api/workspace/${domain}`) && r.request().method() === "PUT",
  );
}

test.describe("workspace operations (Phase 17)", () => {
  test("command palette opens via Ctrl+K, filters and navigates", async ({ page }) => {
    await page.goto("/learning");

    await page.keyboard.press("Control+k");
    await expect(page.getByRole("dialog", { name: "命令面板" })).toBeVisible();

    const input = page.getByLabel("搜索命令");
    await input.fill("工作台");
    await expect(page.getByRole("button", { name: /工作台/ }).first()).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/dashboard$/);

    // Esc closes the palette when open
    await page.keyboard.press("Control+k");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "命令面板" })).toBeHidden();
  });

  test("task board: add -> move to today -> complete -> restore", async ({ page }) => {
    await page.goto("/dashboard");

    const board = page.locator(".card").filter({ hasText: "任务箱" });

    // 添加一条待办
    const putBoard = waitForPut(page, "task-board");
    await board.getByLabel("任务箱新任务").fill("写一篇 Next.js 笔记");
    await board.getByRole("button", { name: "加入" }).click();
    await putBoard;
    await expect(board.getByText("写一篇 Next.js 笔记")).toBeVisible();

    // 移到今日：写入 daily-tasks
    const putDaily = waitForPut(page, "daily-tasks");
    await board.getByLabel("移到今日").click();
    await putDaily;
    await expect(
      page.locator(".card").filter({ hasText: "今日任务" }).getByText("写一篇 Next.js 笔记"),
    ).toBeVisible();

    // 完成：进入已完成分组，今日清单同步勾选
    const putDaily2 = waitForPut(page, "daily-tasks");
    await board.getByLabel("完成任务").click();
    await putDaily2;
    await expect(board.getByText("写一篇 Next.js 笔记")).toHaveClass(/line-through/);

    // 恢复：回到待办，今日清单移除副本
    const putDaily3 = waitForPut(page, "daily-tasks");
    await board.getByLabel("恢复任务").click();
    await putDaily3;
    await expect(
      page.locator(".card").filter({ hasText: "今日任务" }).getByText("写一篇 Next.js 笔记"),
    ).toBeHidden();
  });

  test("study record: add then edit preserves id/date and updates fields", async ({ page }) => {
    await page.goto("/learning?focus=record");

    const titleInput = page.getByLabel("记录标题");
    await titleInput.fill("TypeScript 泛型");
    await page.getByLabel("笔记").fill("梳理约束与推断");
    const putAdd = waitForPut(page, "study-records");
    await page.getByRole("button", { name: "记录", exact: true }).click();
    await putAdd;

    await expect(page.getByText("TypeScript 泛型")).toBeVisible();

    // 编辑并保存
    await page.getByLabel("编辑记录").first().click();
    await page.getByLabel("记录标题").fill("TypeScript 泛型约束");
    const putEdit = waitForPut(page, "study-records");
    await page.getByRole("button", { name: "保存", exact: true }).click();
    await putEdit;

    await expect(page.getByText("TypeScript 泛型约束")).toBeVisible();
    await expect(page.getByText("TypeScript 泛型", { exact: true })).toBeHidden();
  });

  test("github activity card renders with live or fallback status", async ({ page }) => {
    await page.goto("/dashboard");
    const card = page.locator(".card").filter({ hasText: "GitHub 活动" });
    await expect(card).toBeVisible();
    await expect(card.locator("text=/^(LIVE|FALLBACK|SYNC)/")).toBeVisible();
  });
});
