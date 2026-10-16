# Phase 18 · AI 能力整体接入（ModelScope 真实化）

> 背景：用户接入 ModelScope（魔搭社区）API Key 后，要求对程序整体功能进行完善。本阶段把站点内所有 AI 相关 mock / 静态占位升级为真实 LLM 调用，并新增统一 AI 对话工作台，AI 能力贯穿 AI 中心 → 工作台 → 学习 → 写作全链路。

## 交付清单

### 新建
- `lib/ai.ts` — 统一模型清单（6 个 ModelScope 模型）+ 6 个 Agent 预设（角色 / 推荐模型 / 系统提示），单一数据源
- `app/api/ai/status/route.ts` — 只读状态接口：`{ provider, configured, baseUrl, defaultModel, models }`，**永不返回 Key 本身**
- `components/AiChat.tsx` — 通用 AI 对话工作台：模型切换 / Agent 预设 / 注入工作台数据（今日任务 / 学习记录 / 路线图进度）/ Markdown 渲染 / 会话 localStorage 持久化 / 失败提示
- `app/ai/chat/page.tsx` — AI 对话页（支持 `?agent=xx` 预选角色）
- `components/AiAssistantCard.tsx` — 工作台 AI 助手卡：基于真实数据（今日任务 / 任务箱 / 学习记录 / 路线图 / 算法）生成今日行动建议，支持复制 / 重新生成 / 去对话
- `scripts/capture-phase18.mjs` — Phase 18 验证截图脚本

### 修改
- `app/ai/models/page.tsx` — **重写**：虚构 GPT-4o / 假费用 → 真实配置状态页（服务端直读 env：API Key 已配置 / 接入端点 / 默认模型 + 6 个真实模型卡 + 调用说明）
- `app/ai/agents/page.tsx` — **重写**：静态假模型 → lib/ai.ts Agent 预设（真实模型映射）+「去对话」入口
- `app/ai/page.tsx` — 入口卡 3 → 4（新增「AI 对话」）
- `components/AiBlogDraft.tsx` — 模型下拉改引用 `lib/ai.ts` 统一清单（消除双份定义）
- `components/CommandPalette.tsx` — 注册 `/ai/chat` 页面
- `components/DailyTasks.tsx` — **AI 规划今天真实化**：真实上下文 prompt → `/api/ai/chat` → JSON 任务数组容错解析写入今日任务；失败自动回落本地规则并提示；规划中 loading 态
- `app/dashboard/page.tsx` — 右侧静态「AI 助手」mock 卡替换为 `<AiAssistantCard />`（LIVE 徽标）
- `components/LearningRoadmap.tsx` — 导出 `defaultData`（供对话 / 规划引用真实路线图结构）

## 验证结果

| 项 | 结果 |
| --- | --- |
| `npm run lint` | ✅ 0 error 0 warning |
| `npm run typecheck` | ✅ 通过 |
| `npm run build` | ✅ 通过（`/ai/chat`、`/api/ai/status` 入路由清单） |
| `npm test` | ✅ **25/25**（既有 21 + Phase 17 新增 4，零回归） |
| `/api/ai/status` 实测 | ✅ `configured=True`，6 模型，默认 Qwen3.8-Flash-Next |
| `/api/ai/chat` 实测 | ✅ 真实调用 ModelScope 并返回模型回复（链路贯通） |
| 截图走查 | ✅ ai-chat / ai-models / ai-agents / dashboard / AI 助手卡特写 |

## 安全边界

- API Key 仅存于 `.env.local`（`MODELSCOPE_API_KEY` / `MODELSCOPE_BASE_URL`），只被服务端 `/api/ai/chat` 使用；`/api/ai/status` 只返回是否配置，不返回 Key
- 前端任何组件不接触 Key；models 页说明文案同步修正（移除虚构 Supabase 表述）
- 真实调用仅在用户主动触发时发生（对话发送 / 生成建议 / AI 规划按钮），无自动消耗

## 后续可选（P2）

- GitHub 活动真实化：设置环境变量 `GITHUB_USERNAME`（当前 FALLBACK 示例数据）
- 对话流式输出（SSE）与断点续传
- 外部日历（飞书 / Google）接入本周规划
- AI 用量统计：ModelScope 控制台接入
