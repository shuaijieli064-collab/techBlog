# Phase 19 六项体验优化（Refine & Real-data）

> 本轮把用户提出的 6 项优化全部落地：菜单栏 bug、字体、项目结构、内容真实性、博客、GitHub 账号接入。其中 GitHub 真实账号由用户提供截图（`shuaijieli064-collab`）并完成校验接入。

## 1. 菜单栏 bug 修复（`components/SiteHeader.tsx`）

| 问题 | 修复 |
| --- | --- |
| AI 中心下拉缺少 Phase 18 新建的 `/ai/chat`（AI 对话）入口 | 下拉补「AI 对话」项（总览 / AI 对话 / 模型 / Agents / 提示词库） |
| 桌面下拉面板 `mt-2` 间隙导致鼠标从按钮移到菜单时触发 `pointerleave` 闪烁关闭 | 改为 `top-full pt-2` 容器 + 内层面板，hover 通道连续无闪烁 |
| 渲染期 `useState` 调整改用 effect 曾被 eslint `set-state-in-effect` 拦截 | 采用 React 官方推荐的渲染期 state 调整模式（`lastPathname` 守卫），lint 零告警 |

## 2. 字体优化（`app/globals.css`）

- **正文中文统一为 Noto Sans SC**：body font-family 将 `var(--font-noto-sc)` 提到中文首位（原顺序 Geist → PingFang → Hiragino → 微软雅黑，Windows 上正文命中微软雅黑，与标题 Noto Sans SC 字形不一致）；现为 Geist(西文) → Noto SC(中文) → 系统兜底。
- 清理 `--display-family` 尾部重复的 `"Noto Sans SC"` 系统字面量（与 `var(--font-noto-sc)` 重复）。
- 字体加载（layout.tsx）结构不变：Geist / Geist_Mono / Saira / Noto_Sans_SC 自托管，零新增依赖。

## 3. 项目结构优化

- **AI 组件归组**：`components/ai/` 目录（`AiChat.tsx` / `AiAssistantCard.tsx` / `AiBlogDraft.tsx`），更新 3 处引用（dashboard / knowledge / ai/chat）。
- **清理冗余**：删除从未接入的无引用组件 `components/SkeletonCard.tsx`（Phase 16 遗留占位）。

## 4. 内容真实性优化（`lib/projects.ts`）

- `study-assistant` → `github.com/shuaijieli064-collab/Intelligent-Growth-Platform-for-College-Students`（大创平台真实仓库，与截图仓库一致）
- `tech-blog` → `github.com/shuaijieli064-collab/techBlog`（真实仓库）
- `algorithm-tracker` → 指向账号主页 `github.com/shuaijieli064-collab`（公开仓库中暂无对应算法仓库，待建；非死链）
- 说明：项目描述中的技术栈（如 Java/Spring）与真实仓库语言存在差异（仓库语言以 GitHub 为准），已如实保留原文案，如需对齐可后续调整。

## 5. 博客优化（`components/PostPagination.tsx` + `app/posts/[slug]/page.tsx`）

- 新增「上一篇 / 下一篇」导航卡片（按发布时间相邻，含日期与标题，hover 高亮；无相邻文章时该侧自动隐藏）。
- 底部保留「返回文章列表 / 回到首页」入口。

## 6. GitHub 我的账号接入

- 校验：`api.github.com/users/shuaijieli064-collab` 存在（8 个公开仓库，Shuaijie Li）。
- `.env.local` 追加 `GITHUB_USERNAME=shuaijieli064-collab`；`.env.example` 补充 `GITHUB_USERNAME` 说明。
- `app/api/github/events/route.ts` 无需改动（读取 env 自动切 LIVE）；dashboard GitHub 卡实测显示 **LIVE · shuaijieli064-collab** 与真实事件（techBlog 仓库 commit）。

## 验证

| 项 | 结果 |
| --- | --- |
| eslint（--max-warnings=0） | ✅ 0 error 0 warning |
| typecheck（tsc --noEmit） | ✅ 通过 |
| `npm test`（Playwright） | ✅ **25/25** 零回归（含命令面板、GitHub 卡徽标用例） |
| 浏览器实测 | ✅ GitHub 卡 LIVE·真实数据；移动菜单含「AI 对话」；文章页「上一篇」卡片正确、无下一篇时隐藏 |
| build | ✅ 见构建日志（后台完成） |

## 待办/说明

- `algorithm-tracker` 的 GitHub 链接指向账号主页，仓库公开后可精确替换。
- 项目描述技术栈与真实仓库语言未强改（保留用户原文案，可校对后微调）。
- 公开 events API 无 token 限额 60 次/小时（当前用量远低于限额）；如需更高限额可配 `GITHUB_TOKEN`。
