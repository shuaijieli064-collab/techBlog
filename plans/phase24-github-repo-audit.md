# GitHub 账号仓库审计与工作台完善计划

> 审计对象：<https://github.com/shuaijieli064-collab>（Shuaijie Li · 郑州轻工业大学 软件工程）
> 审计时间：2026-10-16 · 审计方式：GitHub REST API（仓库元数据 / 文件树 / 提交历史 / Actions）+ 本地 `D:/A_Items/Nexus` git 状态比对
> 本文档只做审计与规划，**未对任何仓库执行改动**；执行需单独确认。

---

## 一、账号仓库全景

账号共 **10 个公开仓库**、0 星、0 fork、1 关注者。与「程序员个人工作台（Nexus）」生态的相关性分级：

| 仓库 | 语言 | 体积 | 最近推送 | 与工作台的关系 |
| --- | --- | --- | --- | --- |
| **techBlog** | TypeScript | 102 KB | 2026-08-13 | ★★★ **工作台的远程 origin**。远程内容是"纯博客"远古版（52 个文件），工作台 8 大模块完全缺失 |
| **portfolio** | TypeScript | 59.7 MB | 2026-10-15 | ★★☆ 姊妹项目：Vite+React 个人作品集网站（工作台是其中"作品"卡片展示的项目之一），共用同一套设计审美 |
| Intelligent-Growth-Platform-for-College-Students | Python | 903 KB | 2026-10-12 | ★☆☆ 大创项目（成长平台），与工作台"学习/成长"域主题相关，技术栈独立 |
| Personal_Information_OS | Java | 110 KB | 2026-10-04 | ★☆☆ 个人信息管理系统（Java 版），与工作台定位重叠的不同技术栈实现 |
| couple-web | TypeScript | 483 KB | 2026-09-22 | ☆☆☆ 情侣记录 Web 应用（Supabase），portfolio 作品集展示项目之一 |
| techBlog 之外其余 5 个（desktopPet / git_study / DaChuangProject / study / group-order-app） | — | — | — | ☆☆☆ 学习/练手项目，与工作台无直接关系 |

---

## 二、重点仓库现状详析

### 2.1 techBlog —— 工作台的远程家园，但内容停留在"前工作台时代"

**远程实际内容**（`main` 分支，52 个文件）：

```
app/  about archive feed.xml notes posts/ tags/ + favicon/layout/globals
components/  PostCard PostsExplorer ReadingProgress ShareActions SiteHeader ThemeToggle
lib/  posts site utils
```

即：**只有博客阅读功能**。工作台的核心模块——`dashboard`（工作台）、`knowledge`（知识库）、`projects`、`learning`、`growth`、`tools`（函数库）、`ai/*`（AI 中心）、`search`、`settings`、`api/workspace`（本地 SQLite 后端）——**全部不在远程**。

**本地 vs 远程差距**：

| 维度 | 远程 techBlog | 本地 Nexus |
| --- | --- | --- |
| 已提交未推送 | — | **领先 origin 8 个提交**（Phase 12–21 工作） |
| 工作区未提交 | — | **83 个修改 + 2 个删除 + 46 个未跟踪**（Phase 22–23 全部改动、新组件、测试、计划文档） |
| 数据后端 | 无 | node:sqlite + `/api/workspace`（8 个数据域） |
| AI 能力 | 无 | `/api/ai/chat`（ModelScope）、GitHub 动态、AI  Agents/提示词库 |
| 测试 | 无 | Playwright 34 项冒烟（本地全绿） |
| CI | 仅 1 个 Copilot cloud agent 动态工作流，**无 typecheck/lint/build/test 门禁** | — |

**结论：工作台约 2/3 的功能（两个 UI 重设计阶段 + 本地后端 + 测试体系）只存在于本地磁盘，任何本地故障都会造成不可恢复损失。**

### 2.2 portfolio —— 作品集本身质量不错，但仓库卫生很差

**优点**（值得保留）：README 3783 字节、结构完整（技术栈/区块/组件表/动效说明）；React 19 + Vite 8 + Tailwind v4 + Motion；PWA、i18n、离线页、resume.pdf 齐全；`GitHubActivity` 组件运行时拉取本账号公开仓库——与工作台生态天然联动。

**问题**：

1. **提交信息为 `1`**——整个 59.7 MB 项目一个提交、消息无任何信息量，历史完全不可读；
2. **内部过程资产被公开**：`.workbuddy/memory/`（5 篇内部工作日志，含大量调试细节）、`.workbuddy/screenshots/`（约 100 张开发过程截图，约 25 MB+）、`.trae/documents/高级动效与字体升级计划.md`、`generated-images/`（1.5 MB AI 出图 + 记录页）。这些属于工作过程副产品，不应出现在公开仓库；
3. **仓库元数据全空**：无 description、无 topics、无 LICENSE、未启用 GitHub Pages、无 homepage；
4. 单 commit 59 MB，clone 成本高。

### 2.3 本地仓库卫生状况（推送前必须处理）

