/**
 * ArticleHeader — centered hero area for an individual blog post.
 * Displays title, description, author meta, and tags.
 */

import type { PostMeta } from "@/lib/types";
import Tag from "@/components/ui/Tag";

interface Props {
  post: PostMeta;
}

export default function ArticleHeader({ post }: Props) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  });

  return (
    <header className="max-w-screen-xl mx-auto px-6 md:px-10 mb-20 grid grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-8 md:col-start-3 text-center">
        {/* Eyebrow */}
        <div className="mb-8 inline-flex items-center gap-3">
          <Tag label={post.category} size="sm" />
          {post.tags.slice(0, 2).map((t) => (
            <Tag key={t} label={t} size="sm" variant="outlined" />
          ))}
        </div>

        {/* Title */}
        <h1 className="font-headline text-[clamp(2.5rem,6vw,5.5rem)] font-bold tracking-tight leading-[1.05] mb-7 text-[var(--color-on-surface)] text-balance">
          {post.title}
        </h1>

        {/* Description */}
        <p className="font-body text-lg text-[var(--color-secondary)] max-w-2xl mx-auto leading-relaxed mb-10">
          {post.description}
        </p>

        {/* Meta bar */}
        <div className="flex items-center justify-center gap-3 text-[var(--color-on-surface)]/50 font-label text-[0.65rem] uppercase tracking-[0.18em] flex-wrap">
          <span>Prajjwal Acharya</span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]/30" aria-hidden="true" />
          <span>{post.readingTime}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]/30" aria-hidden="true" />
          <time dateTime={post.date}>{formattedDate}</time>
        </div>
      </div>
    </header>
  );
}
