/**
 * ArchiveGrid — Swiss-style masonry-ish grid of all posts.
 * Accepts filtered list from the parent page.
 */

import Link from "next/link";
import type { PostMeta } from "@/lib/types";
import Tag from "@/components/ui/Tag";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Props {
  posts: PostMeta[];
}

export default function ArchiveGrid({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-24 text-[var(--color-secondary)] font-headline italic text-2xl">
        No posts found.
      </div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div>
      {/* Swiss grid — top row: 8+4 asymmetric */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-[var(--color-outline-variant)]/10 border border-[var(--color-outline-variant)]/10">
        {/* Featured large card */}
        <ScrollReveal className="md:col-span-8">
          <Link href={`/blog/${featured.slug}`} className="group block h-full">
            <article className="bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-colors duration-300 p-8 flex flex-col justify-between min-h-[480px] h-full">
              <div className="flex justify-between items-start">
                <Tag label={featured.category} size="sm" variant="filled" />
                <span className="font-label text-[0.6rem] tracking-[0.15em] uppercase text-[var(--color-outline)]">
                  {featured.readingTime}
                </span>
              </div>

              <div className="mt-10">
                <h2 className="font-headline text-4xl md:text-6xl leading-tight mb-5 group-hover:text-[var(--color-primary)] transition-colors text-balance">
                  {featured.title}
                </h2>
                <p className="text-[var(--color-secondary)] text-[0.9rem] leading-relaxed line-clamp-2 max-w-lg">
                  {featured.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-[var(--color-outline-variant)]/10">
                {featured.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="font-label text-[0.6rem] border border-[var(--color-outline)]/20 px-2.5 py-1 uppercase tracking-wider text-[var(--color-secondary)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          </Link>
        </ScrollReveal>

        {/* Stats column */}
        <ScrollReveal className="md:col-span-4" delay={60}>
          <div className="bg-[var(--color-surface-container-highest)] h-full p-8 flex flex-col justify-center items-center text-center border-l border-[var(--color-outline-variant)]/10 min-h-[200px]">
            <span className="material-symbols-outlined text-[var(--color-primary)] text-4xl mb-4">
              auto_stories
            </span>
            <div className="font-label text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-on-surface)] mb-2">
              Total Posts
            </div>
            <div className="font-headline text-5xl text-[var(--color-primary)]">
              {posts.length}
            </div>
          </div>
        </ScrollReveal>

        {/* Standard grid items — 4-col each */}
        {rest.map((post, i) => (
          <ScrollReveal
            key={post.slug}
            className="md:col-span-4"
            delay={80 + i * 40}
          >
            <Link href={`/blog/${post.slug}`} className="group block h-full">
              <article className="bg-[var(--color-surface)] hover:bg-[var(--color-surface-container-low)] transition-colors duration-300 p-7 flex flex-col justify-between border-t border-[var(--color-outline-variant)]/10 h-full min-h-[260px]">
                <div>
                  <div className="flex justify-between mb-6">
                    <Tag label={post.category} size="sm" />
                    <span className="font-label text-[0.6rem] tracking-[0.12em] uppercase text-[var(--color-outline)]">
                      {post.readingTime}
                    </span>
                  </div>

                  <h3 className="font-headline text-xl md:text-2xl mb-3 group-hover:italic transition-all leading-snug text-balance">
                    {post.title}
                  </h3>

                  <p className="text-sm text-[var(--color-on-surface-variant)] line-clamp-2 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                <div className="pt-5 border-t border-[var(--color-outline-variant)]/10 mt-4">
                  <div className="font-label text-[0.55rem] uppercase tracking-[0.18em] text-[var(--color-outline)] mb-1">
                    Tags
                  </div>
                  <div className="text-xs text-[var(--color-on-surface)] truncate">
                    {post.tags.join(", ") || "—"}
                  </div>
                </div>
              </article>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
