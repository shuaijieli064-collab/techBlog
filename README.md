# 林晨的博客 · Developer Workspace

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
| `/dashboard` | 个人工作台：统计、今日任务、技能画像、AI 推荐 |
| `/posts`, `/posts/[slug]` | 博客列表与详情 |
| `/knowledge` | 知识库入口（笔记 / 面试题 / 命令） |
| `/projects` | 项目中心 |
| `/learning` | 学习中心：路线图 + 算法练习 |
| `/growth` | 成长中心：技能画像 + 成长时间线 |
| `/profile` | 个人主页 |
| `/tools` | 开发者工具（JSON / Base64 / 时间戳 / 正则 / UUID） |
| `/functions` | 函数速查 |
| `/ai/models` | AI 模型中心 |
| `/ai/prompts` | 提示词库 |
| `/archive`, `/notes`, `/tags/[tag]` | 归档与标签 |

## 目录结构

```
app/                  # App Router 页面
components/           # 共享组件（SiteHeader、PostCard、CodeBlock 等）
lib/                  # 静态数据与工具函数
  posts.ts            # 博客文章数据
  functions.ts        # 函数速查数据
  growth.ts           # 技能与成长时间线数据
```

## 数据说明

MVP 阶段所有内容均为静态数据（`lib/*.ts`），无 API Key、无服务端密钥。AI Center 仅做展示与记录，真实密钥接入时应使用 Supabase 加密存储，前端绝不直接暴露敏感信息。

## 部署（Cloudflare Pages）

1. 推送仓库到 GitHub
2. Cloudflare Dashboard → Pages → Connect to Git
3. 构建命令：`npm run build`，输出目录：`.next`（或按平台指引配置 OpenNext / 静态导出）
4. 将 `sitemap.ts` / `robots.ts` 中的 `example.com` 替换为真实域名

## License

MIT
