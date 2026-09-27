# Developer OS · 总路线图

> 原则：保留 → 重构 → 扩展 → 优化 → 接后端  
> 状态图例：✅ 已完成 · 🔄 进行中 · ⬜ 未开始

## Phase 1 分析 ✅
- 输出：`plans/phase1-analysis.md`

## Phase 2 架构设计 ✅
- 输出：`plans/phase2-architecture.md`（IA / 路由 / Schema / API / 权限 / UI）

## Phase 3 Dashboard 改造 ✅
- ✅ 统计、任务、技能、快捷操作、AI 推荐
- ✅ 任务可勾选、增删、持久化（localStorage）
- ✅ GitHub 活动卡片（mock，待 API）、「AI 规划今天」入口（本地模板）
- ✅ 项目/学习进度聚合组件复用（ProjectProgressSummary）

## Phase 4 Blog 升级 ✅ 重点本迭代
- ✅ 搜索（标题/标签/正文/分类）
- ✅ 分类筛选 + 置顶/精选标记展示
- ✅ 文章 TOC（从 sections 生成 + 滚动高亮）
- ✅ 正文代码高亮接入（CodeBlock 语法着色 + 行号）
- ✅ 草稿概念（status: draft/published，列表/详情/RSS/Sitemap 过滤）
- ✅ 阅读量/点赞/分享（localStorage 计数）
- ✅ Markdown 渲染统一（`lib/markdown.ts` 解析器 + `Markdown` 组件；Notes 与博客正文共用管线，代码块经 CodeBlock 高亮，h2/h3 带锚点供 TOC）
- ⬜ 收藏/评论（后期）

## Phase 5 Projects ✅
- ✅ 列表、状态、进度、TODO
- ✅ TODO 可勾选持久化（localStorage）
- ✅ 项目详情页 /projects/[slug]（长描述、亮点、进度、GitHub/Demo、TODO 摘要）

## Phase 6 Learning ✅
- ✅ 路线图、算法分类进度
- ✅ 掌握状态可切换（localStorage）
- ✅ 算法进度 +/− 可编辑（localStorage）
- ✅ 学习记录 study_records 时间线（增删 + 本地持久化）

## Phase 7 Knowledge ✅ 入口 + AI 草稿流 + 笔记搜索 + 笔记详情
- ✅ 入口卡片、笔记地图
- ✅ 「AI 生成博客」本地模板草稿（复制/下载 .md）
- ✅ 笔记地图搜索（分组/文章过滤 + 空状态）
- ✅ 笔记详情 /notes/[slug]（SSG 4 篇，Markdown 渲染 + 相关文章 + metadata）
- ⬜ 笔记 Markdown 编辑器
- ⬜ 收藏（后期）

## Phase 8 AI Center ✅ 本迭代
- ✅ Models 列表与费用概览
- ✅ Prompts：搜索、分类、一键复制、收藏、本地新建/删除
- ✅ Agents 页面 + /ai 中心导航
- ✅ API Key「仅服务端」说明与 .env.example 占位

## Phase 9 Developer Tools ✅ 本迭代
- ✅ JSON / Base64 / Timestamp / Regex / UUID
- ✅ URL Encode、JWT Decoder、Color、Hash、Markdown Preview、SQL Formatter、Cron、HTML Formatter

## Phase 10 Growth ✅ 基础 + 本迭代
- ✅ 技能条、时间线
- ✅ 技能 level 可编辑持久化（±5%）
- ✅ 时间线筛选（按 type）

## Phase 11 Profile ✅

