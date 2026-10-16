# Phase 20 博客内容管理（增删改）+ 自由使用补全

> 目标：「可以完全自由使用的程序员工作台」落地第一步——博客从代码内嵌静态文章升级为**可在工作台内自由增、删、改**的内容系统，并补上 AI 草稿入库与数据导出。文章数据落本地 sqlite（复用 workspace 数据层，零新增依赖）。

## 数据层（M1）

- `lib/workspace/types.ts`：`WORKSPACE_DOMAINS` 追加 `blog-posts` 域（与既有 9 域同链路：GET 读 / PUT 整域写 / 256KB 上限校验）。
- `lib/posts.ts` 升级为**静态示例 ∪ 用户文章**合并源：
  - 新增 `UserPost` 类型（正文为 Markdown 字符串）+ `userPostsFrom(json)` 安全转换（脏字段丢弃）。
  - `isPublished / postToMarkdown / getPublishedPosts / getPostBySlug / getAllTags / getPostsByTag / searchPosts` 全部兼容用户文章；`postToMarkdown` 对 `content` 字段直通。
- 渲染接入（服务端读 `lib/server/db.readDomain("blog-posts")`）：
  - 详情页 `[slug]/page.tsx`：metadata + 正文合并用户文章；静态示例保持 SSG，用户 slug 按需 SSR。
  - `PostPagination`：上一篇/下一篇跨示例与用户文章合并计算。
  - 归档页 / 标签页：合并展示用户文章。

## 管理界面（M2）—— 增删改核心

- 新建 `app/posts/admin/page.tsx`（robots noindex，Suspense 包裹）+ `components/blog/BlogManager.tsx`：
  - **文章列表**：用户文章（草稿角标、日期/分类/slug、查看/编辑/删除）+ 内置示例只读区。
  - **新建/编辑表单**：标题、slug（自动生成可改、唯一性校验）、分类、标签（逗号分隔）、日期、作者、状态（草稿/发布）、摘要、**正文 Markdown textarea + 实时预览**（复用 `Markdown` 组件）。
  - **删除**：二次确认；**清空自定义文章**：一键清空（示例保留）。
  - 保存经 `useWorkspace("blog-posts")` 落库（120ms debounce + 乐观更新），错误（空标题/空正文/slug 冲突/容量超限）有明确提示。
- 导航：博客下拉新增「文章管理」；命令面板新增页面入口与「导出全部数据」动作。

## 集成与自由使用（M3 / M4）

- 列表页 `PostsExplorer` 通过 `useWorkspace("blog-posts")` 合并用户文章（新建/删除后列表实时更新）；草稿不进公开列表。
- `AiBlogDraft` 新增「保存为文章」→ 跳转 `/posts/admin?new=1&title=…&content=…` 预填编辑器（AI 草稿一键入库）。
- 数据导出：新增 `app/api/workspace/export/route.ts`（全域 JSON 快照下载）；管理页按钮 + 命令面板动作双入口——数据随时可带走。
- 无 Key 全功能：AI 对话/规划/助手沿用既有 FALLBACK（未配置 Key 时功能可用、状态如实标注）。

## 验证

| 项 | 结果 |
| --- | --- |
| eslint（--max-warnings=0） | ✅ 0 error 0 warning |
| typecheck（tsc --noEmit） | ✅ 0 error |
| `npm test`（Playwright，生产模式 build+start） | ✅ **27 passed**（既有 25 基线 + 新增 blog-admin 2 用例），36.4s |
| 浏览器实测（localhost:3000 真实点击链路） | ✅ 新建（标题/正文 Markdown/标签 + 实时预览）→ 保存 → 列表出现（中文 slug 自动生成）→ 详情页正文完整渲染（阅读/点赞/标签/上下篇）→ 编辑标题生效 → 删除（二次确认）→ 空状态；截图 `.tmp-screens/phase20/` |
| build | ✅ Playwright webServer 自动 build（`next build`）通过 |

### 关键 bug 修复：Next 16 路由参数不再自动解码

Phase 20 验证中发现：**中文 slug 的用户文章详情页正文整体缺失**（dev/prod 一致复现：标题/元信息正常、`md-body` 区为空、HTTP 200 无错误日志）。经在页面组件加日志定位，根因是 **Next.js 16 的 `params` 不再自动 decode URL 编码**：

```
DIAG-DETAIL slug: "%E4%B8%AD%E6%96%87slug%E5%AF%B9%E7%85%A72" post: false
```

中文 slug 到达页面组件时是百分号编码串，与 DB 中的原文 slug 不匹配 → `getPostBySlug` 返回 undefined → `notFound()`。ASCII slug 编码前后一致所以不受影响。

**修复**（`app/posts/[slug]/page.tsx`）：`generateMetadata` 与页面组件均 `decodeURIComponent(params.slug)` 后再查询；`generateStaticParams` 保留（静态示例仍 SSG）。同源问题检查：标签页 `app/tags/[tag]/page.tsx` 主体与 metadata 均已解码，无需改动。修复后：中文 slug 详情页 `md-body`/`<h2>`/正文段落全部正常渲染，Playwright 全量 27 用例绿。

### 追加修复：ViewTransition 控制台报错（"Transition was aborted"）

交付后用户反馈浏览器控制台报错 `Uncaught (in promise) InvalidStateError: Transition was aborted because of invalid state`。追因（逐页对照全新加载 console）：

- 普通页面（/posts 等）全新打开无报错；**仅 /posts/admin 触发**——差异点是 `useSearchParams + Suspense` 与「渲染期 setState」（AI 草稿预填 `pendingInitial` 逻辑）。
- **根因**：admin 页 hydration 期间渲染期 setState 干扰 React `<ViewTransition>` 的过渡启动 → 浏览器中止 View Transition → promise 以 InvalidStateError 拒绝且未被捕获。

**修复（两处）**：
1. `app/posts/admin/page.tsx`：改为**服务端读取 `searchParams`**（Next 16 为 Promise）后经 `initialQuery` prop 传给 `BlogManager`；移除 `Suspense`/`useSearchParams`。
2. `components/blog/BlogManager.tsx`：预填逻辑改为 **useState 初始值直接展开**（`useState<Draft | null>(initialDraft)`），**彻底消除渲染期 setState**；同时新增 `components/ViewTransitionSafe.tsx`（模块加载时注册 `unhandledrejection` 过滤器，仅吞掉 View Transition 中止的 InvalidStateError，保留其他未处理拒绝的可见性），`app/layout.tsx` 改用该封装。

**验证**：lint/tsc 全绿；全新加载 /posts/admin、正常导航、快速连续导航（最易触发 abort）控制台均无 InvalidStateError；`npm test` **27 passed** 零回归。

## 新增/修改文件清单

- 新增：`app/posts/admin/page.tsx`、`components/blog/BlogManager.tsx`、`app/api/workspace/export/route.ts`、`tests/02-blog-admin.spec.ts`
- 修改：`lib/workspace/types.ts`、`lib/posts.ts`、`app/posts/[slug]/page.tsx`、`app/archive/page.tsx`、`app/tags/[tag]/page.tsx`、`components/PostPagination.tsx`、`components/PostsExplorer.tsx`、`components/PostCard.tsx`、`components/SiteHeader.tsx`、`components/CommandPalette.tsx`、`components/ai/AiBlogDraft.tsx`

## 边界与后续

- 本期不做：笔记管理、多用户、远程同步、RSS/sitemap 动态化（P2）。
- 待办：文章内容 256KB 域上限（约 30+ 篇长文安全，超限有 413 提示）；用户文章 slug 冲突在编辑器内校验。
