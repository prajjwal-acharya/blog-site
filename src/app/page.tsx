/**
 * Home page — assembles Hero, FeaturedGrid, ArticleList, and QuoteCallout.
 * Server component; data fetching happens here via lib/posts.ts.
 */

import Hero           from "@/components/home/Hero";
import FeaturedGrid   from "@/components/home/FeaturedGrid";
import ArticleListItem from "@/components/home/ArticleListItem";
import QuoteCallout   from "@/components/home/QuoteCallout";
import ScrollReveal   from "@/components/ui/ScrollReveal";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const allPosts     = getAllPosts();
  const featuredPosts = allPosts.filter((p) => p.featured).slice(0, 3);
  // Fall back to latest 3 if not enough featured
  const featured      = featuredPosts.length >= 2 ? featuredPosts : allPosts.slice(0, 3);
  const latest        = allPosts.slice(0, 6);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <Hero />

      {/* ── Featured bento grid ──────────────────────── */}
      <FeaturedGrid posts={featured} />

      {/* ── Latest posts list ────────────────────────── */}
      <section
        className="bg-[var(--color-surface-container-low)] py-24"
        aria-labelledby="latest-heading"
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2
                id="latest-heading"
                className="font-headline text-5xl mb-3"
              >
                Latest Inquiries
              </h2>
              <p className="text-[var(--color-secondary)] font-light italic">
                Fresh thoughts on AI, math, and building things.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-5">
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
