/**
 * RelatedPosts — 3-column grid of related post teasers below the article body.
 */

import Link from "next/link";
import type { PostMeta } from "@/lib/types";

interface Props {
  posts: PostMeta[];
}

export default function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="max-w-screen-xl mx-auto px-6 md:px-10 mt-32">
      <p className="font-label text-[0.6rem] font-bold tracking-[0.25em] uppercase text-[var(--color-secondary)] mb-10 text-center">
        Further Reading
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
            aria-label={post.title}
          >
            {/* Thumbnail placeholder */}
            <div className="aspect-[4/3] bg-[var(--color-surface-container-low)] mb-5 overflow-hidden rounded-[0.125rem]">
              <div className="w-full h-full bg-gradient-to-br from-[var(--color-surface-container)] to-[var(--color-surface-container-high)] group-hover:scale-105 transition-transform duration-700" />
            </div>

            <p className="font-label text-[0.6rem] tracking-[0.2em] text-[var(--color-primary)] uppercase mb-2">
              {post.category}
            </p>
            <h4 className="font-headline text-xl font-bold group-hover:text-[var(--color-primary)] transition-colors leading-snug">
              {post.title}
            </h4>
            <p className="text-sm text-[var(--color-secondary)] mt-2 line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
