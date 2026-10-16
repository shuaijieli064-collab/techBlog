# Developer OS · 总路线图

> 原则：保留 → 重构 → 扩展 → 优化 → 接后端  
> 状态图例：✅ 已完成 · 🔄 进行中 · ⬜ 未开始

## Phase 1 分析 ✅
- 输出：`plans/phase1-analysis.md`

## Phase 2 架构设计 ✅
- 输出：`plans/phase2-architecture.md`（IA / 路由 / Schema / API / 权限 / UI）

## Phase 3 Dashboard 改造 ✅
- ✅ 统计、任务、技能、快捷操作、AI 推荐
- ✅ 任务可勾选、增删、持久化（本机后端）
- ✅ GitHub 活动卡片（mock，待 API）、「AI 规划今天」入口（本地模板）
- ✅ 项目/学习进度聚合组件复用（ProjectProgressSummary）

## Phase 4 Blog 升级 ✅ 重点本迭代
- ✅ 搜索（标题/标签/正文/分类）
- ✅ 分类筛选 + 置顶/精选标记展示
- ✅ 文章 TOC（从 sections 生成 + 滚动高亮）
- ✅ 正文代码高亮接入（CodeBlock 语法着色 + 行号）
- ✅ 草稿概念（status: draft/published，列表/详情/RSS/Sitemap 过滤）
- ✅ 阅读量/点赞/分享（本机后端计数）
- ✅ Markdown 渲染统一（`lib/markdown.ts` 解析器 + `Markdown` 组件；Notes 与博客正文共用管线，代码块经 CodeBlock 高亮，h2/h3 带锚点供 TOC）
- ⬜ 收藏/评论（后期）

## Phase 5 Projects ✅
- ✅ 列表、状态、进度、TODO
- ✅ TODO 可勾选持久化（本机后端）
- ✅ 项目详情页 /projects/[slug]（长描述、亮点、进度、GitHub/Demo、TODO 摘要）

## Phase 6 Learning ✅
- ✅ 路线图、算法分类进度
- ✅ 掌握状态可切换（本机后端）
- ✅ 算法进度 +/− 可编辑（本机后端）
- ✅ 学习记录 study_records 时间线（增删 + 本机后端持久化）

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
- ✅ lib 数据层 adapter 化第一步：工作台交互态 → 本机后端（node:sqlite，见下节）；static → supabase 仍 ⬜
- ⬜ RLS 策略上线（schema 内已写策略，待连库验证）
- ⬜ Edge Functions：AI 整理/生成博客
- ⬜ GitHub API 只读集成（Dashboard 已有 mock 卡片）

---

## 本轮执行优先级（优化程序）— 已完成

1. ✅ **P0** Blog：搜索、分类筛选、TOC、详情代码高亮、置顶展示、点赞/阅读量（本地）、草稿过滤
2. ✅ **P0** AI Agents 页 + /ai 中心 + Prompt 一键复制/收藏/本地新建
3. ✅ **P0** Tools 补全（URL/JWT/Color/Hash/Markdown/SQL/Cron/HTML）
4. ✅ **P1** Learning/Growth/Dashboard/Projects 交互持久化（本机后端）
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

## 本机后端 · 工作台数据层 — 已完成

1. ✅ **架构**：Next Route Handlers（`GET/PUT /api/workspace/[domain]`、`POST .../[domain]` 仅 post-metrics、`POST /api/workspace/import`）+ Node 24 内置 `node:sqlite` KV 表 `workspace_state`（WAL + busy_timeout、`globalThis` HMR 缓存、256KB 域上限校验）；库文件 `data/workspace.db`（git 忽略、`WORKSPACE_DB_PATH` 可覆盖）；零新运行时依赖（仅 `@types/node` ^20→^24）
2. ✅ **8 类状态全迁**：daily-tasks / project-todos / learning-mastered / algorithms / study-records / skill-levels / prompt-library / post-metrics（原 7 个静态 key + 动态 `post:*` 前缀）；`lib/workspace/client.ts` `useWorkspace` 模块级共享 store——同域多组件实时联动（TODO↔进度卡片↔详情页）、乐观更新 + 120ms debounce PUT、GET no-store；旧 localStorage 保留不删（回滚余地），组件不再读取
3. ✅ **一次性迁移**：`ensureMigrated()` 首访读全部 legacy key → `POST import`（库空才接受、已初始化 409 幂等防覆盖）→ 成功后落 `workspace:migrated` 标记（网络失败不落标、可重试）；所有写路径先 await 迁移，杜绝旧数据覆盖新数据
4. ✅ **修假数据 F1–F4**：DashboardStats（今日任务 x/y 真算、连续学习天数按 study-records 日期真算，种子改相对今日 −1/−2/−4/−5 天 + `ready` 门控防 hydration 不匹配）、技能画像三处统一读 skill-levels（dashboard 8 条 / growth 平均值 / profile，新 `SkillBars`/`GrowthStats`）、项目进度列表+详情页由 project-todos 实时推算（`projectProgressFrom`，新 `ProjectProgress`/`ProjectDetailTodos`）
5. ✅ **测试**：Playwright 隔离（webServer `WORKSPACE_DB_PATH=data/test.db` + 每次跑前清库）；新增 `tests/00-workspace.spec.ts` 7 用例——import 200/409 幂等、GET/PUT 回环、404/400/413 校验、view/like/unlike（含幂等与下限）、dashboard 统计+任务跨刷新、TODO 联动进度+详情页同步、阅读/点赞跨刷新；`npm test` 21/21 绿（文件名 `00-` 保证清库后先于 UI 冒烟执行）
6. ✅ **验证**：lint / typecheck / build 全绿；dev 库跨重启持久化实测（探针 PUT → 重启 dev → GET 仍在 → 清理）；用户浏览器旧 localStorage 首访已自动迁移（daily-tasks 4 条入库）

