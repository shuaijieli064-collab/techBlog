import { test, expect, type Page } from "@playwright/test";

function localIso(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const importedRecords = [
  {
    id: "t-1",
    date: localIso(0),
    title: "今日学习",
    description: "持久化验证",
    hours: 1,
    topic: "测试",
  },
  {
    id: "t-2",
    date: localIso(1),
    title: "昨日学习",
    description: "",
    hours: 1,
    topic: "测试",
  },
];

const putTasks = [
  { id: 1, title: "测试任务A", tag: "t", done: false },
  { id: 2, title: "测试任务B", tag: "t", done: true },
];

function waitForPut(page: Page, domain: string) {
  return page.waitForResponse(
    (r) => r.url().includes(`/api/workspace/${domain}`) && r.request().method() === "PUT",
  );
}

test.describe("workspace backend API", () => {
  test("fresh browser import accepted, replay rejected with 409", async ({ request }) => {
    const empty = await request.post("/api/workspace/import", { data: { states: {} } });
    expect(empty.status()).toBe(200);

    const first = await request.post("/api/workspace/import", {
      data: { states: { "study-records": importedRecords } },
    });
    expect(first.status()).toBe(200);
    expect((await first.json()).imported).toContain("study-records");

    const replay = await request.post("/api/workspace/import", {
      data: { states: { "study-records": [] } },
    });
    expect(replay.status()).toBe(409);
  });

  test("GET returns imported domain, PUT round-trips and persists", async ({ request }) => {
    const get = await request.get("/api/workspace/study-records");
    expect(get.status()).toBe(200);
    expect(await get.json()).toMatchObject({
      domain: "study-records",
      data: importedRecords,
      initialized: true,
    });

    const put = await request.put("/api/workspace/daily-tasks", {
      data: { data: putTasks },
    });
    expect(put.status()).toBe(200);

    const reread = await request.get("/api/workspace/daily-tasks");
    expect((await reread.json()).data).toEqual(putTasks);
  });

  test("validates domain, body and payload size", async ({ request }) => {
    const unknown = await request.get("/api/workspace/nope");
    expect(unknown.status()).toBe(404);

    const missing = await request.put("/api/workspace/daily-tasks", { data: { foo: 1 } });
    expect(missing.status()).toBe(400);

    const huge = await request.put("/api/workspace/daily-tasks", {
      data: { data: "x".repeat(256 * 1024 + 16) },
    });
    expect(huge.status()).toBe(413);

    const notJson = await request.put("/api/workspace/daily-tasks", {
      data: "not-an-object",
      headers: { "Content-Type": "application/json" },
    });
    expect(notJson.status()).toBe(400);
  });

  test("post-metrics view/like/unlike are applied server-side", async ({ request }) => {
    const view = await request.post("/api/workspace/post-metrics", {
      data: { slug: "java-core-notes", op: "view" },
    });
    expect(view.status()).toBe(200);
    expect(await view.json()).toMatchObject({ metric: { views: 143, likes: 31, liked: false } });

    const like = await request.post("/api/workspace/post-metrics", {
      data: { slug: "java-core-notes", op: "like" },
    });
    expect(await like.json()).toMatchObject({ metric: { views: 143, likes: 32, liked: true } });

    const likeAgain = await request.post("/api/workspace/post-metrics", {
      data: { slug: "java-core-notes", op: "like" },
    });
    expect(await likeAgain.json()).toMatchObject({ metric: { likes: 32, liked: true } });

    const unlike = await request.post("/api/workspace/post-metrics", {
      data: { slug: "java-core-notes", op: "unlike" },
    });
    expect(await unlike.json()).toMatchObject({ metric: { likes: 31, liked: false } });

    const unlikeAgain = await request.post("/api/workspace/post-metrics", {
      data: { slug: "java-core-notes", op: "unlike" },
    });
    expect(await unlikeAgain.json()).toMatchObject({ metric: { likes: 31, liked: false } });
  });
});

test.describe("workspace UI persistence", () => {
  test("dashboard stats reflect imported data and task edits survive reload", async ({ page }) => {
    await page.goto("/dashboard");

    const tasksCard = page.locator(".card").filter({ hasText: "TASKS" });
    await expect(tasksCard.locator(".font-mono.text-lg")).toHaveText("01/02");

    const streakCard = page.locator(".card").filter({ hasText: "STREAK" });
    await expect(streakCard.locator(".font-mono.text-3xl")).toHaveText("02");

    const row = page.locator(".group").filter({ hasText: "测试任务A" });
    const checkbox = row.getByLabel("标记完成");
    const putDone = waitForPut(page, "daily-tasks");
    await checkbox.click();
    await putDone;

    await page.reload();
    await expect(
      page.locator(".group").filter({ hasText: "测试任务A" }).getByLabel("标记未完成"),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(tasksCard.locator(".font-mono.text-lg")).toHaveText("02/02");
  });

  test("project todo toggle drives progress live, persists, and syncs detail page", async ({ page }) => {
    await page.goto("/projects");

    const card = page.locator("article").first();
    const progress = card.locator("span").filter({ hasText: /^\d+%$/ }).first();
    await expect(progress).toHaveText("40%");

    const putDone = waitForPut(page, "project-todos");
    await card.locator('button[aria-pressed]').first().click();
    await putDone;
    await expect(progress).toHaveText("20%");

    await page.reload();
    await expect(progress).toHaveText("20%");

    await page.goto("/projects/study-assistant");
    await expect(page.getByText("1/5")).toBeVisible();
    await expect(page.locator("span").filter({ hasText: /^\d+%$/ }).first()).toHaveText("20%");
  });

  test("article view/like counters persist through the local backend", async ({ page }) => {
    const viewsText = page.getByText(/^\d+ 阅读$/);
    const like = page.locator("button").filter({ hasText: "点赞" });

    const viewPost = page.waitForResponse(
      (r) => r.url().includes("/api/workspace/post-metrics") && r.request().method() === "POST",
    );
    await page.goto("/posts/nextjs-beginner-notes");
    await viewPost;

    const viewsBefore = parseInt((await viewsText.textContent()) ?? "0", 10);
    const likesBefore = parseInt((await like.textContent()) ?? "0", 10);

    const likePost = page.waitForResponse(
      (r) => r.url().includes("/api/workspace/post-metrics") && r.request().method() === "POST",
    );
    await like.click();
    await likePost;

    await expect(like).toHaveText(`${likesBefore + 1} 点赞`);
    await expect(like).toHaveAttribute("aria-pressed", "true");

    await page.reload();
    await expect(viewsText).toHaveText(`${viewsBefore + 1} 阅读`);
    await expect(like).toHaveText(`${likesBefore + 1} 点赞`);
    await expect(like).toHaveAttribute("aria-pressed", "true");
  });
});
