"use client";

import { useState } from "react";

import CopyButton from "./CopyButton";

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = () => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }
    try {
      const keywords = [
        "SELECT",
        "FROM",
        "WHERE",
        "LEFT JOIN",
        "RIGHT JOIN",
        "INNER JOIN",
        "JOIN",
        "GROUP BY",
        "ORDER BY",
        "HAVING",
        "LIMIT",
        "OFFSET",
        "INSERT INTO",
        "VALUES",
        "UPDATE",
        "SET",
        "DELETE",
        "UNION ALL",
        "UNION",
        "ON",
        "AND",
        "OR",
        "AS",
        "DISTINCT",
      ];
      let sql = input.replace(/\s+/g, " ").trim();
      keywords.forEach((k) => {
        sql = sql.replace(new RegExp(`\\s+${k}\\s+`, "gi"), `\n${k} `);
        sql = sql.replace(new RegExp(`^${k}\\s+`, "i"), `${k} `);
      });
      sql = sql
        .replace(/\bSELECT\b/gi, "SELECT")
        .replace(/,\s*/g, ",\n  ")
        .replace(
          /\n(SELECT|FROM|WHERE|LEFT JOIN|RIGHT JOIN|INNER JOIN|JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|INSERT INTO|VALUES|UPDATE|SET|DELETE|UNION)/g,
          "\n$1",
        )
        .trim();
      setOutput(sql);
      setError("");
    } catch {
      setError("格式化失败");
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="select id,name from users where age>18 order by name"
        className="input-base h-36 font-mono"
      />
      <button onClick={format} className="btn-primary">
        格式化
      </button>
      {error && <p className="text-sm text-alert">{error}</p>}
      {output && (
        <div className="relative">
          <pre className="w-full overflow-auto whitespace-pre-wrap code-panel">
            {output}
          </pre>
          <CopyButton text={output} />
        </div>
      )}
    </div>
  );
}
