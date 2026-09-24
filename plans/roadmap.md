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
- 🔄 Markdown 渲染支持（`lib/markdown.ts` 解析器 + Notes 详情已接入；博客正文铺路）
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

## 建议下一轮

- ⬜ 博客正文接入 `lib/markdown.ts`（posts/[slug] 若干内容源仍为结构化 sections）
- ⬜ 真实域名替换（配置 NEXT_PUBLIC_SITE_URL）+ Supabase 环境变量 + Cloudflare 部署（Phase 14）
- ⬜ 安全面 RLS 用例、（可选）Playwright 冒烟
- ⬜ 需要你提供：真实域名、是否接 Supabase/GitHub token
