"use client";

/**
 * ArchiveClientPage — interactive year-filter wrapper for the archive grid.
 * Receives all posts from the server component parent.
 */

import { useState, useMemo } from "react";
import type { PostMeta } from "@/lib/types";
import ArchiveGrid from "@/components/archive/ArchiveGrid";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Props {
  posts: PostMeta[];
}

export default function ArchiveClientPage({ posts }: Props) {
  const years = useMemo(() => {
    const ys = posts.map((p) => new Date(p.date).getFullYear());
    return ["All", ...Array.from(new Set(ys)).sort((a, b) => b - a).map(String)];
  }, [posts]);

  const [selectedYear, setSelectedYear] = useState("All");

  const filtered = useMemo(
    () =>
      selectedYear === "All"
        ? posts
        : posts.filter(
            (p) => new Date(p.date).getFullYear() === parseInt(selectedYear)
          ),
    [posts, selectedYear]
  );

  return (
    <div className="pb-40">
      {/* Header */}
      <header className="max-w-screen-xl mx-auto px-6 md:px-10 py-16 mb-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-outline-variant)]/15 pb-8">
            <div>
              <span className="eyebrow mb-4 block">Systematic Collection</span>
              <h1 className="font-headline text-5xl md:text-7xl font-bold leading-none tracking-tight">
                The Research Grid
              </h1>
            </div>
            <div className="md:text-right max-w-sm">
              <p className="text-[var(--color-on-surface-variant)] font-headline italic text-lg leading-relaxed">
                A complete repository of posts, organized by theme and chronology.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </header>

      {/* Grid */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        <ArchiveGrid posts={filtered} />
      </div>

      {/* Floating time-scrub bar */}
      <div className="fixed bottom-0 left-0 w-full px-6 pb-6 z-40 pointer-events-none">
        <div className="max-w-screen-xl mx-auto bg-[var(--color-surface-container)]/95 backdrop-blur-[20px] border border-[var(--color-outline-variant)]/20 rounded-[0.25rem] p-5 pointer-events-auto flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <span className="font-label text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-outline)]">
              Filter by year
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={[
                  "font-label text-[0.6rem] tracking-[0.15em] uppercase px-3 py-1.5 transition-colors",
                  selectedYear === year
                    ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                    : "text-[var(--color-on-surface)] hover:text-[var(--color-primary)]",
                ].join(" ")}
              >
                {year}
              </button>
            ))}
          </div>
          <span className="flex-shrink-0 font-label text-[0.6rem] tracking-[0.15em] uppercase text-[var(--color-secondary)]">
            {filtered.length} posts
          </span>
        </div>
      </div>
    </div>
  );
}
