# Nox7th的博客 · Developer Workspace

基于 Next.js 的程序员个人工作台，将博客升级为「Developer OS」：工作台、知识库、项目、学习、成长、AI Center 与开发者工具一体化。

## 技术栈

- **框架**: Next.js 16 (App Router) + React 19 + TypeScript
- **样式**: Tailwind CSS v4
- **图标**: lucide-react
- **本机后端**: Next Route Handlers（`/api/workspace/*`）+ Node 内置 `node:sqlite`（工作台持久化，零新运行时依赖）
- **部署目标**: Node 服务器 / Vercel（工作台 API 需 Node 运行时）；Cloudflare 需先做 D1/KV adapter
- **后端规划**: Supabase（Auth / RLS / Storage，MVP 阶段暂未接入）

## 新增功能与改进

- **环境变量管理**: 新增 `.env.example` 模板，文档化所有必需/可选环境变量
- **Node.js 版本检查**: SQLite 原生模块需要 Node.js 22.6.0+，启动时自动校验并给出友好报错
- **AI 对话增强**: 
  - 更友好的错误提示（含文档链接）
  - 流式响应更稳健的 SSE 解析
  - 服务端 90s 超时保护
- **项目状态可视化**: 修复项目状态颜色，不同状态（规划/开发/测试/完成/归档）现有明显视觉区分
- **健康检查端点**: 新增 `/api/health` 用于监控部署状态（数据库连接、AI 配置）
- **PWA 支持**: 新增 `manifest.ts`，支持安装到桌面/移动端
- **安全增强**: 
  - 中间件添加安全头（CSP、X-Frame-Options、Referrer-Policy 等）
  - `robots.ts` 禁止爬虫访问管理页和 API
  - `next.config.ts` 禁用 `X-Powered-By` 头
- **SEO 优化**: 
  - 文章页新增作者、发布时间、标签等 OpenGraph/Twitter Card 元数据
  - 404 页新增站内搜索跳转
  - JSON-LD 结构化数据更完整
- **缓存策略**: AI 状态、GitHub 活动等 API 新增合理的 Cache-Control 头
- **错误边界**: 
  - 全局错误页 (`global-error.tsx`)
  - Markdown 渲染错误边界 (`MarkdownErrorBoundary`)
- **阅读量去重**: `PostEngagement` 组件新增 sessionStorage 防重复计数
- **TypeScript 严格模式**: `tsconfig.json` 包含 middleware 和 instrumentation

## 快速开始

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

```bash
npm run build   # 生产构建
npm run start   # 本地预览构建产物
npm run lint    # ESLint 检查
npm run typecheck  # TypeScript 检查
npm run check      # 一键 lint + typecheck + build
npm run test        # Playwright 冒烟 + 工作台持久化（自动 build + start:3100，使用独立测试库 data/test.db）
npm run test:ci     # CI 专用测试（line reporter）
```

## 页面结构

| 路由 | 说明 |
|------|------|
| `/` | 首页：精选文章、学习地图、统计 |
| `/dashboard` | 个人工作台：统计、今日任务（AI 规划/可编辑持久化）、项目进度聚合、GitHub 活动、技能画像、AI 推荐 |
| `/posts`, `/posts/[slug]` | 博客列表（搜索/筛选/置顶）与详情（TOC/高亮/点赞阅读量） |
| `/knowledge` | 知识库入口 + AI 生成博客草稿（本地模板） |
| `/projects`, `/projects/[slug]` | 项目中心（TODO 可勾选持久化）与项目详情（亮点/进度/GitHub） |
| `/learning` | 学习中心：路线图 + 算法练习 + 学习记录时间线（本地持久化） |
| `/growth` | 成长中心：技能画像（可调）+ 时间线（类型筛选） |
| `/profile` | 个人主页 |
| `/tools` | 开发者工具（JSON/Base64/时间戳/正则/UUID/URL/JWT/颜色/哈希/Markdown/SQL/Cron/HTML） |
| `/functions` | 函数速查 |
| `/ai` | AI 中心入口 |
| `/ai/models` | AI 模型中心 |
| `/ai/agents` | AI Agents 角色卡片 |
| `/ai/prompts` | 提示词库（搜索/复制/收藏/本地新建） |
| `/archive`, `/notes`, `/notes/[slug]`, `/tags/[tag]` | 归档、笔记地图（支持搜索）、笔记详情（Markdown）与标签 |
| `/rss.xml` | RSS 订阅 |

