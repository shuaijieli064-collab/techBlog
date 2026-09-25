"use client";

import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";

type TokenType = "plain" | "keyword" | "string" | "comment" | "number";

type Token = { type: TokenType; text: string };

const KEYWORDS: Record<string, string[]> = {
  tsx: [
    "import", "from", "export", "default", "function", "return", "const", "let", "var",
    "if", "else", "for", "while", "new", "class", "extends", "async", "await", "try",
    "catch", "finally", "throw", "type", "interface", "as", "in", "of", "typeof", "void",
    "null", "undefined", "true", "false",
  ],
  typescript: [
    "import", "from", "export", "default", "function", "return", "const", "let", "var",
    "if", "else", "for", "while", "new", "class", "extends", "async", "await", "try",
    "catch", "finally", "throw", "type", "interface", "as", "in", "of", "typeof", "void",
    "null", "undefined", "true", "false",
  ],
  javascript: [
    "import", "from", "export", "default", "function", "return", "const", "let", "var",
    "if", "else", "for", "while", "new", "class", "extends", "async", "await", "try",
    "catch", "finally", "throw", "typeof", "in", "of", "null", "undefined", "true", "false",
  ],
  java: [
    "public", "private", "protected", "class", "interface", "extends", "implements",
    "static", "final", "void", "return", "new", "if", "else", "for", "while", "try",
    "catch", "finally", "throw", "throws", "import", "package", "int", "long", "double",
    "boolean", "char", "String", "null", "true", "false",
  ],
  sql: [
    "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE",
    "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON", "GROUP", "BY", "ORDER", "LIMIT",
    "AND", "OR", "NOT", "NULL", "AS", "CREATE", "TABLE", "INDEX", "PRIMARY", "KEY",
    "FOREIGN", "REFERENCES", "DISTINCT", "HAVING", "COUNT", "SUM", "AVG",
  ],
};

function keywordsFor(language: string): string[] {
  const lang = language.toLowerCase();
  return KEYWORDS[lang] ?? KEYWORDS[lang.split(/[^a-z]/)[0] ?? ""] ?? [];
}

function tokenizeLine(line: string, language: string): Token[] {
  const keywords = keywordsFor(language);
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    const rest = line.slice(i);

    if (rest.startsWith("//") || rest.startsWith("--")) {
      tokens.push({ type: "comment", text: rest });
      break;
    }

    if (rest[0] === '"' || rest[0] === "'" || rest[0] === "`") {
      const quote = rest[0];
      let j = 1;
      while (j < rest.length) {
        if (rest[j] === "\\") {
          j += 2;
          continue;
        }
        if (rest[j] === quote) {
          j += 1;
          break;
        }
        j += 1;
      }
      tokens.push({ type: "string", text: rest.slice(0, j) });
      i += j;
      continue;
    }

    const numberMatch = rest.match(/^\d+(\.\d+)?/);
    if (numberMatch) {
      tokens.push({ type: "number", text: numberMatch[0] });
      i += numberMatch[0].length;
      continue;
    }

    const wordMatch = rest.match(/^[A-Za-z_$][\w$]*/);
    if (wordMatch) {
      const word = wordMatch[0];
      const exact = keywords.includes(word);
      const upperKeyword = keywords.some(
        (k) => k === k.toUpperCase() && /[A-Z]/.test(k) && k.toLowerCase() === word.toLowerCase(),
      );
      tokens.push({ type: exact || upperKeyword ? "keyword" : "plain", text: word });
      i += word.length;
      continue;
    }

    tokens.push({ type: "plain", text: rest[0] });
    i += 1;
  }

  return tokens;
}

const tokenClass: Record<TokenType, string> = {
  plain: "text-slate-300",
  keyword: "text-sky-400",
  string: "text-emerald-400",
  comment: "text-slate-500 italic",
  number: "text-amber-400",
};

export default function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-[4px] border border-hair bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-700 bg-slate-800 px-4 py-2">
        <span className="flex h-2 w-2 rounded-full bg-wire/80" />
        <span className="flex h-2 w-2 rounded-full bg-amber-500/80" />
        <span className="flex h-2 w-2 rounded-full bg-emerald-500/80" />
        <span className="ml-2 text-xs font-medium text-slate-300">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="ml-auto flex h-7 w-7 items-center justify-center rounded transition-colors hover:bg-slate-700"
          aria-label="复制代码"
        >
          {copied ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <Copy size={14} className="text-slate-300" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 sm:text-sm">
        <code>
          {lines.map((line, lineIdx) => (
            <div key={`${lineIdx}-${line.slice(0, 8)}`} className="flex">
              <span className="mr-4 w-6 shrink-0 select-none text-right text-slate-600">
                {lineIdx + 1}
              </span>
              <span className="whitespace-pre">
                {tokenizeLine(line, language).map((token, tokenIdx) => (
                  <span key={tokenIdx} className={tokenClass[token.type]}>
                    {token.text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
