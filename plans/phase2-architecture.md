# Phase 2 · 信息架构与系统设计

## 1. 信息架构（目标导航）

```
Dashboard (/dashboard)
├── Overview（默认工作台）
├── Projects (/projects)
├── Learning (/learning)
│   ├── Roadmap（路线图）
│   ├── Algorithms（算法）
│   └── Notes → /notes
├── Knowledge (/knowledge)
│   └── Notes (/notes)
├── Blog (/posts)
│   ├── Posts
│   ├── Archive (/archive)
│   ├── Categories → /posts?category=
│   └── Tags (/tags/[tag])
├── AI Center
│   ├── Models (/ai/models)
│   ├── Agents (/ai/agents)          [新增]
│   └── Prompts (/ai/prompts)
├── Tools (/tools) + Functions (/functions)
└── Growth (/growth)
    ├── Skills
    └── Timeline

公开页：/ /profile /about /posts/[slug] /projects /rss.xml
```

导航实现：SiteHeader 分组 + 移动端折叠；桌面端一级 8 项，子项进页面内 Tab。

## 2. 路由规划

| 路由 | 状态 | 说明 |
|------|------|------|
| 现有 17 个路由 | ✅ | 全部保留 |
| /ai/agents | 🆕 | AI Agent 登记 |
| /posts/drafts | 🆕 | 草稿列表（本地） |
| /knowledge/[id] | 🆕 后续 | 笔记详情 |
| /projects/[id] | 🆕 后续 | 项目详情 |
| /login | 🆕 后续 | Supabase Auth |

## 3. 数据库 Schema（Supabase PostgreSQL）

```sql
-- profiles (1:1 auth.users)
id uuid PK, username text, full_name text, avatar_url text,
bio text, role text check (role in ('guest','user','admin')) default 'user',
website text, github text, created_at timestamptz

-- projects
id uuid PK, owner_id uuid FK profiles, name text, description text,
cover_url text, tech text[], github_url text, live_url text,
status text check (status in ('planning','developing','testing','completed','archived')),
progress int default 0, start_date date, updated_at timestamptz

-- project_tasks
id uuid PK, project_id uuid FK, title text, done bool default false, position int

-- blog_posts
id uuid PK, author_id uuid FK, slug text unique, title text,
excerpt text, content_md text, cover_url text, category text,
status text check (status in ('draft','published')) default 'draft',
featured bool default false, pinned bool default false,
view_count int default 0, like_count int default 0,
read_time text, published_at timestamptz, created_at timestamptz

-- blog_tags / blog_post_tags
tags: id, name unique
post_tags: post_id, tag_id PK(pair)

-- knowledge_notes
id uuid PK, owner_id uuid, title text, content_md text,
category text, tags text[], favorite bool default false,
source_post_id uuid null, created_at, updated_at

-- learning_paths / learning_items
paths: id, owner_id, name, icon, color
items: id, path_id, name, mastered bool, position

-- algorithm_problems
id uuid PK, owner_id, name, category, total int, mastered int,
note text, wrong_count int default 0, review_count int default 0

-- study_records
id, owner_id, date, title, minutes int, tags text[]

-- prompts
id uuid PK, owner_id, title, content text, category text,
tags text[], favorite bool default false, use_count int default 0

-- ai_models
id uuid PK, owner_id, name, provider, api_encrypted text, -- 仅服务端
monthly_limit int, current_usage int, monthly_cost numeric,
status text, notes text

-- ai_agents
id uuid PK, owner_id, name, vendor, use_case text,
prompt text, config jsonb, project text, notes text

-- skills
id uuid PK, owner_id, name, level int, category text, color text

-- timeline_events
id uuid PK, owner_id, date date, type text, title text,
description text, tags text[]

-- developer_tools (可选自定义工具元数据)
id, owner_id, name, slug, description, config jsonb
```

### RLS 策略（原则）
- 公开读：`blog_posts where status='published'`、`projects`（可加 is_public）
- 全部写操作：`owner_id = auth.uid()`
- `ai_models.api_encrypted`：仅通过 Edge Function 读写，前端永不可见
- role='admin' 可跨用户读（管理端）

## 4. API 设计（MVP 阶段）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/posts | 列表（status/filter/q） |
| GET | /api/posts/[slug] | 详情 + view_count++ |
| POST | /api/posts | 创建（auth） |
| GET/POST/PUT/DELETE | /api/prompts | Prompt CRUD |
| GET | /api/github/user | GitHub Profile 代理 |
| POST | /ai/edge/... | Supabase Edge：AI 整理/生成博客 |

MVP 无后端时：上述先用 **本地 localStorage adapter** 模拟同接口。

## 5. 权限模型

| 能力 | Guest | User | Admin |
|------|-------|------|-------|
| 公开主页/已发布博客/项目 | ✓ | ✓ | ✓ |
| 草稿、笔记、学习、Prompt、技能 | ✗ | ✓ | ✓ |
| 系统配置、全量数据 | ✗ | ✗ | ✓ |

前端：路由级提示 + 后端 RLS 双保险。未登录访问私有页 → /login。

## 6. 关键交互闭环

```
学习笔记 → [AI 整理] → 知识库结构化笔记
        → [生成博客] → 草稿 → 审核发布
        → [生成复习题/计划] → 学习任务 + 算法复习
        → 成长时间线自动/手动追加事件
```

## 7. UI 体系

- 深色优先可切换（已有）；卡片圆角 2xl/3xl、1px 边框、弱阴影
- 主色 sky-600，语义色按域固定（学习 orange、项目 purple、AI emerald…）
- 禁止大面积渐变堆砌；微交互仅 hover/transition 150-300ms
- 每页统一：Eyebrow → H1 → 描述 → 内容区
- 状态：Loading（已有）/ Empty / Error 三态组件化
