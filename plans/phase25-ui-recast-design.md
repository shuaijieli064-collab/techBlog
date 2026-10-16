# Nexus 工作台 UI 重铸设计方案

> **Phase 25 · Design Spec v1.0** · 2026-10-16
> 范围：视觉层与交互层重铸。**功能、信息架构、技术栈（Next.js 16 · React 19 · Tailwind v4 · node:sqlite）保持不变。**
> 本文档是后续开发的唯一视觉与交互依据；实施路线见第 11 章（分 5 个阶段，每阶段可独立验证与回滚）。
> 依据：`app/globals.css` 全文走查、`app/layout.tsx`、全部 24 个路由页面与 71 个组件的结构清点；色板对比度由 WCAG 2.1 公式实算（见 3.3）；动效与排版决策有 ui-ux-pro-max 检索证据（见各章「依据」注）。

---

## 0. 摘要：一页看懂

**设计方向：「Calm HUD · 深空精密」**——保留深空基因与青色主 accent（品牌识别不推翻重来），但把执行精度拉到业界顶尖水准：对比度全面 AAA、动效大幅收敛、组件全状态契约化、排版建立中文优先的字阶体系。

**三大支柱**：

| 支柱 | 一句话 | 关键动作 |
| --- | --- | --- |
| 精密（Precision） | 每个像素都有依据：1px 亮边、8pt 网格、tabular 数字、AAA 对比度 | surface 5 级阶梯、字阶表、间距 token、组件状态矩阵 |
| 克制（Calm） | 高端感来自"少动"，不是"多动" | 持续动画从 ~10 处收敛到每视图 ≤2 处；移除扫描线/流动网格/循环渐变文字 |
| 一致（Consistency） | 同一语义在全站只有一种视觉表达 | 令牌→组件→页面三级映射；新增 ghost/danger 按钮、table、banner、tooltip 规范 |

**动作规模**：令牌层重写（1 个核心文件）+ 组件类新增/修订（约 20 个类）+ 页面级套用（24 个路由，按优先级分 5 阶段推进）。

**预期**：视觉对标 Linear / Raycast / Vercel Dashboard 的质感来源（第 2.3 章拆解）；文本对比度 100% ≥ AA（实测多数 AAA）；动效投诉风险下降；34+ 项 Playwright 冒烟全绿不回归。

---

## 1. 现状诊断（基于代码的事实）

### 1.1 已具备的优势（保留，不推翻）

1. **令牌体系已存在**：surface 三级、radius 五档、shadow 三级、motion 三档（`app/globals.css:7-50`），方向正确，缺的是完整度与执行纪律。
2. **深色基底质量高**：`--background: #05070e` 配顶部极淡青光洗、grain 纹理（3.5%）、glass 模糊、HUD 滚动条——底子是"高级深色"的正确配方。
3. **组件类初具规模**：`.card/.btn-primary/.btn-secondary/.chip/.input-base/.code-panel/.pill/.kbd/.toast/.skeleton` 等约 25 个，Phase 23 已补 `.press/.stagger-in/.num`。
4. **交互基建齐全**：命令面板（⌘K）、全局搜索、Toast、骨架屏、View Transition 路由转场、`prefers-reduced-motion` 全量清单（`globals.css:907-954`）。
5. **质量门禁**：CI 已跑 typecheck/lint/build/34 项 Playwright（` .github/workflows/ci.yml`，首跑即绿）。

### 1.2 核心问题（按严重度排序，每条有代码证据）

| # | 问题 | 证据 | 后果 |
| --- | --- | --- | --- |
| P1 | **动效过量，持续动画元素过多** | `aurora-a/b`（52s/64s 无限漂移）、`horizon-grid`（2.8s 无限流动）、`scanlines`（9s 漂移）、`gradient-shift`（7s 循环）、`border-spin`（6s 旋转）、`shimmer-sweep`（4.5s）、`status-dot`（2.2s 脉冲）、`sweep`——单视图同时运行的无限动画可达 5-7 处 | 违反 UX 准则「每视图最多 1-2 个持续动画」「无限动画仅用于加载指示」；页面显"忙乱、廉价"，长阅读疲劳 |
| P2 | **色彩体系不完整**：无 success 语义色（完成/成功状态只能借用青色）、无 surface 第四级（浮层与卡片同色，层级糊）、无 faint 禁用色 | `:root` 仅 6 个 accent/semantic 色 | 状态表达靠猜；弹层浮起感弱 |
| P3 | **组件契约不全**：按钮只有 primary/secondary 两变体（缺 ghost/danger/loading 态规范）、无 table/banner/tooltip/switch/select/tabs/breadcrumb 规范 | `globals.css:318-418` | 各页面各自为政（如工具页筛选器、设置页分区、AI 页卡片样式漂移） |
| P4 | **排版无字阶体系**：字号散落（10/11/12/13/14/15/16/18/20/24/30/36px），无统一 scale；中文正文行高/字距缺专项规则；`Saira` 与 Geist 气质重叠却多下载一个全家桶 | `layout.tsx:27-31` 加载 4 个 Google 字体家族 | 层级噪音、字体下载冗余、中西文混排质感不稳 |
| P5 | **布局节奏不统一**：容器宽度、section 垂直节奏、卡片内边距在各页手工设定（max-w-6xl 与 py-* 混用） | `layout.tsx:111`、各 page.tsx | 页面之间"呼吸感"不一致 |
| P6 | **细节精度欠账**：卡片缺统一的 1px 顶部亮边配方、hair 边框在 raise 面上偏弱、统计数字对齐规则靠个别 `.num` 类兜底 | `globals.css:174-199` | 近看不"锐利"——高端感恰恰在这些 1px 上 |

