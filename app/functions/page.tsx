import Link from "next/link";
import SearchInput from "@/components/FunctionSearchInput";
import FunctionGrid from "@/components/FunctionGrid";
import { getFunctionsByCategory } from "@/lib/functions";

export const metadata = {
  title: "函数速查 | 林晨的博客",
  description: "Java、Python 等编程语言的常用函数速查表",
};

export default function FunctionsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 text-center">
          <h1 
            className="mx-auto mb-4 max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50"
          >
            函数速查
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            记住那些常用但不常想起的工具函数
          </p>
        </header>

        <div className="mb-10">
          <SearchInput />
        </div>

        <FunctionCategories />
      </div>
    </main>
  );
}

function FunctionCategories() {
  const categories = ["集合", "字符串", "数组", "时间", "数学", "排序", "查找", "异常", "多线程"].filter(
    (category) => getFunctionsByCategory(category).length > 0,
  );

  return (
    <div className="space-y-16">
      {categories.map((category) => (
        <section key={category}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {category}
            </h2>
            <Link
              href={`/functions?category=${category}`}
              className="text-sm font-medium text-wire hover:opacity-80"
            >
              查看全部 →
            </Link>
          </div>
          <FunctionGrid category={category} />
        </section>
      ))}
    </div>
  );
}
