"use client";

/**
 * BokehVisualization — embeds interactive Bokeh plots safely
 * Bokeh HTML files are served from public/bokeh/ directory
 */

import { useEffect, useRef, useState } from "react";

interface BokehVisualizationProps {
  title: string;
  src: string;
  height?: number;
}

export default function BokehVisualization({
  title,
  src,
  height = 500,
}: BokehVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadBokeh = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch the Bokeh HTML file
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Failed to load Bokeh plot: ${response.status}`);
        }

        const html = await response.text();

        if (containerRef.current) {
          // Create an iframe to safely embed the Bokeh HTML
          // This prevents script injection and isolates the plot
          const blob = new Blob([html], { type: "text/html" });
          const url = URL.createObjectURL(blob);

          const iframe = document.createElement("iframe");
          iframe.src = url;
          iframe.style.width = "100%";
          iframe.style.height = `${height}px`;
          iframe.style.border = "none";
          iframe.style.borderRadius = "0.25rem";

          // Clear previous content
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(iframe);
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    };

    loadBokeh();
  }, [src, height]);

  return (
    <div className="not-prose my-8 bg-[var(--color-surface-container-lowest)] rounded-[0.25rem] border border-[var(--color-outline-variant)]/20 p-6">
      <div className="mb-4">
        <h3 className="font-headline text-lg font-semibold text-[var(--color-on-surface)]">
          {title}
        </h3>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <p className="text-[var(--color-on-surface-variant)]">Loading visualization...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-900/20 border border-red-600/30 rounded p-4 mb-4">
          <p className="text-red-400 text-sm font-mono">
            <strong>Error:</strong> {error}
          </p>
          <p className="text-red-300/70 text-xs mt-2">
            Make sure the Bokeh plot exists at <code>{src}</code>
          </p>
        </div>
      )}

      {/* Bokeh plot container */}
      {!error && (
        <div
          ref={containerRef}
          className="bg-white rounded-[0.25rem] overflow-hidden"
          style={{ minHeight: `${height}px` }}
        />
      )}

      {/* Info */}
      <div className="mt-4 text-xs text-[var(--color-on-surface-variant)] italic">
        <p>📊 Interactive Bokeh visualization — hover, pan, zoom, and use toolbar tools.</p>
      </div>
    </div>
  );
}
