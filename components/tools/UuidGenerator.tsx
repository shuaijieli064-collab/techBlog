"use client";

import { useState } from "react";

import CopyButton from "./CopyButton";

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = () => {
    const uuid = crypto.randomUUID();
    setUuids((prev) => [uuid, ...prev].slice(0, 5));
  };

  return (
    <div className="space-y-4">
      <button onClick={generate} className="btn-primary px-4 py-2">
        生成 UUID
      </button>
      <div className="space-y-2">
        {uuids.map((uuid, i) => (
          <div key={i} className="relative">
            <code className="block w-full code-panel">
              {uuid}
            </code>
            <CopyButton text={uuid} />
          </div>
        ))}
      </div>
    </div>
  );
}
