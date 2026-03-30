/**
 * FeaturedGrid — bento-style asymmetric featured posts section.
 * Accepts up to 3 posts; falls back gracefully if fewer available.
 */

import Link from "next/link";
import type { PostMeta } from "@/lib/types";
import Tag from "@/components/ui/Tag";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Props {
  posts: PostMeta[];
}

export default function FeaturedGrid({ posts }: Props) {
  const [main, ...rest] = posts;
  if (!main) return null;

  return (
    <section className="max-w-screen-xl mx-auto px-6 md:px-10 mb-32">
      {/* Section header */}
      <ScrollReveal>
        <div className="flex justify-between items-baseline mb-12">
          <h2 className="font-headline text-4xl italic">Selected Posts</h2>
          <Link
            href="/blog"
            className="font-label text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-primary)] hover:underline underline-offset-[6px] transition-all"
          >
            View all →
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Large featured card */}
        <ScrollReveal delay={0} className="md:col-span-2">
          <Link href={`/blog/${main.slug}`} className="group block">
            <div className="glass-card rounded-[0.25rem] border border-white/20 dark:border-white/5 p-10 md:p-12 flex flex-col justify-between min-h-[480px] transition-all duration-500 hover:shadow-[var(--shadow-editorial-lg)]">
              <div>
                <Tag label={main.category} size="sm" />
                <h3 className="font-headline text-4xl md:text-5xl leading-tight mt-5 mb-5 group-hover:text-[var(--color-primary)] transition-colors text-balance">
                  {main.title}
                </h3>
                <p className="text-[var(--color-secondary)] leading-relaxed text-[0.95rem] max-w-lg line-clamp-3">
                  {main.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--color-outline-variant)]/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-on-primary)] text-xs font-bold select-none">
                    PA
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-on-surface)]">Prajjwal Acharya</p>
                    <p className="text-[0.65rem] text-[var(--color-secondary)] italic">{main.readingTime}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[var(--color-primary)] group-hover:translate-x-2 transition-transform duration-300 text-xl">
                  arrow_forward
                </span>
              </div>
            </div>
          </Link>
        </ScrollReveal>

        {/* Side column */}
        <div className="space-y-5">
          {rest.slice(0, 2).map((post, i) => (
            <ScrollReveal key={post.slug} delay={80 * (i + 1)}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="bg-[var(--color-surface-container-low)] rounded-[0.125rem] p-7 hover:bg-[var(--color-surface-container)] transition-all duration-300 h-full">
                  <Tag label={post.category} size="sm" />
                  <h4 className="font-headline text-2xl mt-4 mb-3 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-sm text-[var(--color-secondary)] leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                  <p className="mt-3 text-[0.65rem] font-label tracking-[0.15em] uppercase text-[var(--color-secondary)]/70">
                    {post.readingTime}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}

          {/* Newsletter / subscribe CTA */}
          <ScrollReveal delay={220}>
            <div className="bg-[var(--color-primary)] rounded-[0.25rem] p-8 text-[var(--color-on-primary)] relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-headline text-2xl mb-3">Stay curious</h4>
                <p className="text-[var(--color-on-primary)]/80 text-sm mb-5 leading-relaxed">
                  New posts on AI, math, and builds. No noise.
                </p>
                <Link
                  href="/about#subscribe"
                  className="inline-block bg-[var(--color-surface)] text-[var(--color-primary)] px-5 py-2.5 font-label text-[0.65rem] uppercase tracking-[0.15em] rounded-[0.125rem] hover:bg-[var(--color-surface-container-lowest)] transition-colors"
                >
                  Subscribe
                </Link>
              </div>
              {/* Background decorative letter */}
              <span
                className="absolute -bottom-8 -right-6 text-[10rem] font-headline italic opacity-10 select-none leading-none"
                aria-hidden="true"
              >
                ∑
              </span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