### 1.3 诊断结论

问题不在"底色不好看"，而在**执行精度与纪律**：令牌有但不成体系、动效有但不受约束、组件有但无契约。因此本方案是「重铸执行标准」而非「推翻视觉方向」。

---

## 2. 设计方向与原则

### 2.1 设计北极星

> **「像一台精密仪器，而不是一场灯光秀。」**
> 每一个元素的存在都可被解释：这道光为了区分层级，这条线为了界定边界，这个动效为了确认操作。

### 2.2 三条设计原则（全站决策的裁判）

1. **精密先于炫酷**：1px 的亮边、0.5px 的发丝线、等宽数字、光学对齐——精度是高级感的第一来源；任何"好看但说不清理由"的效果不引入。
2. **动效是反馈，不是装饰**：动效只承担三个职责——确认操作（press/pop）、引导注意（入场 stagger）、维持空间感（转场）。不承担"让页面动起来"的职责。
3. **语义唯一**：一个语义（如"成功"）全站只有一种颜色+一种图标+一种动效表达，不允许第二种类似物。

### 2.3 质感参考系拆解（Linear / Raycast / Vercel Dashboard 的公共配方）

| 质感来源 | 具体做法 | 本方案对应 |
| --- | --- | --- |
| 边缘光 | 卡片/按钮顶部 1px 半透明亮边（rgba(220,235,255,.04-.28)），模拟环境光 | 3.5 章 shadow-0 亮边配方 |
| 低饱和大面积 | 中性色占 90%+，accent 只做指针大小点缀 | 3.4 章 accent 配额制 |
| 等宽数字 | 所有统计/计时/编号 tabular-nums | 4.4 章 `.num` 升级为数据类强制 |
| 克制的圆角 | 控件 10px、卡片 14px、标签全圆——三级分明 | 3.5 章 radius 保持五档+新增 2xl |
| 安静的动效 | hover 150ms 颜色过渡、press 100ms 回弹、无循环装饰 | 第 7 章收敛清单 |

---

## 3. 色彩体系

### 3.1 Surface 阶梯（5 级，深→浅）

| 令牌 | 值 | 用途 | 备注 |
| --- | --- | --- | --- |
| `--background` | `#05070e` | 页面基底 | 保持（冒烟测试锚定该值，不动） |
| `--panel` | `#0b1120` | 卡片、面板、输入框 | 保持 |
| `--raise` | `#131c30` | 悬浮面板、下拉、悬停态填充 | 保持 |
| `--float` | `#16203a` | **新增**：浮层（tooltip/popover/下拉菜单）、需要"浮起"的表面 | raise 与 panel 之间插入一级，浮层终于比卡片亮 |
| `--scrim` | `rgba(3,6,11,.72)` | **新增**：模态背幕（命令面板/对话框） | 配 `backdrop-filter: blur(8px)` |

规则：**层级只靠 surface 步进 + 1px 边框表达，禁止用大投影制造浮起感**（投影仅 shadow-1/2 两档轻微使用）。

### 3.2 Ink 文字阶梯（4 级）

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--foreground` | `#e9f0fd` | 标题、主文案、主数字 |
| `--print` | `#b7c4da` | 正文、次要说明（Phase 23 已提亮，保持） |
| `--muted` | `#8ea0bd` | 辅助标签、占位符、时间戳（**仅用于 background/panel 面**；raise/float 面上提亮一档或换 print） |
| `--faint` | `#56658a` | **新增**：禁用文字、装饰性水印（非关键信息，对比度 ≥3:1 即可） |

### 3.3 语义色与对比度实测（WCAG 2.1 公式实算，2026-10-16）

| 前景 \ 背景 | background | panel | raise | float |
| --- | --- | --- | --- | --- |
| foreground `#e9f0fd` | **17.6 AAA** | 16.5 AAA | 14.8 AAA | 14.1 AAA |
| print `#b7c4da` | **11.4 AAA** | 10.7 AAA | 9.6 AAA | 9.2 AAA |
| muted `#8ea0bd` | **7.6 AAA** | 7.1 AAA | 6.4 AA | 6.1 AA |
| wire `#5ce1ff` | **13.1 AAA** | 12.3 AAA | 11.1 AAA | 10.5 AAA |
| violet `#a78bfa` | **7.4 AAA** | 6.9 AA | 6.2 AA | 5.9 AA |
| signal `#ffb454` | **11.4 AAA** | 10.7 AAA | 9.6 AAA | 9.1 AAA |
| alert `#ff5f6b` | **6.8 AA** | 6.4 AA | 5.7 AA | 5.5 AA |
| success `#34d399`（新增） | **10.5 AAA** | 9.8 AAA | 8.8 AAA | 8.4 AAA |