## Phase 12 UI/UX 统一 ✅ 分组导航 + 视觉走查 + 设计系统
- ✅ Dark mode、移动导航、metadata、loading/error
- ✅ Empty 状态组件（EmptyState）
- ✅ 分组导航（博客 / AI 中心 下拉 + 移动端分组缩进）
- ✅ 视觉走查 375/768/1280（8 页截图）：笔记表格横向滚动、首页精选补位、笔记去重复 H1、Tools 移动端横向工具条、任务列表去重复圆点、学习记录表单/删除按钮移动端适配
- ✅ 设计系统统一：globals.css `card`/`btn-primary`/`btn-secondary`/`page-*`/`input-base` utilities、PageHeader 组件、导航 active pill、页脚 chips、首页 hero 网格渐变、focus-visible、页面淡入
- 🔄 蓝图工作台重设计（工程蓝图/终端风，亮暗双套）：
  - ✅ 第一轮「首页 + 全局框架」：双模式 token（ink/panel/wire/signal/print/hair + 蓝图网格底）、4px 圆角 hairline 卡片替代阴影胶囊、mono 括号导航激活态 `[/工具]`、`//` 区块规则线、首页 TITLE BLOCK 图纸标题栏、页脚状态栏（ONLINE 指示）、PostCard/EmptyState 同步
  - ✅ 第二轮「逐页深度重排」：dashboard（SectionRule 共享组件、任务/活动/进度聚合）、tools 13 工具（code-panel 输出面板、侧栏 mono 激活态、修复 CronTool/JwtDecoder 渲染期 setState 死循环）；全站样式清扫（卡片/按钮/筛选/搜索框→token utilities、sky 强调→wire、旧色输入框→input-base、rounded-xl/lg→4px、正文管线 markdown.ts 引用/表格/inline code/链接→wire+hairline）；growth/projects/分类色统一 wire（语义色保留：状态/点赞/删除/CodeBlock 语法高亮）
  - ✅ 逐页截图验收（暗 21 页 + 亮 3 页 + 375 移动 4 页）：全绿；修复 functions 页双层 grid 嵌套布局破损 + 隐藏空分类
  - ⬜ 已知遗留（功能向，非视觉）：functions 页搜索框不过滤、`?category=` 链接无效果、archive 分类标签 "JAVA" 全大写中英混排待定

## Phase 13 测试 🔄 部分
- ✅ 关键路由 smoke（20 条路由 200 + build 63 页）
- ✅ SEO meta 抽查（title/description/og/canonical/RSS link/lang）
- ✅ RSS 内容校验（item + CDATA）、sitemap 含 posts/projects/notes
- ✅ 统一 `lib/site.ts` BASE_URL（NEXT_PUBLIC_SITE_URL，sitemap/robots/layout/RSS 已接入）
- ✅ 响应式：375 / 768 / 1280 截图走查（8 页 × 3 断点）+ 问题修复
- ⬜ 安全面：无密钥进前端、后续 RLS 用例
- ⬜ （可选）Playwright 冒烟

## Phase 14 部署 🔄
- ✅ wrangler.toml、OpenNext 文档、README
- ✅ supabase/schema.sql + .env.example
- ⬜ 替换 example.com 为真实域名
- ⬜ 接入 Supabase 环境变量
- ⬜ Cloudflare 实际部署与 HTTPS/域名

## 后端接入（横切，Phase 15+）
- ✅ Supabase schema 落盘（`supabase/schema.sql`）
- ⬜ Auth 登录/注册 + 角色
- ⬜ lib 数据层 adapter 化（static → supabase）
- ⬜ RLS 策略上线（schema 内已写策略，待连库验证）
- ⬜ Edge Functions：AI 整理/生成博客
- ⬜ GitHub API 只读集成（Dashboard 已有 mock 卡片）

---

## 本轮执行优先级（优化程序）— 已完成

1. ✅ **P0** Blog：搜索、分类筛选、TOC、详情代码高亮、置顶展示、点赞/阅读量（本地）、草稿过滤
2. ✅ **P0** AI Agents 页 + /ai 中心 + Prompt 一键复制/收藏/本地新建
3. ✅ **P0** Tools 补全（URL/JWT/Color/Hash/Markdown/SQL/Cron/HTML）
4. ✅ **P1** Learning/Growth/Dashboard/Projects 交互持久化（localStorage）
5. ✅ **P1** Knowledge AI 生成博客草稿流（本地模板）+ supabase/schema.sql + .env.example
6. ✅ **P2** 分组导航、项目详情、学习记录时间线、笔记搜索、Dashboard GitHub/AI 规划/项目进度聚合、README/计划同步

## 本迭代（1、2 部分）— 已完成

1. ✅ **视觉走查 + 响应式 375/768/1280**（8 页截图、6 处修复）
2. ✅ **Notes Markdown 详情页**（`lib/markdown.ts` + `/notes/[slug]` SSG）；博客 Markdown 正文接入标为 🔄 铺路完成

## 站点质量优化（S1–S6）— 已完成

