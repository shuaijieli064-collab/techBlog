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
          className="w-full input-base pl-10!"
        />
      </div>
    </div>
  );
}
