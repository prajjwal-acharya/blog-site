"use client";

/**
 * BlogClientContent — interactive search + filter UI for the blog listing.
 * Receives all posts as props from the server component; runs filtering client-side.
 */

import { useState, useMemo } from "react";
import type { PostMeta } from "@/lib/types";
import ArticleListItem from "@/components/home/ArticleListItem";
import SearchBar from "@/components/blog/SearchBar";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Props {
  posts: PostMeta[];
}

export default function BlogClientContent({ posts }: Props) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts]
  );

  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return posts.filter((p) => {
      const matchCat  = category === "All" || p.category === category;
      const matchText =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchText;
    });
  }, [posts, search, category]);

  return (
    <>
      {/* Controls */}
      <ScrollReveal delay={80}>
        <div className="flex flex-col md:flex-row gap-5 mb-10">
          <div className="flex-1 max-w-md">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={[
                  "font-label text-[0.6rem] tracking-[0.15em] uppercase px-3 py-1.5 rounded-[0.125rem] transition-colors border",
                  category === cat
                    ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] border-transparent"
                    : "border-[var(--color-outline-variant)]/30 text-[var(--color-secondary)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]",
                ].join(" ")}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Results count */}
      <p className="font-label text-[0.6rem] tracking-[0.15em] uppercase text-[var(--color-secondary)] mb-8">
        {filtered.length} {filtered.length === 1 ? "post" : "posts"}
        {search && ` matching "${search}"`}
      </p>

      {/* List */}
      <div className="space-y-5">
        {filtered.map((post, i) => (
          <ScrollReveal key={post.slug} delay={i * 40}>
            <ArticleListItem post={post} />
          </ScrollReveal>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 font-headline italic text-2xl text-[var(--color-secondary)]">
            Nothing found. Try a different search.
          </div>
        )}
      </div>
    </>
  );
}