1. ✅ **S1 SEO**：21 页 canonical/og:url 自指修复（`lib/site.ts` `pageMeta()` helper + RSS types 合并防顶掉）、补 `/` `/tools` `/tags/[tag]` metadata、title 双后缀修复（functions/文章页）、WebSite+Article JSON-LD、`public/og.png`（1200×630，后随重设计改为 HUD 风，Playwright 渲染）+ og:image/twitter:image、sitemap 补 notes/tags（56 条）；断言脚本 56/56 绿（`C:\Users\lsj\AppData\Local\Temp\opencode\assert-seo.ps1`）
2. ✅ **S2 UI 遗留**：functions 搜索过滤（新 `FunctionsExplorer`，Suspense+useSearchParams）+ `?category=` 生效（FILTER 条/单分类/bogus 忽略）+ 空态清空；archive `JAVA` 大写混排去除；`FunctionSearchInput.tsx` 删除
3. ✅ **S3 性能**：perf 基线（首页/工作台/文章 total 104–115ms）；tools 页拆分 13 个工具模块（`components/tools/*`），12 个 `next/dynamic` 按需加载（点击 tab 才拉 chunk，初始 -12KB）；`GitHubActivity` 转 server 组件（唯一 0-hook client）
4. ✅ **S4 代码质量**：删 3 个死导出（`getAllCategories`/`getAllLanguages`/`getFunctionsByCategory`）；RegexTester 匹配 token 收敛 `.chip`；发现并修复既有 bug：`.input-base{width:100%}` 覆盖 `w-16` 致正则 flags 框 664px（改 `w-16!`）
5. ✅ **S5 a11y**：skip-link（Tab→焦点可见→Enter→`#main-content`）+ 24 个 `<main>` 加 id/tabIndex；accessibility 树 4 页走查（landmark/label 齐全）；8 页无名控件扫描全 0
6. ✅ **S6** Playwright 冒烟：`@playwright/test` + chromium，`npm test`（build+start:3100）14/14 绿——SEO canonical×7、Article JSON-LD、sitemap、functions 搜索/分类、tools 切换+正则、skip-link、暗色画布渲染（无 `.dark` 类 + body 背景断言）

> 每阶段 lint / typecheck / build 三件套全绿；截图证据走查后已清理（`.tmp-screens/`）

## 深空 HUD 整站重设计 — 已完成

1. ✅ **设计令牌**：`app/globals.css` 单一暗色主题（`#070b12` 底 / `#5ce1ff` 唯一强调 / `#ffb454` 遥测 / `#ff5c5c` 告警 / `--hair` 发丝线）+ 锐角 utility（仅圆点/头像留圆）+ `@custom-variant dark` 惰性保留（`ThemeToggle` 删除）
2. ✅ **身份统一 Nox7th**：layout/README/RSS/profile 全量替换，头像字形 `林`→`N`，icon.svg reticle 化
3. ✅ **全站迁移**：35 个 app 文件 + 28 个组件 + `lib/markdown.ts` 渲染层 ~250 处 slate/white/dark/圆角/阴影 → 令牌；CodeBlock 语法高亮按令牌重调；移除文本箭头与括号导航（保留方向性配对例外）
4. ✅ **氛围组件**：`ScrambleText`（解码动效）/ `RadarSweep`（雷达）/ `Telemetry`（遥测）；首页 hero 重写、页眉/分区线/PostCard/EmptyState 重写
5. ✅ **修缺陷**：dashboard 375px 横向溢出（`min-w-0`）、左右列空洞重平衡、tasks 计数 3/3→1/3 与面板一致、GitHubActivity `//` 前缀与 `[ 打开 GitHub ]`
6. ✅ **验证**：lint / typecheck / build 全绿，`npm test` 14/14，10 路由 × 桌面/移动 DOM 验证 ALL PASS，20 张截图视觉自评通过
7. ✅ **氛围背景升级**：新 `AmbientBackground`（fixed `-z-10`，全站）——星野 canvas（120–160 星 + 流星、dpr≤2、后台暂停）+ 极光漂移（wire/signal 双色）+ 透视地平线网格（向观者流动）+ 光标聚光 + 暗角；点阵网格迁入并做滚动视差；reduced-motion 全静态、粗指针关聚光、移动端缩量；lint/typecheck/build/14 测试全绿

## 建议下一轮

- ⬜ 真实域名替换（配置 NEXT_PUBLIC_SITE_URL）+ Supabase 环境变量 + Cloudflare 部署（Phase 14）
- ⬜ 安全面 RLS 用例
- ⬜ 需要你提供：真实域名、是否接 Supabase/GitHub token
