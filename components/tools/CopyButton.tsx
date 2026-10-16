"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="absolute right-2 top-2 rounded-md border border-hair bg-panel p-1.5 text-muted transition-colors hover:border-wire hover:text-wire"
      aria-label="复制"
    >
      {copied ? <Check size={14} className="pop text-wire" /> : <Copy size={14} />}
    </button>
  );
}
