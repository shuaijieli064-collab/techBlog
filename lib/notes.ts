export type Note = {
  slug: string;
  title: string;
  summary: string;
  group: string;
  tags: string[];
  date: string;
  readTime: string;
  content: string;
  relatedPostSlugs?: string[];
};

export const noteGroups = [
  {
    title: "Java 基础",
    summary: "面向对象、集合、异常和常用 API 的核心理解",
    tags: ["Java", "Java 基础", "面向对象"],
  },
  {
    title: "后端框架",
    summary: "Spring Boot、服务拆分与请求处理链路",
    tags: ["Spring Boot", "后端框架"],
  },
  {
    title: "数据库与数据访问",
    summary: "MySQL、MyBatis 与事务设计思路",
    tags: ["MySQL", "MyBatis", "数据库"],
  },
  {
    title: "缓存与消息队列",
    summary: "Redis、削峰填谷与异步任务的应用场景",
    tags: ["Redis", "消息队列", "架构设计"],
  },
];

export const notes: Note[] = [
  {
    slug: "java-collections-cheatsheet",
    title: "Java 集合速查：List / Set / Map 怎么选",
    summary: "常用集合选型、复杂度与常见坑，一页速查。",
    group: "Java 基础",
    tags: ["Java", "集合", "HashMap"],
    date: "2026-09-12",
    readTime: "4 分钟",
    relatedPostSlugs: ["data-structures-learning-routine"],
    content: `# Java 集合速查

面向日常编码的选型笔记，优先记「什么时候用」而不是背 API。

## 选型表

| 场景 | 首选 | 备注 |
|------|------|------|
| 有序可重复 | ArrayList | 随机访问 O(1)，中间插入慢 |
| 频繁头尾插入 | ArrayDeque / LinkedList | 优先 Deque |
| 去重 | HashSet / LinkedHashSet | 需要顺序用 LinkedHashSet |
| 键值对 | HashMap | 默认 O(1) |
| 需要线程安全 | ConcurrentHashMap | 见下文 |

## HashMap 要点

1. 初始容量与负载因子：默认 16 / 0.75
2. JDK 8+：链表长度 ≥ 8 且桶数组 ≥ 64 时树化
3. 扩容：容量翻倍，重新分布

\`\`\`java
Map<String, Integer> counts = new HashMap<>();
counts.merge("java", 1, Integer::sum);
\`\`\`

## 常见坑

- 只重写 \`equals\` 不重写 \`hashCode\` → 查不到
- 遍历时 \`remove\` 要用 \`Iterator.remove\`
- \`Collections.unmodifiableList\` 只是只读视图，不是线程安全

## 复习清单

- [ ] 何时选 \`LinkedHashMap\` 做 LRU
- [ ] \`TreeMap\` 的 \`Comparator\` 与自然序
- [ ] \`ConcurrentHashMap\` 的 size 为何是弱一致
`,
  },
  {
    slug: "spring-boot-request-flow",
    title: "Spring Boot 请求处理链路笔记",
    summary: "从 DispatcherServlet 到 Controller 的关键节点速记。",
    group: "后端框架",
    tags: ["Spring Boot", "后端框架"],
    date: "2026-09-15",
    readTime: "5 分钟",
    relatedPostSlugs: [],
    content: `# Spring Boot 请求链路

面试与排障时按这条链路定位问题。

## 主链路

1. \`DispatcherServlet\` 接收请求
2. \`HandlerMapping\` 找到 Handler
3. \`HandlerAdapter\` 调用方法
4. 参数解析（\`@RequestBody\` / \`@PathVariable\`）
5. 返回值处理（\`@ResponseBody\` / 视图）
6. 异常 → \`HandlerExceptionResolver\`

## 分层约定

\`\`\`text
Controller  → 参数校验、DTO
Service     → 业务规则、事务
Repository  → SQL / ORM
\`\`\`

> 原则：事务边界放 Service；Controller 不写业务 if-else。

## 自动配置

- \`@EnableAutoConfiguration\` 按 classpath 加载 \`spring.factories\` / \`AutoConfiguration.imports\`
- 用 \`@ConditionalOnProperty\` 开关功能

## 排障清单

- 404：Mapping 路径 / context-path
- 400：JSON 字段类型、\`@Valid\`
- 500：看 \`HandlerExceptionResolver\` 是否被自定义吞掉
`,
  },
  {
    slug: "mysql-index-explain",
    title: "MySQL 索引与 EXPLAIN 速记",
    summary: "最左前缀、覆盖索引、回表与 EXPLAIN 关键列。",
    group: "数据库与数据访问",
    tags: ["MySQL", "数据库", "索引"],
    date: "2026-09-18",
    readTime: "5 分钟",
    relatedPostSlugs: [],
    content: `# MySQL 索引与 EXPLAIN

## 索引原则

- 联合索引遵循最左前缀
- 高频过滤列放前面
- 区分度低的列单独索引意义不大

## EXPLAIN 看什么

| 列 | 关注点 |
|----|--------|
| type | \`ref\`/\`range\` 可接受；\`ALL\` 全表扫描 |
| key | 实际用到的索引 |
| rows | 估算扫描行数 |
| Extra | \`Using index\` 覆盖；\`Using filesort\` 需优化 |

## 回表 vs 覆盖

\`\`\`sql
-- 覆盖：只查联合索引里的列，避免回表
SELECT id, name FROM users WHERE name = 'lin';
\`\`\`

## 事务隔离速记

- RR（可重复读）：InnoDB 默认
- 解幻读靠间隙锁 / MVCC

## 练习

- [ ] 为 \`orders(user_id, created_at)\` 写一条最左前缀查询
- [ ] 解释为什么 \`WHERE created_at = ?\` 用不上该索引
`,
  },
  {
    slug: "redis-cache-patterns",
    title: "Redis 缓存三件套：旁路 / 穿透 / 雪崩",
    summary: "Cache-Aside、空值缓存与过期打散的落地笔记。",
    group: "缓存与消息队列",
    tags: ["Redis", "架构设计", "缓存"],
    date: "2026-09-20",
    readTime: "4 分钟",
    relatedPostSlugs: [],
    content: `# Redis 缓存模式

## Cache-Aside（旁路缓存）

1. 读：先查缓存 → miss 则查库 → 回写缓存
2. 写：先更新 DB → 再删除缓存（不是更新缓存）

## 穿透（查不存在的 key）

- 空值也缓存，TTL 短一点（如 60s）
- 布隆过滤器做前置拦截

## 雪崩（大量 key 同时过期）

- 过期时间加随机抖动
- 多级缓存 / 限流兜底

## 与消息队列

- 削峰：写流量进 MQ 慢慢消费
- 最终一致：DB 变更 → binlog → 删缓存

\`\`\`text
写 DB → binlog → MQ → 消费者删 Redis
\`\`\`

## 自测

- 为什么写库后删缓存而不是更新缓存？
- 空值 TTL 为什么不宜过长？
`,
  },
];

export function getNoteBySlug(slug: string) {
  return notes.find((n) => n.slug === slug);
}

export function searchNotes(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return notes;
  return notes.filter((n) =>
    `${n.title} ${n.summary} ${n.group} ${n.tags.join(" ")} ${n.content}`
      .toLowerCase()
      .includes(q),
  );
}
