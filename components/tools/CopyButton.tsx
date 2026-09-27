"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="absolute right-2 top-2 border border-hair bg-panel p-1.5 text-muted transition-colors hover:border-wire hover:text-wire"
    >
      {copied ? <Check size={14} className="text-wire" /> : <Copy size={14} />}
    </button>
  );
}
