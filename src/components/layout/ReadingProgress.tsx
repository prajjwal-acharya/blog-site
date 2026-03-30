"use client";

/**
 * ReadingProgress — thin bar at the top of the viewport tracking scroll %.
 * Client component; reads window.scrollY on scroll.
 */

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 h-[2px] z-[60] transition-all duration-100"
      style={{
        width: `${progress}%`,
        background:
          "linear-gradient(90deg, var(--color-primary), var(--color-primary-fixed-dim))",
      }}
    />
  );
}
