# Nox7th的博客 · Developer Workspace

基于 Next.js 的程序员个人工作台，将博客升级为「Developer OS」：工作台、知识库、项目、学习、成长、AI Center 与开发者工具一体化。

## 技术栈

- **框架**: Next.js 16 (App Router) + React 19 + TypeScript
- **样式**: Tailwind CSS v4
- **图标**: lucide-react
- **部署目标**: Cloudflare Pages（静态导出友好）
- **后端规划**: Supabase（Auth / RLS / Storage，MVP 阶段暂未接入）

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
components/           # 共享组件（SiteHeader、PostCard、CodeBlock、交互卡片等）
lib/                  # 静态数据与工具函数
  posts.ts            # 博客文章数据（含 draft/status）
  functions.ts        # 函数速查数据
  growth.ts           # 技能、成长时间线与学习记录数据
  projects.ts         # 项目详情数据
  prompts.ts          # 提示词种子数据
supabase/schema.sql   # 后端表结构 + RLS（待接入）
.env.example          # 环境变量模板（密钥不进仓库）
plans/                # 分析、架构与路线图
```

## 数据说明

MVP 内容以静态数据（`lib/*.ts`）为主；点赞/阅读量、任务、学习进度、提示词收藏等交互状态保存在浏览器 localStorage。无 API Key 进前端。真实密钥接入时使用 Supabase 服务端/Edge Function，前端绝不直接暴露敏感信息。参考 `supabase/schema.sql` 与 `.env.example`。

站点 URL 读取 `NEXT_PUBLIC_SITE_URL`（见 `lib/site.ts` 与 `.env.example`）；未配置时回退 `https://example.com`，部署前请替换。

## 部署（Cloudflare Pages）

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
npm run start   # 验证 /rss.xml、暗色模式、移动端菜单
```

## 功能特性

- 工作台 / 知识库 / 项目 / 学习 / 成长 / 个人主页
- AI 模型中心与提示词库
- 开发者工具（浏览器端，数据不上传）
- 暗色模式（跟随系统 + 手动切换，localStorage 持久化）
- 移动端汉堡菜单与高亮当前路由
- SEO：各页 metadata、sitemap、robots、RSS（`/rss.xml`）
- 全局 loading / error 边界

## License

MIT