按钮反差：`#04121b` on wire = **12.3:1**；on signal = **10.8:1**。
**规则：全部文本组合 ≥ AA（4.5:1）；目标组合全部 ≥ AAA。alert 用于 14px 以下小字时提升为 `#ff7a83`（重算后 ≥7:1）。**

### 3.4 语义色角色与配额

| 令牌 | 值 | 角色 | 配额（每视图） |
| --- | --- | --- | --- |
| `--wire` | `#5ce1ff` | 主 accent：主按钮、链接、激活态、焦点环 | 视觉焦点 ≤ 3 处 |
| `--violet` | `#a78bfa` | 辅 accent：AI 相关、渐变终点、次要强调 | ≤ 2 处 |
| `--signal` | `#ffb454` | 遥测/警告/进行中 | ≤ 2 处 |
| `--alert` | `#ff5f6b` | 错误/危险操作 | 仅错误处 |
| `--success` | `#34d399` | 完成/成功/正向增量（**新增**，替代"借用青色表示成功"） | ≤ 3 处 |
| `--hair` | `rgba(125,195,235,.18)` | 静态边界 | 不限 |
| `--hair-strong` | `rgba(125,195,235,.34)` | **新增**：可交互元素 hover/active 边界 | 不限 |

**禁止事项**：禁止把 wire 当 success 用；禁止同屏出现两个"差不多"的强调色；禁止彩色大面积填充（accent 只做 1px 线、小图标、文字、10% 以下淡填充）。

### 3.5 阴影与亮边配方

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--shadow-0` | `inset 0 1px 0 rgba(220,235,255,.05)` | **新增**：所有卡片/面板/输入的顶部亮边（质感核心） |
| `--shadow-1` | 保持现值 | 卡片静息 |
| `--shadow-2` | 保持现值 | 卡片 hover/下拉 |
| `--shadow-glow` | 保持现值 | 主按钮/焦点光晕（仅交互元素） |

**卡片标准配方**：`background: var(--panel)` + `border: 1px solid var(--hair)` + `box-shadow: var(--shadow-0), var(--shadow-1)` + `border-radius: var(--radius-lg)`——四件套缺一不可，收敛为 `.card` 单一来源。

---

## 4. 字体排版

### 4.1 字体栈决策

| 角色 | 采用 | 理由 |
| --- | --- | --- |
| UI/正文 | **Geist Sans**（保留） | Vercel 自家字体，拉丁字形与紧字距是一线水准；`next/font` 自托管，国内无 CDN 风险 |
| 数据/代码/标签 | **Geist Mono**（保留） | 与 Sans 同族，`tnum` 完善 |
| 中文 | **Noto Sans SC**（保留） | 中文唯一正解，字重 400/500/700 三档 |
| 展示标题 | **Saira → 移除** | 与 Geist 气质重叠；少一个家族 = 少约 30-60KB 字体下载与一次布局抖动。display 统一 Geist 800 紧字距，中文回落 Noto SC 700 |

> 依据：ui-ux-pro-max 排版域检索中「Developer Mono（JetBrains Mono + IBM Plex Sans）」与「Dashboard Data（Fira）」均为 Mono+Sans 路线——与本项目 Geist 家族同构；保留现有栈即最优解，移除重叠的 Saira 是一致性决策。实施时若首页 Hero 需要更强"数字感"，可仅在 Hero 组件内以 CSS 局部启用 Saira 作为可选（默认不启用）。

### 4.2 字阶表（Type Scale，全站唯一字号来源）

| 层级 | 字号/行高 | 字重/字距 | 字体 | 用途 |
| --- | --- | --- | --- | --- |
| display | `clamp(2.6rem, 2rem + 2.4vw, 3.6rem)` / 1.08 | 800 / -0.02em | Geist | 仅首页 Hero 主标题 |
| h1 | `clamp(1.85rem, 1.45rem + 1.6vw, 2.4rem)` / 1.22 | 800 / -0.012em | Geist | 页标题（`.page-title` 保持） |
| h2 | 1.375rem / 1.3 | 700 / -0.01em | Geist | section 标题（`.section-title` 升自此级） |
| h3 | 1.125rem / 1.4 | 600 / 0 | Geist | 卡片标题、子分区 |
| body | 0.9375rem（15px）/ **1.75** | 400 / 0 | Geist+Noto | 正文（中文 15px/1.75 为舒适区） |
| body-sm | 0.875rem / 1.7 | 400 | Geist+Noto | 次要正文、表格单元格 |
| caption | 0.8125rem / 1.6 | 400 | Geist+Noto | 辅助说明、表单帮助文字 |
| mono-label | 0.6875rem（11px）/ 1.4 | 600 / **0.14em** | Geist Mono | 眉题、字段名、telemetry 键（`.label-mono` 保持） |
| mono-data | 0.8125rem / 1.6 | 500 / 0.02em + **tnum** | Geist Mono | 统计数字、代码、ID |
| stat | `clamp(1.75rem, 1.5rem + 1vw, 2.25rem)` / 1.1 | 800 / -0.01em + tnum | Geist | 仪表盘大数字 |

规则：**禁止出现字阶表以外的字号**（现有 10/12/13px 等全部归并到上表；`text-[11px]` 等任意值仅允许 mono-label 场景）。

### 4.3 中文排版专项规则

1. 正文行高 1.75、标题 1.1-1.3（中文比拉丁需要更大行高）；
2. 中西文混排：数字与拉丁词两侧自动空隙（`font-feature-settings` 默认即可，禁止手动加空格作弊）；
3. 所有数字场景（统计、计时、编号、版本号）强制 `.num`（tabular-nums）——从"个别类"升级为数据展示默认；
4. 标点：标题 `text-wrap: balance`（已有），正文段落 `max-width: 42rem` 防行长过长；
5. 破折号/省略号用中文全角；中英混排时英文用半角标点。

---

## 5. 间距与布局

### 5.1 间距系统（8pt 网格，4pt 微调）

token：`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96`（px）。组件内边距只用 12/16/24；卡片间距 16/24；section 间距 64（移动）/96（桌面）。**禁止 `py-13`、`mt-7` 等网格外数值。**

### 5.2 容器宽度（token 化，结束手工 max-w 混用）

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--prose` | 42rem（672px） | 文章正文、设置表单、单栏阅读 |
| `--content` | 72rem（1152px） | 全站默认内容宽（= 现行 max-w-6xl，保持） |
| `--wide` | 80rem（1280px） | 仪表盘 bento、工具双栏、文章三栏 |

