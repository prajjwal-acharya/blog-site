/**
 * Home page — animated hero, stats strip, featured grid, latest posts.
 */

import Hero            from "@/components/home/Hero";
import FeaturedGrid    from "@/components/home/FeaturedGrid";
import ArticleListItem from "@/components/home/ArticleListItem";
import QuoteCallout    from "@/components/home/QuoteCallout";
import ScrollReveal    from "@/components/ui/ScrollReveal";
import Link            from "next/link";
import { getAllPosts }  from "@/lib/posts";

export default function HomePage() {
  const allPosts      = getAllPosts();
  const featured      = allPosts.filter((p) => p.featured).slice(0, 3);
  const featuredFinal = featured.length >= 2 ? featured : allPosts.slice(0, 3);
  const latest        = allPosts.slice(0, 6);

  // Stats for strips
  const categories    = [...new Set(allPosts.map((p) => p.category))];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <Hero
        latestPost={allPosts[0]}
        postCount={allPosts.length}
      />

      {/* ── Stats strip ──────────────────────────────── */}
      <div className="border-y border-[var(--color-outline-variant)]/15 bg-[var(--color-surface-container-low)]">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10">
          <div className="flex items-stretch divide-x divide-[var(--color-outline-variant)]/15 overflow-x-auto">
            {[
              { value: allPosts.length, label: "Articles",   icon: "article"   },
              { value: categories.length, label: "Topics",   icon: "category"  },
              { value: "∞",             label: "Curiosity",  icon: "explore"   },
            ].map(({ value, label, icon }) => (
              <div key={label} className="flex items-center gap-4 px-8 py-6 flex-shrink-0">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">
                  {icon}
                </span>
                <div>
                  <div className="font-headline text-3xl font-bold text-[var(--color-on-surface)] leading-none">
                    {value}
                  </div>
                  <div className="font-label text-[0.55rem] tracking-[0.22em] uppercase text-[var(--color-secondary)] mt-0.5">
                    {label}
                  </div>
                </div>
              </div>
            ))}

            <div className="hidden md:flex items-center px-8 py-6 flex-shrink-0 ml-auto">
              <Link
                href="/series"
                className="font-label text-[0.6rem] tracking-[0.2em] uppercase text-[var(--color-primary)] hover:underline underline-offset-4 decoration-[var(--color-primary)]/40 transition-all"
              >
                View series →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Featured bento grid ──────────────────────── */}
      <FeaturedGrid posts={featuredFinal} />

      {/* ── Latest posts list ────────────────────────── */}
      <section
        className="bg-[var(--color-surface-container-low)] py-24"
        aria-labelledby="latest-heading"
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-10">
          <ScrollReveal>
            <div className="flex items-baseline justify-between mb-14">
              <div>
                <h2
                  id="latest-heading"
                  className="font-headline text-5xl mb-2"
                >
                  Latest Inquiries
                </h2>
                <p className="text-[var(--color-secondary)] font-light italic text-sm">
                  Fresh thoughts on AI, math, and building things.
                </p>
              </div>
              <Link
                href="/archive"
                className="hidden sm:block font-label text-[0.62rem] tracking-[0.2em] uppercase text-[var(--color-primary)] hover:underline underline-offset-4 decoration-[var(--color-primary)]/40"
              >
                Full archive →
              </Link>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {latest.map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 50}>
                <ArticleListItem post={post} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote ────────────────────────────────────── */}
      <QuoteCallout
        quote="The most powerful ideas are the ones you can explain on a napkin — and prove on a chalkboard."
        cite="Prajjwal Acharya · Working principle"
      />
    </>
  );
}