- `.gitignore` **未忽略 `.workbuddy/`**（46 个未跟踪项的第一个就是它）——若执行 `git add -A` 推送，内部 memory/截图会原样进入公开的 techBlog 仓库，**重演 portfolio 已经发生的问题**；
- ✅ 安全面良好：`.env.local`（含真实 `MODELSCOPE_API_KEY`）与 `data/`（SQLite 数据库）均已被 gitignore 且**从未进入任何提交历史**（已核验 `git log --all -- .env.local data/` 为空）；
- 已删除的死代码 `components/AiBlogDraft.tsx`、`components/RadarSweep.tsx` 的删除操作也未提交。

---

## 三、问题清单（按严重度）

| # | 严重度 | 问题 | 影响 |
| --- | --- | --- | --- |
| 1 | 🔴 P0 | 工作台主体代码（8 commits + 131 处改动）只在本地 | 磁盘故障 = 数月工作丢失；无法协作/Review |
| 2 | 🔴 P0 | `.gitignore` 缺 `.workbuddy/`、`.trae/`、`generated-images/` | 下次推送即公开内部工作日志与截图 |
| 3 | 🔴 P0 | portfolio 已公开内部 memory/截图/计划文档，提交信息 "1" | 过程资产泄露 + 仓库 59 MB 不可读历史 |
| 4 | 🟡 P1 | 无 CI 质量门禁 | 每次改动靠人工跑 typecheck/lint/build/Playwright，回归风险高 |
| 5 | 🟡 P1 | techBlog 远程 README/元数据陈旧（远程 README 为博客时代版本） | 访客/招聘方看到的是半年前的项目 |
| 6 | 🟡 P1 | 无部署管线，工作台无法上线访问 | 项目停留在 localhost，作品集里只能放截图 |
| 7 | 🟢 P2 | 无 LICENSE、无 commit 规范校验、无 issue/PR 模板 | 开源规范性不足 |
| 8 | 🟢 P2 | 生态割裂：作品集 ↔ 工作台未互相深度引用；账号无 profile README | 两个拳头产品各自为战 |

---

## 四、完善计划

### 阶段一：仓库安全与代码落库（P0 · 预计 1 小时 · 立即执行）

**优化目标**：消除数据丢失与信息泄露风险，让远程代码反映真实进度。

**实施步骤**：

1. **加固 `.gitignore`**（本地 Nexus）：追加 `.workbuddy/`、`.trae/`、`generated-images/`、`dev-server*.log`（已有部分）、确认 `data/`、`.env*` 已忽略；
2. **分逻辑提交本地工作区**（建议按 Phase 分批，保持现有优质提交风格）：
   - `feat(phase21)`: 生产级完善 15 项缺陷修复 + 搜索/设置中心 + 质量全绿
   - `feat(phase22)`: UI 系统性重设计（设计令牌重建 + 108 处圆角规整）
   - `feat(phase23)`: Toast 反馈系统 + 命令面板 fuzzy + 搜索键盘流 + 骨架屏
   - `chore`: 删除 2 个死代码文件、`.gitignore` 加固、`plans/` 8 篇阶段文档、`tests/` 用例扩充
3. **推送 techBlog**：`git push origin main`，使远程与本地对齐（工作台全量功能上线远程）；
4. **清洗 portfolio 公开仓库**（单 commit 场景，成本最低）：
   - 方案 A（推荐）：本地删除 `.workbuddy/`、`.trae/`、`generated-images/`、`screenshots/` 后重新 init 历史并 force push（仓库 0 star/0 fork/0 协作者，历史重写零代价）；
   - 方案 B：`git filter-repo` 剥离子目录；
   - 重推时用规范化提交信息（`feat: initial release — personal portfolio (Vite + React 19 + Tailwind v4)`），并精选 3–5 张成品截图放入 `docs/`（如需）；
5. **复核**：推送后逐一访问远程页面，确认无 `.workbuddy`、无 `.env`、无 `data/`。

**风险与对策**：
- force push 改变 commit SHA → 外部旧链接失效；本仓库无外部依赖，风险≈0；
- 大批量提交可能误带敏感文件 → 推送前用 `git log --all -- .env.local data/ .workbuddy` 复核 + `git status` 逐一确认；
- `.env.local` 含真实 API Key → 全程保持 ignore 状态；建议顺手在 ModelScope 侧重置一次 key（once-in-a-lifetime 保险）。

**验收标准**：远程 techBlog 包含 dashboard/ai/api 等全部模块；两个公开仓库均无内部过程资产；本地 `git status` clean。

---

### 阶段二：工程化与门禁（P1 · 预计 1–2 天）

**优化目标**：远程每次推送自动验证质量，仓库元数据达到"招聘官友好"标准。

**实施步骤**：

1. **GitHub Actions CI**（`.github/workflows/ci.yml`）：push/PR 触发 `typecheck → lint → build → Playwright`；测试库用 virgin `data/test.db`（既有已验证方案，避免二次运行污染）；
2. **仓库元数据补齐**（techBlog + portfolio）：
   - description：「Next.js 16 程序员个人工作台：博客 / 知识库 / 项目 / 学习 / AI 中心 + 本地 SQLite 数据后端」
   - topics：`nextjs` `typescript` `personal-workbench` `sqlite` `tailwindcss` `react19`
   - LICENSE：MIT；