### 5.3 页面骨架

```
┌──────────────────────────────────────────┐
│ SiteHeader  64px · glass · sticky · z-40 │  ← 边框 hair + shadow-0 底部亮边
├──────────────────────────────────────────┤
│  main（View Transition 包裹）             │
│  section 垂直节奏：pt-16 pb-24 / 桌面 pt-24│
│  [PageHeader：eyebrow + h1 + desc]       │
│  [内容区：按页面模式库]                   │
├──────────────────────────────────────────┤
│ Footer · border-t hair · panel/70        │
└──────────────────────────────────────────┘
   AmbientBackground（-z-10，收敛后见 7.3）
```

### 5.4 布局模式库（每类页面只准用一种）

| 页面类型 | 路由 | 模式 |
| --- | --- | --- |
| 仪表盘 | `/dashboard` | wide 容器 + bento：4 统计卡（桌面 4 列/平板 2 列/手机 2×2）→ 任务双栏 → 最近文章列表 |
| 列表/探索 | `/posts` `/projects` `/tools` `/functions` `/ai/prompts` | 筛选栏（sticky 次级条）→ 卡片网格（桌面 3 列/平板 2/手机 1）或密集列表（toggle） |
| 阅读详情 | `/posts/[slug]` `/notes/[slug]` | **三栏升级**：左 TOC（sticky，≥lg 显示）+ 中 prose 正文 + 右元信息卡（作者/日期/标签/进度）；< lg 时 TOC 折叠为文末 `<details>` |
| 工具页 | `/tools/[tool]` | 双栏：输入 | 输出，等宽字体，移动端纵向堆叠 |
| 对话 | `/ai/chat` | 消息流 + 底部输入区（sticky），气泡规范见 6.6 |
| 设置 | `/settings` | 左侧 section 导航（sticky，≥md）+ 右面板，移动端单栏 |
| 管理 | `/posts/admin` | 表格 + 行内操作 + 顶部操作栏 |
| 个人主页 | `/profile` | Hero 区（头像 + 数据条）+ 时间线 + 项目网格 |

---

## 6. 组件规范

### 6.1 总则

- 所有可交互元素：`cursor: pointer`、hover 有视觉反馈（颜色/边框/阴影三选一，**禁止位移型 hover 用于列表行**——仅卡片允许 translateY(-2px)）、transition 150ms。
- 所有组件必须定义 6 态：default / hover / active / focus-visible / disabled / loading（适用时）。
- 焦点环全站统一：`outline: 2px solid var(--wire); outline-offset: 2px`（已有，保持）。

### 6.2 按钮（Button）

| 变体 | 视觉 | 用途 |
| --- | --- | --- |
| `.btn-primary` | wire 渐变 + 深字 + glow | 每视图最多 1 个主 CTA |
| `.btn-secondary` | panel 底 + hair 边 + 亮边 | 次操作 |
| `.btn-ghost`（**新增**） | 透明底，hover wire/8% 填充 + wire 字 | 工具栏、表格行内操作 |
| `.btn-danger`（**新增**） | alert/12% 填充 + alert 字 + alert 边 | 删除、清空（设置页危险区） |

尺寸：`.btn-sm`（32px 高）/ 默认 `.btn-md`（36px 高）/ `.btn-lg`（44px 高，移动端主 CTA 与触控场景）。Icon-only：正方形，`aria-label` 必备。
状态矩阵：

| 状态 | primary | secondary/ghost |
| --- | --- | --- |
| hover | brightness(1.07) + glow 加深 | 边框→wire 60% / 填充 wire 8% |
| active | translateY(1px) scale(.985) | 同左 |
| focus-visible | 全站焦点环 | 同左 |
| disabled | opacity .5 + not-allowed | 同左 |
| loading | 前置 spinner（16px）+ 文字不变 + `aria-busy` + 禁点击 | 同左 |

### 6.3 输入与表单

