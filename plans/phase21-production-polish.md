# Phase 21 · 生产级完善 — 关键修改说明

> 目标：在既有 Next.js 16 + React 19 + Tailwind v4 技术栈上，补齐核心功能与缺失模块、修复真实缺陷、统一视觉与交互，达到生产级。技术栈保持一致，全部改动为增量、可直接运行。

## 一、新增核心模块

### 1. 全局搜索 `/search`
- `lib/search.ts`：统一搜索索引构建器（服务端）+ 纯过滤函数（客户端）。覆盖**文章**（标题/摘要/分类/标签/正文）、**笔记**（标题/摘要/分组/标签/正文）、**函数速查**（名称/签名/描述/示例/标签）。
- `app/search/page.tsx`：服务端组件，用 `readDomain("blog-posts")` 合并用户文章，`buildSearchIndex` 建索引；`export const dynamic = "force-dynamic"`；`<Suspense>` 包裹（`useSearchParams` 需要）。
- `components/SearchView.tsx`：客户端实时过滤、`<mark>` 命中高亮、按「文章/笔记/函数」分组计数、空态引导、`?q=` 深链、`Esc` 清空。
- 入口：页头搜索图标、命令面板「全局搜索」页项 + 无匹配时「在全局搜索中查找」兜底、`not-found` 表单改指向 `/search`。

### 2. 设置与数据中心 `/settings`
- `components/SettingsView.tsx` + `app/settings/page.tsx`：
  - **数据概览**：按域记录数卡片（复用 `/api/workspace/export`）。
  - **环境状态**：AI 模型服务（`/api/ai/status`，不泄露 Key）、GitHub 账号（`/api/github/events`）、站点地址（`window.location.origin`）。
  - **数据迁移**：导出 JSON 快照（编程式下载）；导入/恢复（上传备份 → 逐域 `PUT /api/workspace/[domain]`，覆盖前明示）。
  - **危险区**：清空自定义文章（`PUT blog-posts []`，二次确认）。

## 二、交互细节（全局）
- `components/ReadingProgress.tsx`：顶部阅读进度条，接入文章/笔记详情页。
- `components/BackToTop.tsx`：滚动后浮现的返回顶部按钮。
- `components/KeyboardHelp.tsx`：`?` 键快捷键帮助弹层（⌘K / ? / Esc / /）。
- 三者挂载于 `app/layout.tsx`；页脚补「搜索/设置」入口。

## 三、构建阻断与真实缺陷修复
- `app/manifest.ts`：`purpose: "any maskable"` → `"maskable"`（修复类型错误）。
- `components/ai/AiChat.tsx`：错误态统一为 `{ message, docs }` 结构，修复 catch 里类型转换丢失 `docs` 的问题。
- `app/page.tsx`：JSX 文本以 `//` 开头触发 `react/jsx-no-comment-textnodes`，改写为 `{"//"}`。
- `app/not-found.tsx`：服务端组件误用 `onKeyDown`（运行时会报错）→ 原生 GET 表单；`global-error.tsx` 补 `globals.css` 导入。
- `middleware.ts` → `proxy.ts`（Next 16.3 弃用警告消除），同步更新 `tsconfig.json`。
- **死代码**：删除无引用的 `HeroNebula.tsx` / `HeroOrbital.tsx` / `RadarSweep.tsx`。
- **`PostEngagement`**：阅读量重复计数（sessionStorage 已标记仍发 view）+ `setTimeout` 泄漏 + 圆角越界，整体重写。
- **`DashboardFocus`（新）**：dashboard `?focus=` 深链，恢复命令面板 4 个「动作」的可用性（此前参数全部失效）。
- 其余：`PostCard` 阴影越界、`GitHubActivity` 硬编码 `github.com`、`PageHeader` code 渲染、`PromptLibrary` 定时器泄漏与圆角、`SkillLevels`/`AlgorithmProgress`/`ProjectList`/`ProjectTodos`/`Telemetry`/`WeekOverview`/`LearningRoadmap`/`lib/growth.ts` 等 15+ 处。

## 四、设计系统统一
- **按钮尺寸覆盖类失效问题**：实测构建产物 CSS，`.btn-primary`（层序靠后）会覆盖 `.px-4/.py-2/.text-xs`，导致这些"尺寸微调"全是死代码。批量清理，并在 `globals.css` 补 `.btn-sm` / `.btn-xs` 变体。
- **圆角规整**：以「直角 + 圆点/ spinner 例外」为准则，脚本化批量移除徽标/进度条/卡片的 `rounded-*`。
- **`EmptyState`**：新增可选 `icon` 属性（向后兼容），供搜索/设置等空态复用。
- 日期格式、`PageHeader` 用法、配色（单一 accent `--wire`）全站对齐。

## 五、验证
```
npm run lint       # ✅ 0 error
npm run typecheck  # ✅ 0 error
npm run build      # ✅ Compiled successfully（/search、/settings 路由生成）
npm test           # ✅ 29/29 Playwright（既有 27 零回归 + 新增 2 用例）
```
> 注：Playwright 用例要求全新测试库；`playwright.config.ts` 每次运行前会重置 `data/test.db` 并重建+启动生产服务器（端口 3100）。在受安全垫层限制的环境里，构建步骤需在沙箱外执行。

## 六、运行
```bash
npm run dev      # 开发
npm run build && npm run start   # 生产
```
新路由：`/search`（全局搜索）、`/settings`（设置与数据中心）。
