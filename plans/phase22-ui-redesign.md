# Phase 22 · UI 系统性重设计（设计语言 v2「NEBULA」）

> 目标：在**功能、信息架构、技术栈完全不变**的前提下，对整体 UI 做系统性重设计——重新规划视觉层级、配色、字体、间距、圆角、阴影与组件样式，形成统一设计语言；优化核心页面与关键交互状态；加入恰当的过渡动画与反馈；保证桌面/移动端响应式与基本可用性、可访问性。

---

## 一、设计语言总纲

从「锐利 HUD」演进为 **「crisp-modern 深空控制台」**：保留 HUD DNA（网格、辉光、等宽字体遥测、扫描线），引入现代产品级的柔和层次。

| 维度 | v1（旧） | v2（新） |
|---|---|---|
| 底色 | `#070b12` | `#05070e`（更深的空间底） |
| 表面 | 纯色 panel，无阴影 | panel/raise 梯阶 + 顶部渐变微光 + 一级阴影 |
| 圆角 | 全直角（0） | 令牌阶：卡片 14 / 控件 10 / 小件 6-8 / 标签 pill / 圆点例外 |
| 阴影 | 无 | 三级：`shadow-1` 静置 / `shadow-2` 悬浮 / `shadow-glow` 强调 |
| 按钮 | 纯色平底 | 青→蓝渐变 + 内高光 + 辉光 + 按压回弹 |
| 墨色 | `#dce6f5/#9fb0c8/#6f82a0` | `#e9f0fd/#a7b6d0/#7c8daa`（对比度提升） |
| 动效 | 散落 ease | 三速 + 单一 spring 曲线，全局令牌化 |

---

## 二、设计令牌（`app/globals.css`）

```css
:root {
  --background:#05070e; --panel:#0b1120; --raise:#131c30;
  --foreground:#e9f0fd; --print:#a7b6d0; --muted:#7c8daa;
  --wire:#5ce1ff; --violet:#a78bfa; --signal:#ffb454; --alert:#ff5f6b;
  --radius-xs:6px; --radius-sm:8px; --radius-md:10px; --radius-lg:14px; --radius-xl:20px;
  --shadow-1 / --shadow-2 / --shadow-glow
  --ease-spring:cubic-bezier(.22,1,.36,1); --dur-fast:140ms; --dur-base:220ms; --dur-slow:420ms;
}
```

圆角与阴影通过 `@theme inline` 接入 Tailwind：`rounded-sm/md/lg/xl` 映射设计阶，`shadow-panel/lift/glow` 映射阴影级——全站任意处使用同一语言。

## 三、组件类升级

- **`.card`**：14px 圆角 + 180° 顶部渐变微光（4% 白）+ 一级阴影 + hairline 描边
- **`.card-hover`**：hover 上浮 3px、边框转 45% 青色、二级阴影（spring 曲线）
- **`.btn-primary`**：135° 青→蓝渐变、内高光、静置辉光；hover 提亮 + 辉光增强；**active 下压 1px + scale 0.985**（按压反馈）
- **`.btn-secondary`**：同步圆角与按压；hover 边框点亮
- **`.chip`**：pill 化；hover 带 8% 青色底
- **`.input-base`**：focus 时 3px 青色光环（替代旧外发光）
- **新增**：`.pill`（状态遥测徽标）/ `.kbd`（键帽）/ `.link-underline`（下划线生长）/ `.row-hover`（列表行）/ `.skeleton`（骨架屏微光扫描）/ `.pop`（确认弹跳）/ `.fade-up`（入场）
- 滚动条 thumb 圆角化；`::selection` 指定前景色

## 四、圆角批量规整（108 处，两轮脚本 + 人工定制）

- 第一轮：49 处精确类名映射（26 文件）——图标盒、徽标、面板、选择器、空态、下拉、骨架
- 第二轮：59 处（33 文件）——模板字符串条件类名逐个人工定制：筛选 pill（PostsExplorer / GrowthTimeline / PromptLibrary / TaskBoard）、工具选择器、聊天气泡（`rounded-xl` + 尾角 `rounded-br/bl-sm`）、FAB（`rounded-full`）、复选块（5px）
- 进度条 track + fill 全部圆角化（SkillBars / SkillLevels / AlgorithmProgress / ProjectList）
- 依据实测 CSS 层序，清除被 `.card-hover:hover` 覆盖的死悬浮类（首页学习卡片 `hover:-translate-y-1` 等）