## Phase 16 旗舰级视觉体验升级（深空 HUD 2.0）✅
- 输出：`plans/phase16-visual-polish.md`
- ✅ **P1 签名 hero**：全屏首屏 + `HeroNebula` 星云粒子场（220–560 粒子、指针牵引、滚动视差、reduced-motion 单帧）+ `SCROLL` 滚动引导；canvas 像素级验证通过
- ✅ **P2 材质质感**：全站胶片噪点、`.glass` 玻璃面板（页头/下拉/移动导航）、细线滚动条、`.sweep` 卡片光扫
- ✅ **P3 排版签名**：`PageHeader` mono 编号签名（`// 01 · …` ×8 列表页）、标题 `text-wrap: balance`、遥测错峰点亮
- ✅ **P4 数据驾驶舱**：自绘 SVG 图表库（`RadarChart` / `RingProgress` / `Sparkline` / `HeatGrid` / `TimelineDensity`）接入 dashboard 4 格驾驶舱、growth 技能雷达+事件分布、learning 算法汇总环形、GitHub 热力网格；全部读真实数据（study-records / skill-levels / algorithms / daily-tasks）
- ✅ **P5 动效统一**：React `ViewTransition` 路由过渡（Next 16 零配置）、`Reveal` 滚动揭示（首页 3 板块 + dashboard 6 板块）、`useCountUp` 数字滚动；全部纳入 prefers-reduced-motion 静态化
- ✅ **验证**：lint / typecheck / build 全绿，`npm test` 21/21（测试选择器适配新环形 TASKS 卡）；before/after 25×2 张截图对照走查通过

## Phase 17 工作台操作性升级（Developer OS 可操作化）✅
- 输出：`plans/phase17-workspace-ux.md`
- ✅ **A 命令式快捷操作**：全局命令面板 `CommandPalette`（`Ctrl/⌘+K` + 页头按钮，搜索 16 页面/13 工具/5 快捷动作，↑↓+Enter 执行软导航，零依赖）
- ✅ **B 任务/项目闭环**：新域 `task-board` 任务箱（优先级 0-2 / 三态 backlog·today·done / 归档），「移到今日→完成→恢复」与今日任务清单双向联动；项目 TODO 补全增删（列表+详情页同步）
- ✅ **C 数据录入编辑**：学习记录主题下拉/编辑模式/周分组/周统计/空状态（+排序稳定性修复）；技能自定义增删；本周概览卡（周时长+7 天趋势/路线图环形/算法环形/连续天数）
- ✅ **D 外部联动**：`/api/github/events` 服务端代理（`GITHUB_USERNAME` 可配置，当前占位），活动卡 LIVE/FALLBACK 徽标；本周规划 7 列周视图；AI 规划改为真实数据规则生成（任务箱+未掌握知识点+算法缺口），静态模板兜底
- ✅ **验证**：lint/typecheck/build 全绿，`npm test` **25/25**（既有 21 不回归 + 新增 4 操作链路用例）；25 张终版截图走查通过

