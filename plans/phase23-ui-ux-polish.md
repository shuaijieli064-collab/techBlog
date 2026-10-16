# Phase 23 — UI 精修与体验提速

> 目标：在 Phase 21/22 的设计语言基础上做一轮「审美 + 效率」双升级——视觉更现代，
> 交互更少步骤、反馈更及时。技术栈、信息架构、页面结构不变。

## 一、视觉层（设计系统精修，app/globals.css）

| 维度 | 改动 |
| --- | --- |
| 配色 | `--muted` #7c8daa → #8ea0bd、`--print` #a7b6d0 → #b7c4da（正文/次级文本对比度提升，面板上达到 AA）；`--hair` 0.15 → 0.18、`--grid-line` 0.05 → 0.055（结构线更清晰） |
| 背景 | body 增加一层极淡顶部径向渐变（cyan 5%），深空底色不再「平」，`background-color` 保持 #05070e（冒烟断言不变） |
| 数字 | 新增 `.num` 工具类（tabular-nums），统计/计数数字防抖动 |
| 按压 | 新增 `.press`：可点击表面统一 `:active` scale(0.97) 触觉反馈，reduced-motion 下自动禁用 |
| 序列入场 | 新增 `.stagger-in > *`（nth-child 45ms 递增延迟），用于任务列表等动态列表 |
| 反馈动效 | 新增 toast 进出场（toast-in/out + 进度条）、错误 shake、`mark` 高亮样式统一、`[id]` scroll-margin-top 5.5rem（TOC 锚点不被 sticky 头部遮挡） |
| 原生控件 | `html { color-scheme: dark }`，表单/滚动条等原生元素随深色主题 |
| 可访问性 | reduced-motion 覆盖清单同步扩充（toast/stagger/shake/press） |

## 二、反馈系统（新增 components/Toast.tsx）

- `ToastProvider` + `useToast()`，右上角堆叠（移动端顶部通栏），最多 3 条，超出挤出最早
- `aria-live="polite"` role="status"；hover 暂停倒计时；底部细线进度条可视化剩余时间
- 三型：success（wire）/ error（alert）/ info（signal）
- 接入点（原先静默失败或无反馈的操作）：
  - 命令面板「导出全部数据」：成功/失败 toast
  - 设置页：导出、导入恢复（逐域统计成功数）、清空文章，替换原 inline 文字消息
  - 今日任务「AI 规划今天」：成功条数 / 失败回落原因，移除两块 inline 提示

## 三、命令面板（components/CommandPalette.tsx）

- **fuzzy 匹配**：子序列匹配 + 评分（前缀 > 连续 > 跳字符；label 权重 ×3），
  「psts」可命中「文章列表」(posts)
- **最近访问**：localStorage `nexus:recent-pages`（5 条），面板空查询时置顶「最近」组，
  支持一键清除；页面跳转时自动记录
- 结果计数显示；「最近」组用 Clock 图标区分

## 四、搜索页（components/SearchView.tsx）

- **键盘导航**：↑/↓ 跨全部结果移动（高亮 + scrollIntoView），Enter 直接打开
- **最近搜索**：localStorage `nexus:recent-queries`（6 条，停止输入 700ms 后落库），
  空查询时渲染 chips，单条删除 / 一键清除 / 点击即搜
- 空态文案补充键盘操作说明；高亮 mark 走统一样式

## 五、导航简化（components/SiteHeader.tsx）

- 顶级导航移除低频「设置」（10 项），保留页脚 + ⌘K + 命令面板三路可达
- 右侧工具区合并为「搜索/命令」输入式按钮（Linear/Raycast 模式，桌面显示占位文案 + ⌘K，
  移动端显示搜索图标），点击直达命令面板——比原来的「小 ⌘K 按钮 + 放大镜链接」更醒目且少一个入口
- 移动菜单：Esc 关闭、35ms/项序列入场

## 六、其他

- 新增 `components/Greeting.tsx`：时间感知问候（早上好/下午好/晚上好…），
  client 计算 + 每分钟刷新，不强制页面 dynamic
- `app/loading.tsx`：全局 spinner → 骨架屏（头部 + 卡片网格镜像真实布局），提升感知速度
- 快捷键帮助（?）更新为 ↑/↓/Enter 语义
- Dashboard 快捷操作、最近文章、分类筛选按钮补 `.press`

## 七、测试（tests/smoke.spec.ts 新增 5 例，全套 34/34 通过）

1. Ctrl+K 打开面板 → 输入 → Enter 导航
2. fuzzy 跳字符匹配（psts → 文章列表）
3. 搜索页 ↑/↓ + Enter 打开首个结果
4. 最近搜索落库 + chips 一键重查
5. 命令面板导出触发 toast

验证：`npm run typecheck` / `npm run lint` / `npm run build` / Playwright 34/34 全绿
（测试需 virgin 库：重置 data/test.db 三件套并重启服务器，否则幂等/累积类用例失败）。
