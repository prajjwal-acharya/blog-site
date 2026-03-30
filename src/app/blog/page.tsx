/**
 * Blog listing page — server component that fetches posts and renders the
 * interactive client filtering UI.
 */

import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import BlogClientContent from "@/components/blog/BlogClientContent";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Blog",
  description: "All writings on AI advances, math behind ML, algorithms, and personal builds.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-16">
      {/* Static header — server rendered for SEO */}
      <ScrollReveal>
        <header className="mb-16">
          <span className="eyebrow mb-4 block">All writings</span>
          <h1 className="font-headline text-[clamp(3rem,7vw,6rem)] font-bold tracking-tight leading-none mb-6 text-balance">
            The Archive.
          </h1>
          <p className="text-[var(--color-secondary)] text-xl italic font-light max-w-xl leading-relaxed">
            Every post on AI advances, the math behind ML, algorithms, and personal builds.
          </p>
        </header>
      </ScrollReveal>

      {/* Client-side search + filter + list */}
      <BlogClientContent posts={posts} />
    </div>
  );
}
