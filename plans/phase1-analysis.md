# Phase 1 · 现有项目分析报告

> 分析时间：2026-09-24 · 模式：只读，不修改代码

## 1. 技术栈

| 类别 | 选型 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router, Turbopack) | 16.3.0 |
| UI | React | 19.2.8 |
| 语言 | TypeScript (strict) | ^5 |
| 样式 | Tailwind CSS | v4 |
| 图标 | lucide-react | ^1.47.0 |
| 构建 | next build / Turbopack | — |
| Lint | ESLint + eslint-config-next | ^9 / 16.3.0 |
| 部署规划 | Cloudflare（wrangler.toml 已有，需 OpenNext） | — |

**无**：测试框架、状态管理库、CSS-in-JS、Markdown 渲染库、HTTP 客户端。

## 2. 目录结构

```
app/                    # App Router 页面（17 个 page）
  page.tsx              # 首页
  layout.tsx            # 根布局 + SEO + 主题脚本
  dashboard/            # 工作台
  posts/, posts/[slug]/ # 博客列表/详情
  knowledge/, notes/    # 知识库入口 / 笔记地图
  projects/             # 项目中心
  learning/             # 学习中心
  growth/               # 成长中心
  profile/, about/      # 个人主页 / 关于
  tools/                # 开发者工具（client）
  functions/            # 函数速查
  ai/models/, ai/prompts/  # AI Center（缺 Agents）
  archive/, tags/[tag]/ # 归档 / 标签
  rss.xml/, sitemap.ts, robots.ts, icon.svg
  loading.tsx, error.tsx, not-found.tsx
components/             # 6 个共享组件
lib/                    # 3 个静态数据模块
plans/                  # 本计划目录（新建）
public/                 # create-next-app 默认 SVG
```

## 3. 现有功能清单

### 已完成（可复用）
- **博客**：13 篇硬编码文章、列表/详情/标签/归档、PostCard、CodeBlock（复制）
- **工作台**：统计、今日任务（静态）、技能条、快捷操作、AI 推荐文案
- **项目中心**：3 个项目卡片、状态/进度/TODO/技术栈
- **学习中心**：4 路线图 + 12 类算法进度
- **知识库**：6 入口卡片 + 笔记地图（关联 posts）
- **AI Center**：Models（6 模型）、Prompts（分类+热门，无交互 CRUD）
- **工具箱**：JSON / Base64 / 时间戳 / 正则 / UUID（纯浏览器端）
- **成长**：8 技能 + 8 时间线事件
- **个人主页**：简介、统计、技能、文章、项目、联系方式
- **UI/UX**：Light/Dark（localStorage）、移动汉堡菜单、路由高亮、卡片式布局
- **SEO**：全站 metadata、sitemap、robots、RSS、OG/Twitter
- **健壮性**：loading / error / not-found、lint+typecheck+build 全绿（54 页）

### 数据结构（静态）
```ts
// lib/posts.ts
Post { slug, title, excerpt, date, category, tags[], readTime, author, featured?, sections[{heading?, paragraphs[]}] }

// lib/growth.ts
Skill { name, level, color, category }
GrowthEvent { id, date, type, title, description, tags[] }

// lib/functions.ts
FunctionCard { id, name, signature, category, description, example, note?, tags[], language, created }
```

## 4. 后端 / 数据库 / 认证 / 编辑器 / 上传 / API

| 检查项 | 状态 |
|--------|------|
| 后端连接 | ❌ 无（纯静态数据） |
| 数据库 | ❌ 无 |
| 认证系统 | ❌ 无 |
| Markdown 编辑器 | ❌ 无（文章为 sections 结构，非 MD） |
| 图片/文件上传 | ❌ 无 |
| API Routes | ❌ 无（仅 RSS route handler） |
| 环境变量 | ❌ 无 .env |

## 5. 存在问题

1. **内容不可编辑**：所有数据硬编码，无草稿/发布/后台
2. **博客非 Markdown**：sections 结构限制排版、代码高亮未接入正文、无 TOC/搜索/点赞/评论
3. **AI Center 不完整**：缺 Agents 页；Prompts 无新建/编辑/一键复制交互闭环
4. **工具箱不全**：缺 URL/JWT/Color/Markdown/SQL/Hash/Cron/HTML 等
5. **学习/成长不可交互**：无法勾选掌握、修改技能、记录错题
6. **Dashboard 静态**：任务/推荐不可操作，无 GitHub 活动
7. **无权限模型**：无 Guest/User/Admin 概念
8. **无 Supabase**：RLS/Auth/Storage 均未接入
9. **知识库与博客未打通**：无「AI 生成博客」链路
10. **导航扁平**：11 项平铺，缺二级结构（Blog/AI/Learning 子菜单）
11. **无测试**：0 个 test/spec 文件
12. **dev-server.log 应 gitignore**

## 6. 可复用组件 / 模块

| 资产 | 复用方式 |
|------|----------|
| SiteHeader / ThemeToggle | 扩展为分组导航 + 登录入口 |
| PostCard / CodeBlock | 博客升级核心 |
| 全站卡片样式模式 | 统一 UI 体系 |
| lib/posts.ts 类型 | 迁移为 DB schema 参考 |
| tools 页面模式 | 扩展工具箱 |
| growth skills | 改为可编辑 + 持久化 |
| loading/error/not-found | 已全局覆盖 |
| sitemap/rss/robots | 部署即用 |

## 7. 改造方案（总原则）

```
保留现有功能 → 重构结构 → 扩展功能 → 优化 UI → 接入后端
```

- **不推倒重写**；现有 17 个路由全部保留
- 数据层：`lib/*.ts` → 抽象为 `lib/types.ts` + 静态 adapter → 后续 Supabase adapter（同接口）
- 交互升级优先用 **localStorage** 做 MVP 持久化，Supabase 就绪后无缝切换
- UI 在现有 Tailwind 卡片体系上深化，不引入组件库