## Phase 18 AI 能力整体接入（ModelScope 真实化）✅
- 输出：`plans/phase18-ai-integration.md`
- ✅ **统一基础设施**：`lib/ai.ts` 模型清单（6 个 ModelScope 模型）+ 6 个 Agent 预设单源；`/api/ai/status` 状态接口（不返回 Key）
- ✅ **AI 中心真实化**：`/ai/models` 从虚构 mock 重写为真实配置页（Key 状态/端点/默认模型 + 真实模型卡）；`/ai/agents` 模型映射真实化 + 「去对话」入口；首页 4 卡（新增 AI 对话）
- ✅ **AI 对话工作台**：`/ai/chat` 通用对话（模型切换 / Agent 预设 / 注入工作台真实数据 / Markdown 渲染 / 会话本地持久化 / `?agent=` 直达）
- ✅ **工作台 AI 助手**：右侧 mock 卡 → `AiAssistantCard`（真实数据生成今日建议，LIVE 徽标，复制/重生成/去对话）
- ✅ **AI 规划今天真实化**：`DailyTasks.planToday` 真实 LLM 生成（JSON 容错解析），失败回落本地规则并提示
- ✅ **验证**：lint/typecheck/build 全绿，`npm test` **25/25** 零回归；`/api/ai/status` 与 `/api/ai/chat` 实测链路贯通；5 张截图走查通过

## Phase 19 六项体验优化（Refine & Real-data）✅
- 输出：`plans/phase19-refine.md`
- ✅ **菜单栏 bug**：AI 下拉补「AI 对话」入口；桌面下拉 hover 间隙闪烁修复（pt-2 连续 hover 通道）；渲染期 state 调整采用官方推荐模式（lint 零告警）
- ✅ **字体**：正文中文统一为 Noto Sans SC（原 Windows 命中微软雅黑、与标题字形不一致）；清理 display 栈重复系统字面量
- ✅ **项目结构**：AI 组件归组 `components/ai/`（3 文件），删除无引用 `SkeletonCard.tsx`
- ✅ **内容真实性**：3 处项目占位链接 `github.com` → 真实仓库（study-assistant↔大创平台 / tech-blog↔techBlog / algorithm-tracker→账号主页）
- ✅ **博客**：文章详情新增「上一篇/下一篇」导航卡片（边界自动隐藏）
- ✅ **GitHub 账号接入**：`GITHUB_USERNAME=shuaijieli064-collab` 配置（用户截图提供 + API 校验），GitHub 卡实测 **LIVE · 真实数据**
- ✅ **验证**：lint/typecheck/build 全绿，`npm test` **25/25** 零回归，浏览器实测三处通过

## Phase 20 博客内容系统（自由增删改）✅
- 输出：`plans/phase20-blog-crud.md`
- ✅ **数据层**：`WORKSPACE_DOMAINS` 新增 `blog-posts` 域；`lib/posts.ts` 升级为「静态示例 ∪ 用户文章」合并源（`UserPost` / `userPostsFrom` 脏数据安全转换；详情/归档/标签/上下篇全部合并）
- ✅ **管理界面**：`/posts/admin` 新建/编辑/删除文章（标题、slug 自动生成+唯一校验、分类、标签、日期、作者、草稿/发布、摘要、**正文 Markdown textarea + 实时预览**）；内置示例只读区；删除二次确认
- ✅ **自由使用补全**：AI 草稿「保存为文章」一键入库（`?new=1&title=&content=` 预填）；`/api/workspace/export` 全域 JSON 导出（管理页按钮 + 命令面板动作）；「清空自定义文章」一键重置（示例保留）
- ✅ **关键 bug 修复**：Next 16 路由 `params` 不再自动解码 URL 编码 → 中文 slug 详情页正文整体缺失；`[slug]/page.tsx` 手动 `decodeURIComponent` 修复（标签页已解码无需改）
- ✅ **验证**：lint/typecheck 全绿，`npm test` **27/27**（既有 25 零回归 + 新增 blog-admin 2 用例：增删改全链路 + 草稿隐藏）

