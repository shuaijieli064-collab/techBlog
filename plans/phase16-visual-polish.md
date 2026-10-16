# Phase 16 · 旗舰级视觉体验升级（深空 HUD 2.0）

> 状态：✅ 已完成
> 原则：深化既有深空 HUD，不换风格；动效全部纳入 `prefers-reduced-motion` 静态化；图表零新依赖（自绘 SVG）；不新增常驻 rAF；不破坏 21 个 Playwright 用例 / SEO / sitemap / RSS / node:sqlite 持久化。

## 目标

把站点从「功能型 HUD」提升为「产品级 Developer OS」的视觉完成度，落地五个可感知支柱：

| 支柱 | 内容 | 落点 |
| --- | --- | --- |
| P1 签名 hero 沉浸式重做 | 全屏首屏 + 星云粒子场 + 滚动引导 | `components/HeroNebula.tsx`、`app/page.tsx` |
| P2 材质与质感体系 | 全站胶片噪点、玻璃面板、细线滚动条、卡片光扫 | `app/globals.css`、`SiteHeader.tsx` |
| P3 排版签名化 | mono 页面编号签名、标题 balance、遥测错峰点亮 | `PageHeader.tsx`、8 个列表页、`Telemetry.tsx` |
| P4 数据驾驶舱 | 自绘 SVG 图表库（雷达/环形/迷你趋势/热力/分布）接入工作台 | `components/viz/*`、dashboard/growth/learning/GitHubActivity |
| P5 统一动效系统 | 路由过渡、滚动揭示、数字滚动 | `Reveal.tsx`、`layout.tsx`、`DashboardStats.tsx` |

## 实施明细

### P1 签名 hero

- 首页 hero 升级为 `min-h-[86vh]` 全屏首屏：左文案 + 右雷达，底部 `SCROLL` mono 引导（`scroll-hint` 呼吸动画）。
- 新 `HeroNebula`（client Canvas 粒子场）：220–560 粒子，三色 [`#dce9ff`, `#5ce1ff`, `#ffb454`]，正弦呼吸 + 指针 260px 半径牵引 + 滚动视差 0.14；继承 `AmbientBackground` 的性能纪律（dpr≤2、visibilitychange 暂停、reduced-motion 渲染单帧、粗指针降密度且关牵引）。
- 验证：`scripts/verify-hero-canvas.mjs` 像素级检测（1440×900，litPixels=768，pageerror 为空）。

### P2 材质与质感

- `body::after` 全站胶片噪点（feTurbulence data-URI，opacity 0.035 静态层，不动画）。
- `.glass` 玻璃面板（`color-mix` 70% panel + `blur(16px)` + inset 高光）——`SiteHeader` 页头/下拉/移动导航应用。
- webkit 细线滚动条（hair 底、wire hover）。
- `.sweep` 卡片 hover 光扫 utility（105° 渐变掠过）。

### P3 排版签名化

- `PageHeader` 新增 `code` prop → `// {code} · {eyebrow}` mono 签名；8 个列表页编号（posts=01 … ai=08）。
- `h1/h2/h3` 全部 `text-wrap: balance`。
- `Telemetry` 每格 `telemetry-cell` 错峰点亮（animationDelay 0.2+0.13i s）。
- 新 `SkeletonCard`（发丝线 + 扫描线骨架屏，已建未接入——保留给未来 loading 态）。

### P4 数据驾驶舱（自绘 SVG，零新依赖）

新 `components/viz/` 组件库：

| 组件 | 形态 | 数据源（真实） |
| --- | --- | --- |
| `RadarChart` | 八边形技能雷达，多边形扫出动画 | `lib/growth.ts` skills + `useWorkspace("skill-levels")` |
| `RingProgress` | HUD 环形表 + mono 中心读数 | 今日任务完成率、算法总掌握度 |
| `Sparkline` | 迷你趋势线 + 面积渐变 | 近 14 天学习密度（study-records 按日聚合） |
| `HeatGrid` | GitHub 风格贡献网格（确定性伪随机，明确 MOCK） | 示意，标注接入 API 后同步 |
| `TimelineDensity` | 事件类型分布条（分段降透明） | growthEvents 按 type 聚合 |

接入点：
- **dashboard**：统计卡重排为 4 格驾驶舱（POSTS 数字 / TASKS 环形 / STREAK 数字+密度 sparkline / HOURS 总时长）。
- **growth**：技能画像上方加 `RadarChart`；统计下加 `EVENT MIX` 分布条。
- **learning**：算法练习顶部加 `ALGORITHM MASTERY` 汇总环形（已掌握 43/80 → 54%）。
- **GitHubActivity**：活动列表上方加 26 周 × 7 行贡献热力。

### P5 统一动效系统

- **路由过渡**：`layout.tsx` 用 React `<ViewTransition name="page">` 包裹页面（Next 16 App Router 零配置触发）；CSS `::view-transition-old/new(page)` 淡出/淡入（`no-preference` 下生效）。
- **滚动揭示**：新 `Reveal` 组件（IntersectionObserver 一次性、无常驻监听、reduced-motion 直显）；接入首页 3 板块 + dashboard 6 板块，错峰 delay 60–240ms。
- **数字滚动**：`DashboardStats` 内联 `useCountUp`（rAF 一次性，recordsReady 前不启动，reduced-motion 直达目标值）。

## 验证结果

| 项 | 结果 |
| --- | --- |
| `npm run lint` | ✅ 全绿 |
| `npm run typecheck` | ✅ 全绿 |
| `npm run build` | ✅ 全绿（25 静态页 + 21 动态路径） |
| `npm test`（Playwright 21 用例） | ✅ 21/21 绿（含既有 7 个工作台持久化用例；测试选择器适配 TASKS 卡新环形 UI） |
| hero canvas 像素验证 | ✅ 768 litPixels，无 pageerror |
| 视觉对照 | `.tmp-screens/before/`（25 张基线）↔ `.tmp-screens/after/`（25 张终版），首页/工作台/成长/学习/文章列表桌面走查通过 |
| 既有能力 | SEO canonical×7、Article JSON-LD、sitemap（notes+tags）、RSS、node:sqlite 持久化均未受影响 |

截图脚本 `scripts/capture-baseline.mjs` 升级：截图前滚动页面触发 `<Reveal>` 滚动揭示，确保 fullPage 快照完整。

## 涉及文件

- 新建：`components/HeroNebula.tsx`、`components/SkeletonCard.tsx`、`components/Reveal.tsx`、`components/viz/{RadarChart,RingProgress,Sparkline,HeatGrid,TimelineDensity}.tsx`、`scripts/verify-hero-canvas.mjs`、`scripts/capture-baseline.mjs`
- 修改：`app/globals.css`、`app/layout.tsx`、`app/page.tsx`、`app/dashboard/page.tsx`、`app/growth/page.tsx`、`app/{posts,notes,projects,learning,knowledge,tools,ai}/page.tsx`、`components/{SiteHeader,PageHeader,DashboardStats,Telemetry,GitHubActivity,AlgorithmProgress}.tsx`、`tests/00-workspace.spec.ts`（选择器适配）
