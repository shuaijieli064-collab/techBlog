export type PromptItem = {
  id: string;
  title: string;
  category: string;
  content: string;
  useCount: number;
};

export const promptCategories = [
  "Java 开发",
  "Bug 排查",
  "项目架构",
  "SQL 查询",
  "Git 操作",
] as const;

export const seedPrompts: PromptItem[] = [
  {
    id: "p1",
    title: "Java 代码优化提示词",
    category: "Java 开发",
    useCount: 128,
    content:
      "你是一位资深 Java 工程师。请审查我给出的代码，重点关注：1) 集合与流是否高效 2) 异常是否被吞掉 3) 并发是否安全 4) 命名与职责是否清晰。输出：问题列表 + 修改建议 + 重构后代码。",
  },
  {
    id: "p2",
    title: "Bug 自动排查提示词",
    category: "Bug 排查",
    useCount: 96,
    content:
      "你是排障专家。根据以下报错栈、复现步骤和最近变更，给出：1) 最可能的 3 个根因 2) 每个根因的验证方法 3) 最小修复方案。不要一次给太多无关建议。",
  },
  {
    id: "p3",
    title: "项目架构设计提示词",
    category: "项目架构",
    useCount: 78,
    content:
      "你是软件架构师。根据业务需求输出：模块划分、数据流、技术选型理由、风险与取舍。用分层列表呈现，避免空话，每个决策写清 trade-off。",
  },
  {
    id: "p4",
    title: "SQL 性能优化提示词",
    category: "SQL 查询",
    useCount: 234,
    content:
      "你是 DBA。给我这条 SQL 与表结构/索引/大致数据量，输出：执行计划瓶颈分析、索引建议、改写 SQL，并说明每步优化预期收益。",
  },
  {
    id: "p5",
    title: "Git 提交规范提示词",
    category: "Git 操作",
    useCount: 156,
    content:
      "根据 diff 生成符合 Conventional Commits 的提交信息：type(scope): subject，正文写清动机与影响，不要复述代码行。",
  },
];
