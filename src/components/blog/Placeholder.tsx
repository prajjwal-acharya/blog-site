"use client";

/**
 * Placeholder — reserved space for content to be added manually
 * Used for images, videos, simulations, and code that require custom implementation
 */

import { ReactNode } from "react";

interface PlaceholderProps {
  type: "image" | "video" | "simulation" | "code";
  title: string;
  description?: string;
  children?: ReactNode;
}

const typeConfig = {
  image: {
    icon: "🖼️",
    label: "Image",
    color: "from-blue-500/10 to-blue-600/10",
    border: "border-blue-300/30",
    text: "text-blue-600",
  },
  video: {
    icon: "🎥",
    label: "Video",
    color: "from-red-500/10 to-red-600/10",
    border: "border-red-300/30",
    text: "text-red-600",
  },
  simulation: {
    icon: "⚙️",
    label: "Interactive Simulation",
    color: "from-purple-500/10 to-purple-600/10",
    border: "border-purple-300/30",
    text: "text-purple-600",
  },
  code: {
    icon: "📝",
    label: "Code Example",
    color: "from-green-500/10 to-green-600/10",
    border: "border-green-300/30",
    text: "text-green-600",
  },
};

export default function Placeholder({
  type,
  title,
  description,
}: PlaceholderProps) {
  const config = typeConfig[type];

  return (
    <div
      className={`not-prose my-8 bg-gradient-to-br ${config.color} rounded-[0.25rem] border-2 ${config.border} p-8 text-center`}
    >
      <div className="text-5xl mb-4">{config.icon}</div>

      <h3 className={`font-headline text-lg font-semibold mb-2 ${config.text}`}>
        {config.label}: {title}
      </h3>

      {description && (
        <p className="text-[var(--color-on-surface-variant)] text-sm mb-4 max-w-2xl mx-auto">
          {description}
        </p>
      )}

      <div className={`inline-block px-4 py-2 bg-white/50 rounded text-sm ${config.text} font-mono`}>
        [Placeholder — to be filled during publication]
      </div>
    </div>
  );
}
