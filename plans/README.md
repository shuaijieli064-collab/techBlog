# Developer OS 计划目录

| 文件 | 内容 |
|------|------|
| [phase1-analysis.md](./phase1-analysis.md) | Phase 1 现有项目分析（技术栈/结构/问题/复用点） |
| [phase2-architecture.md](./phase2-architecture.md) | Phase 2 信息架构、路由、DB Schema、API、权限、UI |
| [roadmap.md](./roadmap.md) | Phase 3-14 总路线图与执行优先级 |

## 使用方式

1. 实施前先读 `roadmap.md` 当前 P0/P1
2. 改架构前对照 `phase2-architecture.md`
3. 每完成一阶段：更新 roadmap 状态 → 同步本 README

## 开发红线

- 不推倒重写；保留现有路由与数据模块
- 敏感信息只进环境变量；API Key 永不进前端
- 合理默认直接做，仅架构级分歧才询问
