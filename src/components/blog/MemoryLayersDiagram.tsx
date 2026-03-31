"use client";

import React from "react";

export default function MemoryLayersDiagram() {
  return (
    <div className="p-6 bg-[var(--color-surface-container-low)] rounded-2xl space-y-4 not-prose">
      <h3 className="text-xl font-semibold text-[var(--color-on-surface)]">Memory Layers</h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[var(--color-surface)]">
          <h4 className="font-semibold text-[var(--color-on-surface)]">Weights</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)]">Long-term knowledge</p>
        </div>

        <div className="p-4 rounded-xl bg-[var(--color-surface)]">
          <h4 className="font-semibold text-[var(--color-on-surface)]">Activations</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)]">Temporary compute</p>
        </div>

        <div className="p-4 rounded-xl bg-[var(--color-surface)]">
          <h4 className="font-semibold text-[var(--color-on-surface)]">Context</h4>
          <p className="text-sm text-[var(--color-on-surface-variant)]">External memory</p>
        </div>
      </div>
    </div>
  );
}
