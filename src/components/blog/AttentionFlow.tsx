"use client";

import React from "react";

export default function AttentionFlow() {
  const tokens = Array.from({ length: 8 });

  return (
    <div className="p-6 bg-[var(--color-surface-container-low)] rounded-2xl not-prose">
      <h3 className="text-xl font-semibold mb-4 text-[var(--color-on-surface)]">Attention Flow</h3>
      <div className="grid grid-cols-8 gap-2">
        {tokens.map((_, i) => (
          <div
            key={i}
            className="h-10 bg-[var(--color-surface)] rounded flex items-center justify-center text-sm font-mono text-[var(--color-on-surface)]"
          >
            t{i}
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-[var(--color-on-surface-variant)]">
        Each token attends to previous tokens dynamically.
      </div>
    </div>
  );
}