- `.input-base` 保持（38px 高、radius-md、focus 时 wire 边 + 3px/14% 光晕——已有配方是好配方）；
- **新增** `.input-error`：alert 边 + alert/12% 底 + 帮助文字转 alert 色；校验失败时配 `.shake`（一次性，已有）；
- **新增规范**：`.select-base`（原生 select 样式统一）、`.switch`（44×24 轨道 + 20px 钮，transition 150ms）、`.checkbox/.radio`（18px、wire 选中态）；
- 表单布局：label 在上（caption 级）、必填标记 `*` 用 alert 色、帮助文字 caption 级 muted；提交按钮 loading 态见 6.2。

### 6.4 卡片与数据展示

| 组件 | 规范 |
| --- | --- |
| `.card` | 3.5 章四件套；内边距 24（主卡片）/16（紧凑） |
| `.card-hover` | 保持 translateY(-2px)+shadow-2；**限定**：仅"可点击的整体卡片"使用，列表行禁用 |
| **统计卡**（新增配方） | mono-label 标题 + `stat` 级数字（tnum）+ 趋势行（success/alert 小三角 + 百分比）+ 底部 hair 分隔的可选迷你趋势线（Sparkline 组件已有） |
| `.row-hover` | 保持（soft fill + wire 边）；行高 ≥44px（触控） |
| **表格** `.table-base`（新增） | 表头 mono-label + sticky；行分隔 1px hair；单元格 body-sm；数字列 tnum 右对齐；行 hover 用 row-hover；移动端 `<lg` 允许横向滚动（配右缘渐隐） |
| `.chip` / `.pill` / `.kbd` | 保持；chip 增加 `aria-pressed` 用于筛选态 |
| **Tooltip**（新增） | float 底 + hair 边 + shadow-2 + radius-sm；12px/print 字；延迟 300ms 出现、150ms 消失；仅 `aria-label` 的视觉补充，触屏不显示 |

### 6.5 导航

- 顶栏：glass + hair 底边 + shadow-0 亮边；激活项 = wire 文字 + wire/10% 底 + radius-md（现行 pill 配方保持）；「搜索/命令」入口保持 Phase 23 的输入式按钮；
- 移动菜单：stagger 入场（已有）、Esc 关闭（已有）、≥44px 行高；
- **新增**：面包屑 `.breadcrumb`（mono-label 级 + `/` 分隔，用于 `/posts/[slug]`、`/projects/[slug]`、`/posts/admin`）；分页 PostPagination（已有）纳入规范；TOC（已有）左侧 sticky + 当前节 wire 高亮。

### 6.6 反馈层

| 组件 | 规范 |
| --- | --- |
| Toast（已有） | 右上角堆叠；类型色：success→`--success`、error→`--alert`、info→wire；进度条 + hover 暂停（已有）；`aria-live` 播报（已有） |
| **Inline Banner**（新增 `.banner`） | 页内提示条：info/warning/error/success 四态 = 对应色 10% 底 + 对应色边 + 图标 + 文字；radius-md；用于表单错误汇总、AI 回落提示（替代 DailyTasks 内联 AlertTriangle 块的自由样式） |
| Empty State（已有 EmptyState 组件） | mono 图标 + print 标题 + muted 描述 + 主 CTA；居中 |
| Skeleton（已有） | raise 底 + sweep；文本/卡/行三形态 |
| 对话框（命令面板） | 顶部 12vh 起、max-w-2xl、scrim+blur、输入框无边框化 + 焦点即在输入框；结果分组标题 mono-label；激活项 wire/10% + 左侧 2px wire 条（已有配方保持） |
| z-index 阶梯 | base 0 → sticky 30 → header 40 → dropdown 50 → overlay(模态) 60 → toast 70 → palette 80 → grain 9999 |

### 6.7 图表与可视化（复用现有 viz 组件）

Sparkline / RingProgress / HeatGrid / RadarChart / TimelineDensity 已有实现，规范：线宽 1.5px、wire 主色 + violet 辅、填充 ≤20% 透明度、坐标/标签用 mono-label 级、**每图必须配数值文字**（色盲友好，图表域检索准则）、无动画或仅入场一次。

---

## 7. 动效与交互

