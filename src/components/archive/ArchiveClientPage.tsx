"use client";

/**
 * ArchiveClientPage — full redesign.
 * • Stats header with post count, category count, year span
 * • Inline search + category + year filters (no floating bar)
 * • Timeline list view grouped by year
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/types";
import Tag from "@/components/ui/Tag";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Props {
  posts: PostMeta[];
}

export default function ArchiveClientPage({ posts }: Props) {
  // ── Derived filter options ──────────────────────────────────
  const years = useMemo(() => {
    const ys = posts.map((p) => new Date(p.date + "T00:00:00").getFullYear());
    return Array.from(new Set(ys)).sort((a, b) => b - a);
  }, [posts]);

  const categories = useMemo(() => {
    return Array.from(new Set(posts.map((p) => p.category))).sort();
  }, [posts]);

  // ── Filter state ────────────────────────────────────────────
  const [query,    setQuery]    = useState("");
  const [selYear,  setSelYear]  = useState<number | null>(null);
  const [selCat,   setSelCat]   = useState<string | null>(null);

  // ── Filtered + grouped posts ────────────────────────────────
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return posts.filter((p) => {
      if (selYear && new Date(p.date + "T00:00:00").getFullYear() !== selYear) return false;
      if (selCat  && p.category !== selCat) return false;
      if (q && !p.title.toLowerCase().includes(q) &&
              !p.description.toLowerCase().includes(q) &&
              !p.tags.some((t) => t.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [posts, selYear, selCat, query]);

  const grouped = useMemo(() => {
    const map = new Map<number, PostMeta[]>();
    for (const p of filtered) {
      const y = new Date(p.date + "T00:00:00").getFullYear();
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(p);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  // ── Stats ───────────────────────────────────────────────────
  const totalMinutes = useMemo(() => {
    return posts.reduce((acc, p) => {
      const n = parseInt(p.readingTime);
      return acc + (isNaN(n) ? 5 : n);
    }, 0);
  }, [posts]);

  const yearSpan = years.length > 1
    ? `${years[years.length - 1]}–${years[0]}`
    : years[0]?.toString() ?? "—";

  const activeFilters = (selYear ? 1 : 0) + (selCat ? 1 : 0) + (query ? 1 : 0);

  return (
    <div className="pb-32">

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="max-w-screen-xl mx-auto px-6 md:px-10 pt-16 pb-12">
        <ScrollReveal>
          <span className="eyebrow mb-5 block">Complete Collection</span>
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-16 border-b border-[var(--color-outline-variant)]/15 pb-10">
            <h1 className="font-headline text-6xl md:text-8xl font-bold leading-none tracking-tight">
              The Archive
            </h1>
            <p className="text-[var(--color-on-surface-variant)] font-headline italic text-lg max-w-sm leading-relaxed md:pb-1">
              Every article, organized. Search, filter by topic or year, find what you need.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats row */}
        <ScrollReveal delay={80}>
          <div className="flex items-center gap-0 mt-8 divide-x divide-[var(--color-outline-variant)]/20 overflow-x-auto">
            {[
              { n: posts.length,      label: "articles"   },
              { n: categories.length, label: "topics"     },
              { n: years.length,      label: "years"      },
              { n: `~${totalMinutes}m`, label: "reading"  },
              { n: yearSpan,          label: "span"       },
            ].map(({ n, label }) => (
              <div key={label} className="flex flex-col items-center px-6 py-4 first:pl-0 flex-shrink-0">
                <span className="font-headline text-2xl md:text-3xl font-bold text-[var(--color-on-surface)] leading-none">
                  {n}
                </span>
                <span className="font-label text-[0.52rem] tracking-[0.22em] uppercase text-[var(--color-secondary)] mt-1">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </header>

      {/* ── Filter bar ──────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 mb-10">
        <ScrollReveal delay={100}>
          <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/15 p-5 space-y-4">

            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)] text-[1.1rem]">
                search
              </span>
              <input
                type="search"
                placeholder="Search articles, topics, tags…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)]/20 pl-11 pr-4 py-3 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:outline-none focus:border-[var(--color-primary)] transition-colors font-body"
              />
            </div>

            {/* Category pills */}
            <div>
              <span className="font-label text-[0.55rem] tracking-[0.2em] uppercase text-[var(--color-outline)] mr-3">
                Topic
              </span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                <button
                  onClick={() => setSelCat(null)}
                  className={[
                    "font-label text-[0.58rem] tracking-[0.12em] uppercase px-3 py-1.5 transition-colors border",
                    selCat === null
                      ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] border-transparent"
                      : "border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface)]/60 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40",
                  ].join(" ")}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelCat(selCat === cat ? null : cat)}
                    className={[
                      "font-label text-[0.58rem] tracking-[0.12em] uppercase px-3 py-1.5 transition-colors border",
                      selCat === cat
                        ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] border-transparent"
                        : "border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface)]/60 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40",
                    ].join(" ")}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Year pills */}
            <div>
              <span className="font-label text-[0.55rem] tracking-[0.2em] uppercase text-[var(--color-outline)] mr-3">
                Year
              </span>
              <div className="inline-flex flex-wrap gap-1.5 mt-1">
                <button
                  onClick={() => setSelYear(null)}
                  className={[
                    "font-label text-[0.58rem] tracking-[0.12em] uppercase px-3 py-1.5 transition-colors border",
                    selYear === null
                      ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] border-transparent"
                      : "border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface)]/60 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40",
                  ].join(" ")}
                >
                  All years
                </button>
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelYear(selYear === y ? null : y)}
                    className={[
                      "font-label text-[0.58rem] tracking-[0.12em] uppercase px-3 py-1.5 transition-colors border",
                      selYear === y
                        ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] border-transparent"
                        : "border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface)]/60 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40",
                    ].join(" ")}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {/* Result count + clear */}
            <div className="flex items-center justify-between pt-1 border-t border-[var(--color-outline-variant)]/10">
              <span className="font-label text-[0.58rem] tracking-[0.15em] uppercase text-[var(--color-secondary)]">
                {filtered.length} {filtered.length === 1 ? "result" : "results"}
                {activeFilters > 0 && ` · ${activeFilters} filter${activeFilters > 1 ? "s" : ""} active`}
              </span>
              {activeFilters > 0 && (
                <button
                  onClick={() => { setQuery(""); setSelYear(null); setSelCat(null); }}
                  className="font-label text-[0.58rem] tracking-[0.15em] uppercase text-[var(--color-primary)] hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ── Timeline list ────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10">
        {grouped.length === 0 ? (
          <ScrollReveal>
            <div className="text-center py-24 text-[var(--color-secondary)] font-headline italic text-2xl">
              No articles match your filters.
            </div>
          </ScrollReveal>
        ) : (
          <div className="space-y-14">
            {grouped.map(([year, yearPosts], gi) => (
              <ScrollReveal key={year} delay={gi * 40}>
                <div>
                  {/* Year heading */}
                  <div className="flex items-center gap-5 mb-6">
                    <span className="font-headline text-5xl md:text-6xl font-bold text-[var(--color-primary)]/20 leading-none tabular-nums select-none">
                      {year}
                    </span>
                    <div className="flex-1 h-px bg-[var(--color-outline-variant)]/20" />
                    <span className="font-label text-[0.55rem] tracking-[0.2em] uppercase text-[var(--color-outline)]">
                      {yearPosts.length} post{yearPosts.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Post rows */}
                  <div className="border-t border-[var(--color-outline-variant)]/15">
                    {yearPosts.map((post, i) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group flex items-start md:items-center gap-4 md:gap-8 py-5 border-b border-[var(--color-outline-variant)]/10 hover:bg-[var(--color-surface-container-low)]/60 transition-colors -mx-3 px-3"
                      >
                        {/* Index */}
                        <span className="hidden md:block font-label text-[0.55rem] tracking-[0.18em] uppercase text-[var(--color-outline)]/60 tabular-nums flex-shrink-0 w-6 text-right">
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        {/* Date */}
                        <time
                          dateTime={post.date}
                          className="font-label text-[0.58rem] tracking-[0.1em] uppercase text-[var(--color-secondary)] flex-shrink-0 w-24 hidden sm:block"
                        >
                          {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </time>

                        {/* Title + desc */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-headline text-xl md:text-2xl leading-snug group-hover:text-[var(--color-primary)] transition-colors text-balance">
                            {post.title}
                          </h3>
                          <p className="text-sm text-[var(--color-secondary)] leading-relaxed line-clamp-1 mt-0.5 font-light hidden md:block">
                            {post.description}
                          </p>
                        </div>

                        {/* Meta */}
                        <div className="flex-shrink-0 flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4 text-right">
                          <Tag label={post.category} size="sm" />
                          <span className="font-label text-[0.55rem] tracking-[0.15em] uppercase text-[var(--color-outline)] hidden md:block">
                            {post.readingTime}
                          </span>
                          <span className="material-symbols-outlined text-[var(--color-primary)] text-base opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                            arrow_forward
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
