# Phase 17 · 工作台操作性升级（Developer OS 可操作化）

> 目标：把工作台从「展示仪表盘」升级为**可操作的日常生产力工具**——覆盖用户确认的四类操作性（任务/项目闭环、数据录入与编辑、外部数据联动、命令式快捷操作）与四个使用场景（管理项目与 TODO、快速开始工作、每日记录与打卡、统计与复盘）。

## 四条主线交付内容

### A 命令式快捷操作 —— 快速开始工作
- **全局命令面板 `CommandPalette`**（新组件，零依赖自实现）
  - `Ctrl/⌘ + K` 全局唤起，`SiteHeader` 常驻 ⌘K 按钮（移动端显示图标）
  - 搜索范围：16 个页面路由 / 13 个工具函数 / 5 个快捷动作
  - 交互：实时过滤、↑↓ 选择、Enter 执行（软导航 `router.push`）、Esc 关闭、无结果空态、分组标签（页面/工具/动作）
- 快捷动作：记一条学习记录（跳转学习中心并聚焦表单）、添加今日任务、打开任务箱、AI 规划今天、本周概览

### B 任务/项目闭环 —— 管理项目与 TODO
- **任务箱 `TaskBoard`**（新 workspace 域 `task-board`，持久化）
  - 任务模型：`{ id, title, tag, priority 0-2, status backlog|today|done, createdAt }`
  - 三态分组（待办/今日/已完成）+ 优先级标记（紧急 alert / 重要 signal / 普通）
  - 操作闭环：添加 → 移到今日（写入今日任务清单）→ 完成（同步勾选今日清单）→ 恢复/删除（联动清理今日清单副本）
- **项目 TODO 补全增删**：`ProjectTodos` 新增「添加 TODO」输入与删除按钮（列表页与详情页共用组件同步，进度实时重算）

### C 数据录入与编辑完善 —— 每日记录与统计复盘
- **学习记录增强 `StudyRecords`**
  - 主题改预设下拉（Java/算法/后端/数据库/前端/工具/其他），消除自由文本噪音
  - 编辑模式：点铅笔回填表单 → 保存（id/date 不变）/ 取消
  - 按周分组（本周/上周/更早）+ 头部周统计（本周 x.xh）
  - 空状态引导；`?focus=record` 自动聚焦表单（命令面板联动）
- **技能自定义 `SkillLevels`**：新增自定义技能（name + 初始 50%）与删除，实时联动持久化
- **本周概览 `WeekOverview`**（dashboard 新卡）：本周学习时长 + 7 天趋势 Sparkline、路线图总掌握环形、算法总掌握环形、连续学习天数、本周记录数——全部真实数据，复用 Phase 16 viz 组件

### D 外部数据联动 —— 真实数据接入
- **GitHub 真实活动 `GET /api/github/events`**：服务端代理 `api.github.com/users/{user}/events/public`（免 token），用户名可通过环境变量 `GITHUB_USERNAME` 配置（当前占位 `Nox7th`）；事件映射 PushEvent→commit、PR→pr、Watch→star 等，8 秒超时兜底
- **GitHub 活动卡改造**：真实优先、失败/离线回落示例数据，状态徽标 `LIVE · 用户名 / FALLBACK · 示例数据`
- **本周规划 `WeekPlan`**（dashboard 新卡）：周一至周日 7 列，每列显示当日学习记录，今日列高亮并展示今日任务（真实本地数据）
- **AI 规划增强 `DailyTasks.planToday`**：基于真实数据规则生成——任务箱待办前 2 条 + 路线图首个未掌握知识点 + 算法剩余最多的前 2 类，生成后置顶今日清单；无数据时回落原静态模板（真实 LLM 调用列为 P2，需用户提供 API Key）

## 验证结果

| 项 | 结果 |
| --- | --- |
| `npm run lint` | ✅ 0 error 0 warning |
| `npm run typecheck` | ✅ 通过 |
| `npm run build` | ✅ 通过（路由清单完整） |
| `npm test` | ✅ **25/25**（既有 21 不回归 + 新增 4 个操作链路用例） |
| before/after 截图 | ✅ 25 张终版重抓，dashboard/learning 走查通过 |

新增测试用例（`tests/01-operations.spec.ts`）：
1. 命令面板 Ctrl+K 打开 → 过滤 → Enter 跳转 → Esc 关闭
2. 任务箱：添加 → 移到今日（写入今日清单）→ 完成 → 恢复（联动清理）
3. 学习记录：添加 → 编辑保存（id/date 不变，标题更新）
4. GitHub 活动卡渲染（LIVE/FALLBACK 徽标）

## 变更文件清单

**新建**
- `components/CommandPalette.tsx` / `components/TaskBoard.tsx` / `components/WeekOverview.tsx` / `components/WeekPlan.tsx`
- `app/api/github/events/route.ts`
- `tests/01-operations.spec.ts`

**修改**
- `app/layout.tsx`（挂载 CommandPalette）、`components/SiteHeader.tsx`（⌘K 按钮）
- `app/dashboard/page.tsx`（本周概览 + 任务箱 + 本周规划接入、Reveal 编排）
- `components/DailyTasks.tsx`（AI 规划增强、类型导出）、`components/ProjectTodos.tsx`（TODO 增删）
- `components/StudyRecords.tsx`（下拉/编辑/周分组/周统计/空状态 + 排序稳定性修复）、`components/SkillLevels.tsx`（自定义技能）
- `components/GitHubActivity.tsx`（LIVE/FALLBACK 真实接入）、`components/LearningRoadmap.tsx`（导出 defaultData/defaultMastered）
- `lib/workspace/types.ts`（`task-board` 域注册）

## 需要用户后续配置（P2）

- **GitHub 用户名**：设置环境变量 `GITHUB_USERNAME` 后 GitHub 活动卡自动切 LIVE（当前为占位 `Nox7th`）
- **真实 AI 调用**：接入 LLM API Key 后可将 AI 规划升级为真智能生成
- **外部日历**：如需接入飞书/Google 日历可作为下一轮
