/**
 * ArticleListItem — glass card row for the "Latest Posts" section.
 * Used on both the home page and the blog listing page.
 */

import Link from "next/link";
import type { PostMeta } from "@/lib/types";
import Tag from "@/components/ui/Tag";

interface Props {
  post: PostMeta;
}

export default function ArticleListItem({ post }: Props) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block" aria-label={post.title}>
      <article className="glass-card rounded-[0.25rem] border border-white/20 dark:border-white/5 px-8 py-7 md:px-10 flex flex-col md:flex-row gap-7 items-start md:items-center transition-all duration-500 hover:scale-[1.005] hover:shadow-[var(--shadow-editorial-md)]">
        {/* Category + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <Tag label={post.category} size="sm" />
            <span className="w-1 h-1 rounded-full bg-[var(--color-outline-variant)]" aria-hidden="true" />
            <span className="font-label text-[0.6rem] tracking-[0.18em] uppercase text-[var(--color-secondary)]">
              {post.readingTime}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-outline-variant)]" aria-hidden="true" />
            <time
              dateTime={post.date}
              className="font-label text-[0.6rem] tracking-[0.12em] uppercase text-[var(--color-secondary)]"
            >
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day:   "numeric",
              })}
            </time>
          </div>

          <h3 className="font-headline text-2xl md:text-3xl mb-2 group-hover:text-[var(--color-primary)] transition-colors italic leading-snug">
            {post.title}
          </h3>

          <p className="text-[var(--color-secondary)] text-[0.9rem] leading-relaxed line-clamp-2 font-light">
            {post.description}
          </p>
        </div>

        {/* Arrow indicator */}
        <div className="hidden md:block flex-shrink-0">
          <span className="material-symbols-outlined text-[var(--color-primary)] group-hover:translate-x-2 transition-transform duration-300 text-xl">
            arrow_forward
          </span>
        </div>
      </article>
    </Link>
  );
}