3. **README 升级**（techBlog）：以本地新版 README 为基线，补充架构图（App Router 路由表 + node:sqlite 数据层 + API 清单）、本地开发/测试/构建命令、34 项测试说明、CI 徽章；
4. **规范文件**：`commitlint` + conventional commits（husky 本地钩子）、issue 模板（bug/feature）、PR 模板；
5. **分支保护**：main 开启「PR 必须通过 CI 才可合并」（个人仓库可自愿执行，防手滑直接 push 破坏性改动）。

**风险与对策**：
- Playwright 在 GitHub runner 上装浏览器较慢 → 用 `playwright[chromium]` 缓存或 `npx playwright install --with-deps chromium`，超时设 10 分钟；
- CI 暴露测试细节 → 测试库与真实 `data/` 严格隔离（已通过 `WORKSPACE_DB_PATH` 实现）；
- node:sqlite 需要 Node ≥ 22 → CI 指定 `node-version: 24`（与本地一致）。

**验收标准**：每次 push 远程可见绿色 CI；README 含徽章与架构说明；两仓库元数据完整。

---

### 阶段三：上线与生态整合（P2 · 预计 3–7 天）

**优化目标**：工作台从 localhost 变成可分享的在线产品，两个拳头项目互相导流。

**实施步骤**：

1. **部署方案选型**（工作台含 node:sqlite 本地后端，是关键约束）：
   - 方案 A：**Vercel + Turso**（libsql 云端）——serverless 友好，需把 `lib/server/db.ts` 的 node:sqlite 适配为 `@libsql/client`（接口高度相似，适配层约 100 行）；
   - 方案 B：**Cloudflare Workers + D1**（`wrangler.toml` 已存在，说明有过意图）——免费额度大，但 Next.js on Workers 需 OpenNext，改造量中等；
   - 方案 C：**VPS（Docker + node:sqlite 原样）**——零代码改造，持久卷存 SQLite，适合数据私有场景；
   - 建议先 C（当天可上线）后 A（长期 serverless 化）；
2. **作品集联动**：portfolio 的 `Work` 卡片中"dev-workspace"项目补上在线链接与远程仓库链接；工作台 footer/关于页补作品集入口；
3. **账号 profile README**：新建 `shuaijieli064-collab/shuaijieli064-collab` 仓库，写个人简介 + 双项目导航 + 技术栈；
4. **AI 能力配置说明**：README 增加 ModelScope Key 配置指引（`.env.example` 已有，补截图级教程）；
5. **可选**：把 `Intelligent-Growth-Platform`（Python）与工作台"学习/成长"域做数据互通设计文档（远期）。

**风险与对策**：
- SQLite 上云的写并发限制 → 单人使用场景无碍；如需多人需迁移 Postgres（cloud-service skill 可评估）；
- 部署后真实数据暴露 → 上线用**演示数据库**（脱敏文章），`data/` 永不入库的规则延续到云端；
- Vercel 国内访问不稳定 → 备选 Netlify/自建 VPS，或作品集已用的方案保持一致。

**验收标准**：工作台有可分享的在线 URL（演示数据）；作品集与工作台双向链接；profile README 上线。

---

## 五、总体预期效果

| 指标 | 当前 | 阶段一后 | 阶段二后 | 阶段三后 |
| --- | --- | --- | --- | --- |
| 工作台代码丢失风险 | 高（仅本地） | **消除** | 消除 | 消除 |
| 公开仓库内部资产泄露 | portfolio 已泄露 | **消除** | 消除 | 消除 |
| 远程代码反映的真实进度 | ~1/3（博客时代） | **100%** | 100% | 100% |
| 质量验证方式 | 人工本地跑 | 人工 | **CI 自动门禁** | CI + 部署前检查 |
| 项目可达性 | localhost | 远程仓库可 clone | 同左 | **在线 URL 可分享** |
| 招聘/访客第一印象 | 半年前旧版 + 空元数据 | 干净的完整代码 | README + 徽章 + LICENSE | 作品集 ↔ 工作台闭环 |

**附带收益**：规范的提交历史与 CI 绿徽章本身就是软件工程能力的证明（对软件工程专业学生的求职/保研面试是直接加分项）；portfolio 的 `GitHubActivity` 组件会自动展示更新后的仓库动态，形成"提交即宣传"的正循环。

---

## 六、附录：关键数据快照（2026-10-16）

- 本地未提交：83 modified / 2 deleted / 46 untracked；领先 origin 8 commits
- 本地测试：Playwright 34/34 通过；typecheck / lint / build 全绿
- 安全核验：`.env.local`、`data/` 从未进入 git 历史；远程两仓库无 `.env`/`.db`/`.next`
- portfolio 体积构成：截图 ~25 MB + generated-images ~1.5 MB + 源码/依赖锁 ~5 MB + 其余资源