## 五、核心页面与关键交互

| 界面 | 改动 |
|---|---|
| 导航 `SiteHeader` | 桌面激活态 underline → **pill**（`bg-wire/10`）；移动端左指示条加右圆角；logo 标 10px 圆角 |
| 首页 hero | 卡片化（`.card` 圆角+阴影+辉边框）；CTA 主按钮渐变+光泽扫过； eyebrow 前置渐变短划线 |
| 仪表盘 | hero 区入 `.card` 体系；`SYSTEM ONLINE` 入 `.pill`；快捷操作/最近文章行圆角+阴影 |
| 命令面板 | 面板 `rounded-xl`；行 `rounded-md`；**激活态左侧 2px accent 条**；ESC 入 `.kbd` |
| 文章正文（`lib/markdown.ts`） | h2/h3 加 `#`/`##` 等宽前缀标记；行高 1.78；引用右侧圆角+左侧 accent；表格容器圆角+分区细线（去单元格全框）；列表 marker 青色；行内代码 pill；`<hr>` 渐变细线 |
| 文章页 | 目录激活态左 accent 条；「置顶」徽标 pill；返回链接箭头位移动效；标签 pill |
| 搜索页 | 结果区 `key={query}` 整体淡入；`<mark>` 高亮加圆角内距；ESC 入 `.kbd` |
| 聊天气泡 | 用户/助手差异化尾角；消息 `fade-up` 入场 |
| 反馈 | 复制/分享成功图标 `.pop` 弹跳（CodeBlock / CopyButton / PostEngagement） |
| AI 中心 | 入口卡箭头 hover 右移；关于页统计块转迷你卡 |

## 六、动效与反馈系统

- **按压**：全部 `.btn-*` active 下压回弹
- **悬浮**：卡片上浮+阴影两级、行填充、下划线生长、箭头微移
- **入场**：路由 `page-in`（已有）、`fade-up`（聊天气泡/搜索结果）、`Reveal` 滚动 disclosure（已有）
- **确认**：`.pop` 一次性弹跳
- **加载**：`.skeleton` 微光扫描（备用骨架）；路由 `loading.tsx` 保留 spinner
- **全部新动画纳入 `prefers-reduced-motion`**（含 transform 按压/悬浮禁用）

## 七、响应式与可访问性

- FAB（返回顶部/快捷键帮助）触控目标 40→**44px**，并加 `env(safe-area-inset-bottom)` 底部安全区
- `:focus-visible` 光环统一带 6px 圆角，全站键盘焦点可见
- 对比度：foreground/print/muted 三级墨色全部加深提亮，正文/次要/弱化层级在深底上 ≥ 7:1
- 窄屏行为不变（既有断点体系）：pill/圆角组件均自适应；命令面板、对话框 `max-w` + `px-4` 边距保留

## 八、验证结果

- `npm run lint` ✅ 0 错误
- `npm run typecheck` ✅ 0 错误
- `npm run build` ✅ 7.3s 编译通过
- `npm test` ✅ **29/29** Playwright 通过（唯一需同步的用例：dark-canvas 背景色随令牌更新为 `rgb(5,7,14)`）

## 九、涉及文件（摘要）

- 设计系统：`app/globals.css`（令牌/组件类/动效/reduced-motion）
- 排版引擎：`lib/markdown.ts`（正文全块级样式）
- 组件：`SiteHeader` / `CommandPalette` / `PostCard` / `PostToc` / `PostEngagement` / `CodeBlock` / `CopyButton` / `SearchView` / `BackToTop` / `KeyboardHelp` / `AiChat` / `EmptyState` / `SkillBars` / `SkillLevels` / `AlgorithmProgress` / `ProjectList` / `ToolsExplorer` / `PromptLibrary` / `PostsExplorer` / `GrowthTimeline` / `TaskBoard` / `WeekPlan` / `SettingsView` / 全部 `tools/*`
- 页面：`app/page.tsx` / `app/layout.tsx` / `app/dashboard` / `app/posts/[slug]` / `app/ai` / `app/about` / `app/profile` 等

> 技术栈不变：Next.js 16 + React 19 + Tailwind v4（CSS-first 令牌）；无新增依赖；全部改动为增量修改，可直接运行。
