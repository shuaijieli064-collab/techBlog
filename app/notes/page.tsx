import Link from "next/link";

import { posts } from "@/lib/posts";

const noteGroups = [
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

export default function NotesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
          学习笔记
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Java 与后端技术栈知识地图
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          这里的内容按技术栈整理，让我可以按主题快速回顾：Java 基础、框架、数据库、缓存与消息队列的学习脉络会更加清晰。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {noteGroups.map((group) => {
          const relevantPosts = posts.filter((post) =>
            group.tags.some((tag) => post.tags.includes(tag))
          );

          return (
            <section
              key={group.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
                {group.title}
              </div>
              <p className="text-base leading-7 text-slate-600 dark:text-slate-300">{group.summary}</p>

              <div className="mt-5 space-y-3">
                {relevantPosts.length > 0 ? (
                  relevantPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-sky-400"
                    >
                      {post.title}
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    该模块还在持续补充中
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
