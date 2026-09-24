"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function FunctionSearchInput() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="搜索函数或标签..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 pl-10 py-3 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500"
        />
      </div>
    </div>
  );
}