## Phase 21 生产级完善（核心模块补齐 + 设计统一 + 交互细节）✅
- ✅ **构建阻断修复**：`app/manifest.ts` `purpose:"any maskable"`→`"maskable"`；`components/ai/AiChat.tsx` 错误态统一为 `{message, docs}` 结构（修复类型转换丢失）；`app/page.tsx` JSX 文本以 `//` 开头触发的 lint 错误；`app/not-found.tsx` 服务端组件误用 `onKeyDown` → 原生 GET 表单；`middleware.ts` 迁移为 `proxy.ts`（Next 16.3 弃用警告消除）
- ✅ **死代码清理**：删除无引用 `HeroNebula.tsx` / `HeroOrbital.tsx` / `RadarSweep.tsx`
- ✅ **核心模块·全局搜索**：新增 `/search` 页（`lib/search.ts` 统一索引文章+笔记+函数，服务端构建、客户端实时过滤 + `<mark>` 高亮 + 分组计数 + 空态）；命令面板补「全局搜索」页与「未匹配→全局搜索」兜底链接；页头加搜索图标入口；`not-found` 表单改指向 `/search`
- ✅ **核心模块·设置与数据中心**：新增 `/settings` 页（数据概览按域计数 / 环境状态 AI·GitHub·站点 / 数据迁移导出+导入恢复 / 危险区清空自定义文章，二次确认）；复用 `/api/workspace/export` 与 `[domain]` PUT
- ✅ **交互细节**：`ReadingProgress` 阅读进度条（文章/笔记详情）；`BackToTop` 返回顶部；`KeyboardHelp` `?` 快捷键帮助弹层；全局挂载于 `layout`
- ✅ **设计统一**：`EmptyState` 支持自定义图标；全站按钮尺寸覆盖类失效问题（`.btn-primary` 层序实测后置于 `.px-4` 之后）批量清理并补 `.btn-sm/.btn-xs`；圆角按「直角 + 圆点例外」规整套件化脚本批量处理；修正 `PostEngagement` 阅读量重复计数 / `setTimeout` 泄漏 / `PostCard` 阴影越界 / `GitHubActivity` 硬编码 / `PageHeader` code 渲染 / `SkillLevels`/`AlgorithmProgress`/`ProjectList`/`Telemetry`/`WeekOverview` 等 15+ 处真实缺陷；dashboard `?focus=` 深链补齐（命令面板 4 动作恢复可用）
- ✅ **验证**：lint / typecheck / build 全绿；`npm test` **29/29**（既有 27 零回归 + 新增全局搜索 / 设置页 2 用例）

## Phase 22 UI 系统性重设计（设计语言 v2：NEBULA）✅
- ✅ **设计令牌重建**（`app/globals.css`）：空间底色加深（`#05070e`）与表面三段梯阶（panel/raise + 渐变微光）；圆角体系 `--radius-xs/sm/md/lg/xl`（卡片 14px、控件 10px、标签 pill、圆点例外）并接入 Tailwind `@theme`；阴影三级（`--shadow-1/2/glow`，环境色低对比）；动效三速（`--dur-fast/base/slow` + `--ease-spring`）
- ✅ **组件类升级**：`.card` 渐变微光 + 一级阴影；`.card-hover` 上浮 3px + 二级阴影 +  accent 边框；`.btn-primary` 青→蓝渐变 + 内高光 + 按压反馈（`active:translateY-1px scale-0.985`）；`.btn-secondary` 同步；`.chip`/标签 pill 化；`.input-base` focus 光环（3px ring）；新增 `.pill` 状态徽标、`.kbd` 键帽、`.link-underline` 下划线生长、`.row-hover` 列表行、`.skeleton` 骨架屏、`.pop` 确认弹跳、`.fade-up` 入场
- ✅ **圆角批量规整**：两轮精确类名映射（108 处）覆盖全部手写容器/图标盒/徽标/选择器/聊天气泡/进度条（track+fill 圆角化），条件类名逐个人工定制；实测 CSS 层序后清除被 `.card-hover` 覆盖的死悬浮类
- ✅ **核心界面重设计**：导航激活态 underline→pill（桌面）+ 左指示条圆角（移动）；首页 hero 卡片化 + CTA 光泽；仪表盘 hero 入 `.card` 体系 + `SYSTEM ONLINE` 入 `.pill`；命令面板行圆角 + 激活态左侧 accent 条 + `.kbd`；文章正文排版重做（标题 `#` 前缀标记、1.78 行高、引用右侧圆角、表格容器圆角+分区线、列表 marker 青色、行内代码 pill、hr 渐变线）；目录激活态左accent；分享/复制成功 `.pop` 反馈；聊天气泡尾角（br/bl-sm）+ `fade-up` 入场；搜索结果 `key={query}` 整体淡入 + `mark` 高亮圆角
- ✅ **可访问性与响应式**：FAB 触控目标 44px + `env(safe-area-inset-bottom)` 安全区；`:focus-visible` 光环带圆角；`prefers-reduced-motion` 全覆盖新增动画（含按压/悬浮 transform）；对比度随墨色阶提升（foreground `#e9f0fd`/print `#a7b6d0`/muted `#7c8daa`）
- ✅ **验证**：lint / typecheck / build 全绿；`npm test` **29/29**（dark-canvas 用例随新底色令牌更新为 `rgb(5,7,14)`）

## 建议下一轮

- ⬜ 真实域名替换（配置 NEXT_PUBLIC_SITE_URL）+ Supabase 环境变量 + Cloudflare 部署（Phase 14）
- ⬜ 安全面 RLS 用例
- ⬜ 需要你提供：真实域名
- ⬜ 可选：对话流式输出（SSE）、外部日历接入、AI 用量统计（ModelScope 控制台）、`GITHUB_TOKEN`（提高 events 限额）