## 目录结构

```
app/                  # App Router 页面
app/api/workspace/    # 工作台本地后端（域状态 GET/PUT/POST + 一次性导入）
app/api/ai/           # AI 代理聊天与状态
app/api/github/       # GitHub 活动代理
app/api/health/       # 健康检查端点
components/           # 共享组件（SiteHeader、PostCard、CodeBlock、交互卡片等）
lib/                  # 静态数据与工具函数
  posts.ts            # 博客文章数据（含 draft/status）
  functions.ts        # 函数速查数据
  growth.ts           # 技能、成长时间线与学习记录数据（种子/连续天数计算）
  projects.ts         # 项目详情数据 + 项目进度推算
  prompts.ts          # 提示词种子数据
  workspace/          # 工作台域类型 + 客户端共享 store（useWorkspace）
  server/             # node:sqlite 存储层（lib/server/db.ts）
data/                 # 本机 SQLite 库 data/workspace.db（git 忽略）
supabase/schema.sql   # 后端表结构 + RLS（待接入）
.env.example          # 环境变量模板（密钥不进仓库）
middleware.ts         # 安全头与 CSP
instrumentation.ts    # 启动时监控与错误捕获
plans/                # 分析、架构与路线图
```

## 数据说明

MVP 内容以静态数据（`lib/*.ts`）为主；交互状态（今日任务、项目 TODO、路线掌握、算法进度、学习记录、技能等级、提示词收藏、文章阅读/点赞）保存在**本机后端**：`/api/workspace/*` Route Handlers + `node:sqlite` 单文件库 `data/workspace.db`（git 忽略，可用 `WORKSPACE_DB_PATH` 覆盖路径）。首次访问时浏览器把旧 localStorage 数据一次性导入（`POST /api/workspace/import`，库已初始化则返回 409 幂等拒绝，不会覆盖新数据）。无 API Key 进前端。真实密钥接入时使用 Supabase 服务端/Edge Function，前端绝不直接暴露敏感信息。参考 `supabase/schema.sql` 与 `.env.example`。

站点 URL 读取 `NEXT_PUBLIC_SITE_URL`（见 `lib/site.ts` 与 `.env.example`）；未配置时回退 `https://example.com`，部署前请替换。

## 部署（Cloudflare Pages / Node）

> ⚠️ 工作台持久化依赖 Node 运行时（`node:sqlite`）。部署到 Node 服务器 / Vercel 可直接工作；部署到 Cloudflare Workers 前需把 `lib/server/db.ts` 换成 D1/KV adapter（未实现），届时博客等静态功能不受影响。

纯 Next.js SSR 需配合 [OpenNext](https://opennext.js.org/cloudflare) 适配器：

```bash
npm install --save-dev @opennextjs/cloudflare
# 按 OpenNext 文档配置 open-next.config.ts 后：
npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy
```

或部署到 Vercel / Node 服务器：`npm run build && npm run start`。

1. 推送仓库到 GitHub
2. 配置 `NEXT_PUBLIC_SITE_URL` 为真实域名（`lib/site.ts` 统一读取；已替换 sitemap / robots / layout / RSS 中的硬编码）

### 本地验证

```bash
npm run lint && npm run typecheck && npm run build
npm run start   # 验证 /rss.xml、移动端菜单、工作台持久化
npm test        # Playwright 21 用例（SEO 冒烟 + 交互 + 工作台后端/持久化）
```

## 功能特性

- 工作台 / 知识库 / 项目 / 学习 / 成长 / 个人主页
- AI 模型中心与提示词库
- 开发者工具（浏览器端，数据不上传）
- 深空 HUD 暗色主题 + 全站氛围背景（星野 / 极光 / 透视地平线 / 光标聚光）
- 工作台数据本机持久化（跨刷新 / 跨重启，旧 localStorage 首访自动迁移）
- 移动端汉堡菜单与高亮当前路由
- SEO：各页 metadata、sitemap、robots、RSS（`/rss.xml`）、Article JSON-LD
- 全局 loading / error 边界
- 安全：CSP、安全头、Referrer-Policy、无 X-Powered-By
- PWA：manifest 支持安装
- 监控：健康检查端点、启动时错误捕获

## License

MIT