### 7.1 令牌（从三档扩为五档 + 三曲线）

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--dur-instant` | 100ms | press 回弹、开关 |
| `--dur-fast` | 150ms | hover、颜色过渡（UX 准则 150-300ms 区间下限） |
| `--dur-base` | 220ms | 入场、面板展开 |
| `--dur-slow` | 320ms | 页面转场、命令面板 |
| `--dur-glide` | 480ms | 仅 Hero 一次性编排 |
| `--ease-standard` | `cubic-bezier(.2,.6,.2,1)` | **进入（ease-out）** |
| `--ease-exit` | `cubic-bezier(.4,0,1,1)` | **退出（ease-in）** |
| `--ease-spring` | `cubic-bezier(.22,1.4,.36,1)` | 仅 playful 微交互（pop、press） |

> 依据：UX 域检索「Easing Functions：entering 用 ease-out，exiting 用 ease-in」「Excessive Motion：每视图 1-2 个关键动画」「Continuous Animation：无限动画仅用于加载指示」三条高严重度准则。

### 7.2 编排规则

1. 入场：列表 stagger 45ms/项、上限 8 项（已有配方保持）；面板/页面 fade-up 320ms；
2. 退出：一律 150-220ms、ease-in、**不等动画播完就响应下次操作**（可打断）；
3. hover：150ms；press：100ms；页面转场：View Transition 320ms（已有）；
4. 路由切换时旧页 fade-out 与新页 fade-in **不叠加超过 320ms**，体感"即走即到"。

### 7.3 动效收敛清单（本方案最核心的执行项）

| 现有效果 | 处置 | 理由 |
| --- | --- | --- |
| `scanlines` 扫描线 | **移除** | 纯装饰无限动画，CRT 拟物与"精密仪器"方向相悖 |
| `horizon-grid` 流动（2.8s） | **降级为静态网格**（透明度 ×0.6）；或周期 9s + 透明度 ×0.5 二选一，默认静态 | 底部 perspective 网格保留氛围，去掉"流"的躁动 |
| `aurora-a/b` 漂移 | **保留但收敛**：透明度 ×0.6、周期 52s→70s | 氛围底色需要"活气"，但必须慢到不被察觉 |
| `gradient-text` 循环 | **改静态渐变**（ cyan→violet 定染）；仅首页 Hero 标题保留一次性入场 | 循环渐变大字是"廉价感"头号来源 |
| `glow-border` 旋转 | **限定**命令面板输入环单处使用，其余移除 | 旋转锥形边框全站只准有一处 |
| `shimmer-line` | **移除** | 与 skeleton 职责重叠 |
| `sweep` 光扫 | **保留**，仅用于首页/仪表盘 feature 卡片 hover | 一次性反馈，非循环 |
| `status-dot` 脉冲 | 保留（2.2s） | 遥测语义需要"活着"的指示 |
| `spotlight` 光标光晕 | 保留（pointer:fine 限定已有） | 指针跟随是反馈不是装饰 |
| `page-in` / `telemetry-cell` / `boot-*` | 保留（一次性入场） | 首屏编排是"仪式感"预算内 |

**收敛后每视图持续动画 ≤ 2 处**（aurora + status-dot 量级），达到 Linear 级安静度。

### 7.4 微交互目录（验收逐条核对）

| # | 触发 | 反馈 | 时长/曲线 |
| --- | --- | --- | --- |
| 1 | 按钮 press | scale(.985)+translateY(1px) | 100ms spring |
| 2 | 卡片 hover（可点击） | translateY(-2px)+wire 边+shadow-2 | 220ms standard |
| 3 | 列表行 hover | wire/6% 填充 + wire/45% 边 | 150ms |
| 4 | 复制成功 | `.pop` + Toast(success) | 220ms spring |
| 5 | Toast 入场/出场 | 上滑+scale 入 / 淡出上移出 | 320ms in / 220ms exit |
| 6 | 命令面板打开 | scrim 淡入 + 面板降入 + 输入框聚焦 | 320ms |
| 7 | 搜索 ↑/↓ | 激活项 wire/10% + 左 2px 条，`scrollIntoView({block:'nearest'})` | 150ms |
| 8 | 任务勾选 | 复选框 wire 填充 + 标题划线过渡 | 150ms |
| 9 | 统计卡数字更新 | count-up（tnum 防抖） | 480ms glide |
| 10 | TOC 滚动高亮 | 当前节 wire + 左 2px 条 | 150ms |
| 11 | 折叠面板展开 | height auto 过渡 + 内容 fade-up | 220ms |
| 12 | 表单校验失败 | 输入框 alert 边 + 一次性 shake | 400ms |
| 13 | 深链 focus（?focus=） | `focus-flash` 光环两闪 | 1.8s（已有） |
| 14 | 回到顶部 | FAB 滚过 1 屏后 pop 入场 | 220ms spring |
| 15 | 骨架→内容 | skeleton 淡出 + 内容 fade-up 接力 | 220ms |
| 16 | 移动菜单开合 | stagger 45ms/项 入场；整体 150ms 退场 | — |
| 17 | 路由转场 | VT old 淡出 160ms / new 上移淡入 320ms | 已有 |
| 18 | 主题无关：所有 reduced-motion 下 | 上述全部降级为无动画（白名单机制已有） | — |

### 7.5 触觉与反馈渠道

不使用声音与振动（浏览器场景收益低）；反馈渠道限定为：视觉（主）、`aria-live` 文本（无障碍兜底，Toast 已实现）。

---

## 8. 图标与视觉资产

1. **图标体系统一 Lucide**（已在依赖）：24 网格、stroke 1.5px、三档尺寸 16（行内）/20（按钮）/24（独立）；同语境同尺寸；**禁止 emoji 充当图标**（ui-ux-pro-max 红线）；
2. 品牌/技术栈图标用官方 SVG（Simple Icons 来源），已用于 AI 模型页的保持；
3. 头像/封面：`next/image` fill + object-cover（Next.js 栈准则）；
4. grain 纹理保留 3.5%（已有配方），是"电影感"的来源，不动；
5. OG 图：`public/og.png` 保持 1200×630，Phase 25D 首页定稿后同步刷新视觉。

---

## 9. 响应式适配策略

### 9.1 断点与全局行为

| 断点 | 宽度 | 布局行为 |
| --- | --- | --- |
| base | <640 | 单栏；容器 px-4；section 节奏 64；卡片网格 1 列；统计 2×2 |
| sm | 640 | 双栏萌芽；footer 横排 |
| md | 768 | 卡片 2 列；设置页双栏；工具页双栏 |
| lg | 1024 | 顶栏完整导航（收起汉堡）；文章三栏（TOC 出现）；卡片 3 列 |
| xl | 1280 | wide 容器生效；统计 4 列 |
| 2xl | 1536 | 内容不超宽（上限 --wide），两侧留白 |

### 9.2 逐页降级矩阵（375 / 768 / 1024 / 1440 四个锚点）

| 页面 | 375 | 768 | 1024 | 1440 |
| --- | --- | --- | --- | --- |
| 首页 | Hero 单栏，telemetry 2×2 | 同左+统计 4 列 | 同左+wide | 同左 |
| dashboard | bento 2×2，任务单栏 | 4 列统计+双栏 | wide+双栏 | 同左 |
| 文章详情 | 单栏，TOC 折为文末 details | 同左 | 三栏（TOC sticky） | 三栏+右元信息 |
| 列表页 | 筛选栏横滑，1 列 | 2 列 | 3 列+sticky 筛选 | 3 列 |
| 工具页 | 输入/输出纵向堆叠 | 双栏 | 双栏 | 双栏 |
| AI 对话 | 全屏流+底部输入 | 同左+宽气泡 | 同左 | 居中 72rem |
| 设置 | 单栏（分区手风琴） | 左导航+右面板 | 同左 | 同左 |
| 文章管理 | 表格横滑+渐隐 | 完整表格 | 同左 | 同左 |

### 9.3 触控与降级

- 触控目标 ≥44×44px（列表行、图标按钮、FAB 已达标；`.btn-sm` 在移动端场景替换为 md/lg）；
- `pointer: coarse` 时：spotlight 关闭（已有）、hover 类效果降级为 active 态；
- 移动端性能：horizon 高度 20vh（已有）、aurora 数量不减但模糊半径降级（`filter: blur()` 在低端机代价高，用预渲染渐变代替的方案记入 25E 验证项）。

---

## 10. 可访问性

1. **对比度**：3.3 章矩阵为验收依据，全部 ≥AA，目标 AAA；
2. **键盘**：⌘/Ctrl+K 面板、`/` 聚焦搜索、`?` 快捷键帮助、Esc 关层、↑/↓+Enter 选择、Tab 顺序符合视觉顺序（全部已有，25D 逐页回归）；
3. **焦点管理**：模态打开聚焦首元素、关闭归还焦点；`focus-visible` 环全局统一；
4. **朗读**：Toast `aria-live`（已有）；图表配数值文字；装饰层 `aria-hidden`；图标按钮 `aria-label`；
5. **动效敏感**：`prefers-reduced-motion` 白名单（已有，7.3 收敛后同步更新清单）；
6. **表单**：label 关联、错误文字 `aria-describedby`、必填 `aria-required`。

---

## 11. 落地实施路线（Phase 25A–25E）

总纪律：**每阶段独立 commit → CI 绿 → 视觉基线截图可评审 → 才进下一阶段**；任何阶段可单独回滚。

### 25A · 令牌层重铸（最低风险，先行）

- 改 `app/globals.css`：surface 5 级、ink 4 级、success/hair-strong/float/scrim/shadow-0、radius 增 2xl、motion 五档+三曲线、字阶以 CSS 类落地（`.text-h2/.text-body/.mono-label` 等映射第 4.2 表）；
- 改 `app/layout.tsx`：移除 Saira 加载（display 归 Geist）；
- **验收**：lint/typecheck/build 绿；34 项 Playwright 全绿（冒烟锚定 background 值不变）；`scripts/capture-baseline.mjs` 出前后对比图集，diff 仅令牌级（色阶/字阶）变化、无布局破损。

### 25B · 基础组件契约化

- `globals.css` 组件类：`.btn-ghost/.btn-danger/.banner/.table-base/.switch/.select-base/.tooltip` 新增；`.card` 四件套收敛；`.btn-loading` 态；
- 改 `components/Toast.tsx`（类型色接入 success）、`components/EmptyState.tsx`（纳入规范）；
- **验收**：6.2-6.6 状态矩阵逐项人工走查表打勾；新增 1-2 个组件级 Playwright 用例（banner 出现/消失、ghost hover 无位移）。

### 25C · 布局与导航

- 改 `components/SiteHeader.tsx`（亮边配方、激活态保持）、`components/PageHeader.tsx`（字阶接入）、`app/layout.tsx` footer、容器 token 落地到各页（`max-w-6xl` → `--content` 语义化替换，wide/prose 分级）；
- **验收**：四个锚点断点（375/768/1024/1440）截图；sticky 头部锚点跳转不被遮（`scroll-margin-top` 已有保持）。

### 25D · 页面级重设计（按优先级，每页独立 commit）

顺序：① 首页 `app/page.tsx`（7.3 动效收敛主战场）→ ② `/dashboard`（bento+统计卡配方样板）→ ③ `/posts/[slug]`（三栏阅读+排版样板）→ ④ `/posts` 列表 → ⑤ `/tools` → ⑥ `/ai/chat` → ⑦ `/settings` → ⑧ `/posts/admin`（表格样板）→ ⑨ 其余页面批量套令牌。
每页验收：功能回归（该页相关 Playwright 用例绿）+ 截图入基线 + 对比度抽查（该页新增文本色）。

### 25E · 动效收敛终验 + 全量质量

- 7.3 清单逐项核对（移除项确认无 CSS 残留、收敛项参数达标）；
- 全量：lint/typecheck/build/Playwright 34+；对比度脚本（3.3 矩阵）重跑；reduced-motion 走查（DevTools 模拟）；移动端真机尺寸走查；
- **验收**：每视图持续动画 ≤2（人工核验清单）；全文本对比度 ≥AA（脚本输出）。

---

## 12. 风险与对策

| 风险 | 概率/影响 | 对策 |
| --- | --- | --- |
| 大范围改动引入回归 | 中/高 | 分阶段+每阶段 CI 门禁+基线截图 diff；令牌先行（25A）隔离大部分视觉变化 |
| 移除 Saira 后首页 Hero 气质变化 | 中/低 | 25A 同屏对比评估；不达标则仅在 Hero 局部保留 Saira（可选项，默认不启用） |
| 动效收敛被感知为"变素" | 中/中 | 用精度补偿数量：亮边/等宽数字/字阶升级同步落地，"更精致"对冲"更安静" |
| globals.css 单文件继续膨胀 | 高/中 | 25A 拆分为 `styles/tokens.css` + `styles/components.css` + `styles/motion.css` 由 globals.css `@import`（Tailwind v4 原生支持） |
| Google 字体国内加载 | 低/— | `next/font` 构建期自托管，无运行时 CDN 依赖（现状已如此，保持不变） |
| 移动端模糊/渐变性能 | 中/中 | 25E 用基线截图帧率对比；必要时 aurora 改预渲染静态图 |

---

## 13. 预期效果

**质性（对标 Linear/Raycast/Vercel Dashboard 的公共配方全部落地）**：
边缘光、低饱和大面积、等宽数字、三级圆角、安静动效——五项目前只做到 2.5 项，重铸后 5/5。

**量化（验收可测）**：

| 指标 | 当前 | 目标 |
| --- | --- | --- |
| 文本组合对比度 ≥AA | 未系统测量（估 ~85%） | **100%（脚本实测）** |
| 文本组合对比度 ≥AAA | ~40% | **≥80%** |
| 每视图持续无限动画 | 5-7 处 | **≤2 处** |
| 字阶表外字号 | ~10 种 | **0** |
| 组件 6 态契约覆盖 | ~30% | **100%（常用组件）** |
| Playwright 冒烟 | 34 绿 | **34+ 绿（新增 banner/ghost 用例）** |
| 首页 LCP | 基线 | **不劣化（基线截图+CI 双轨）** |

---

## 附录 A：当前 → 目标令牌对照

| 令牌 | 当前 | 目标 | 动作 |
| --- | --- | --- | --- |
| `--background` | `#05070e` | 不变 | 冒烟锚定 |
| `--panel` `--raise` | `#0b1120` `#131c30` | 不变 | — |
| `--float` | 无 | `#16203a` | 新增 |
| `--scrim` | 无 | `rgba(3,6,11,.72)` | 新增 |
| `--foreground` `--print` `--muted` | 现值 | 不变 | Phase 23 已提亮 |
| `--faint` | 无 | `#56658a` | 新增 |
| `--success` | 无 | `#34d399` | 新增 |
| `--hair-strong` | 无 | `rgba(125,195,235,.34)` | 新增 |
| `--shadow-0` | 无 | 亮边配方 | 新增 |
| `--radius-2xl` | 无 | `28px` | 新增（模态/ Hero） |
| motion | fast140/base220/slow420 + spring | +instant100/glide480 + standard/exit 曲线 | 扩展 |
| 字体 | Geist+Saira+Noto+GeistMono | 移除 Saira | 精简 |

## 附录 B：规范 → 文件映射（实施索引）

| 规范章节 | 落点文件 |
| --- | --- |
| 3/4/5/7 令牌 | `app/globals.css`（拆分后 `app/styles/*.css`）、`app/layout.tsx` |
| 6.2 按钮 | `globals.css` 组件类 + 全站 `btn-*` 调用点 |
| 6.3 表单 | `components/SettingsView.tsx`、`components/blog/BlogManager.tsx`、`app/posts/admin` |
| 6.4 表格 | `app/posts/admin/page.tsx`、`components/blog/BlogManager.tsx` |
| 6.6 反馈 | `components/Toast.tsx`（已有）、新增 `components/Banner.tsx` |
| 7.3 收敛 | `app/globals.css` 动画区、`components/AmbientBackground.tsx`、`app/page.tsx` |
| 9 响应式 | 各页面（25D 顺序表） |
| 验证 | `.github/workflows/ci.yml`、`tests/*.spec.ts`、`scripts/capture-baseline.mjs` |

---

**文档状态**：设计方案 v1.0，待评审。评审通过后按第 11 章 25A 开始实施；每阶段验收证据（构建输出、测试计数、基线截图集）随阶段提交归档至 `plans/phase25-*.md`。
