/**
 * GlassCard — glassmorphism container.
 * Wraps any content with the glass-card style + optional hover scale.
 */

import type { ReactNode } from "react";

interface GlassCardProps {
  children:   ReactNode;
  className?: string;
  hover?:     boolean;  // enable lift-on-hover
  padding?:   "sm" | "md" | "lg";
  onClick?:   () => void;
}

const paddings = { sm: "p-6", md: "p-8 md:p-10", lg: "p-10 md:p-12" };

export default function GlassCard({
  children,
  className   = "",
  hover       = false,
  padding     = "md",
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        "glass-card rounded-[0.25rem] border border-white/20 dark:border-white/5",
        paddings[padding],
        hover && "transition-all duration-500 hover:scale-[1.01] hover:shadow-[var(--shadow-editorial-md)] cursor-pointer",
        onClick && "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
