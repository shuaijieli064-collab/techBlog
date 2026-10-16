/**
 * Shared AI provider config: ModelScope (魔搭社区) OpenAI-compatible models
 * and workspace agent presets. Server-safe — no secrets here; the API key
 * lives only in server env (MODELSCOPE_API_KEY) and is used by /api/ai/chat.
 */

export type AiModel = {
  id: string;
  label: string;
  short: string;
  desc: string;
  bestFor: string;
};

export const DEFAULT_MODEL = "Qwen/Qwen3.8-Flash-Next";

export const modelOptions: AiModel[] = [
  {
    id: "Qwen/Qwen3.8-Flash-Next",
    label: "Qwen3.8 Flash Next",
    short: "Qwen3.8 Flash",
    desc: "通义千问轻量快模型，响应速度优先，适合日常问答、任务规划与轻量写作。",
    bestFor: "快速通用 · 任务规划 · 日常问答",
  },
  {
    id: "Qwen/Qwen3.5-35B-A3B",
    label: "Qwen3.5 35B（A3B 激活）",
    short: "Qwen3.5 35B",
    desc: "千问 35B 高质写作模型，长文结构、技术博客与深度内容生成质量更高。",
    bestFor: "高质量写作 · 长文生成 · 技术博客",
  },
  {
    id: "deepseek-ai/DeepSeek-V4.1-Flash",
    label: "DeepSeek V4.1 Flash",
    short: "DeepSeek V4.1",
    desc: "DeepSeek 快模型，中文理解与代码生成均衡，性价比高。",
    bestFor: "代码生成 · 中文问答 · 快速迭代",
  },
  {
    id: "deepseek-ai/DeepSeek-V4-Pro",
    label: "DeepSeek V4 Pro",
    short: "DeepSeek V4 Pro",
    desc: "DeepSeek 深度推理模型，复杂逻辑、算法推演与代码审查场景更强。",
    bestFor: "深度推理 · 算法分析 · 代码审查",
  },
  {
    id: "ZhipuAI/GLM-5.2",
    label: "GLM 5.2（智谱）",
    short: "GLM 5.2",
    desc: "智谱 GLM 最新版，写作润色与结构化输出稳定。",
    bestFor: "写作润色 · 结构化输出 · 文档整理",
  },
  {
    id: "MiniMax/MiniMax-M3",
    label: "MiniMax M3",
    short: "MiniMax M3",
    desc: "MiniMax M3 通用模型，长上下文与多轮对话表现均衡。",
    bestFor: "长对话 · 多轮任务 · 通用助手",
  },
];

export type AgentPreset = {
  id: string;
  name: string;
  role: string;
  desc: string;
  model: string;
  system: string;
};

export const agentPresets: AgentPreset[] = [
  {
    id: "coding",
    name: "代码生成助手",
    role: "Coding",
    desc: "根据需求生成函数、组件与脚手架代码，补充类型与基础测试。",
    model: "deepseek-ai/DeepSeek-V4.1-Flash",
    system:
      "你是一名资深软件工程师，精通 TypeScript / React / Next.js 与通用后端技术。根据需求直接给出可运行代码，包含类型定义与必要的边界处理；解释关键设计决策，语气简洁，输出 Markdown。",
  },
  {
    id: "writing",
    name: "文档润色助手",
    role: "Writing",
    desc: "把技术草稿整理成结构清晰的博客、README 与复盘文档。",
    model: "ZhipuAI/GLM-5.2",
    system:
      "你是一名技术内容编辑，擅长把草稿整理成结构清晰、语气自然的中文博客或文档。保留技术细节与代码示例，去除空话，输出 Markdown，标题层级合理。",
  },
  {
    id: "debug",
    name: "Bug 排查助手",
    role: "Debug",
    desc: "根据堆栈与复现步骤定位根因，给出最小验证与修复建议。",
    model: "deepseek-ai/DeepSeek-V4.1-Flash",
    system:
      "你是一名资深调试工程师。根据错误信息、堆栈或现象先定位最可能的根因，给出最小复现思路与修复方案，最后列出验证步骤；不要泛泛而谈，输出 Markdown。",
  },
  {
    id: "review",
    name: "代码审查助手",
    role: "Review",
    desc: "检查 diff 中的逻辑风险、安全问题与可维护性坏味道。",
    model: "deepseek-ai/DeepSeek-V4-Pro",
    system:
      "你是一名严格的代码审查者。逐项检查逻辑正确性、安全风险（注入/XSS/越权等）与可维护性，按「问题 → 风险等级 → 修复建议」输出，给出具体代码片段，输出 Markdown。",
  },
  {
    id: "tutor",
    name: "学习规划助手",
    role: "Tutor",
    desc: "按目标拆解学习路线，生成每日任务与阶段性复盘问题。",
    model: "Qwen/Qwen3.8-Flash-Next",
    system:
      "你是一名编程学习导师。基于用户当前掌握情况与学习记录拆解下一步计划：优先补薄弱点，任务具体可执行（含时长建议），定期给出复盘问题；输出 Markdown。",
  },
  {
    id: "i18n",
    name: "多语言翻译助手",
    role: "i18n",
    desc: "技术文档中英互译，保留代码块与术语一致性。",
    model: "MiniMax/MiniMax-M3",
    system:
      "你是一名技术文档翻译。中英互译时保留代码块、术语表一致性与 Markdown 结构；术语首次出现可附原文；输出仅包含译文，不添加注释。",
  },
];

export function modelById(id: string): AiModel | undefined {
  return modelOptions.find((m) => m.id === id);
}

export function agentById(id: string): AgentPreset | undefined {
  return agentPresets.find((a) => a.id === id);
}
