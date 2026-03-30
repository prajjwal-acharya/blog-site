/**
 * Content utilities for reading MDX posts from the filesystem.
 * Keeps all file I/O in one place — components never read fs directly.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostMeta } from "./types";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

/** Read all .mdx files, parse front-matter, return sorted by date desc. */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.(mdx|md)$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
    const { data, content } = matter(raw);
    const { text: readTime } = readingTime(content);

    return {
      slug,
      title:       data.title       ?? "Untitled",
      date:        data.date        ?? new Date().toISOString().split("T")[0],
      description: data.description ?? "",
      category:    data.category    ?? "General",
      tags:        data.tags        ?? [],
      readingTime: readTime,
      coverImage:  data.coverImage,
      coverAlt:    data.coverAlt,
      featured:    data.featured    ?? false,
      draft:       data.draft       ?? false,
    } satisfies PostMeta;
  });

  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

/** Get single post by slug, including raw MDX content. */
export function getPostBySlug(slug: string): Post | null {
  const mdxPath  = path.join(POSTS_DIR, `${slug}.mdx`);
  const mdPath   = path.join(POSTS_DIR, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const { text: readTime } = readingTime(content);

  return {
    slug,
    content,
    title:       data.title       ?? "Untitled",
    date:        data.date        ?? new Date().toISOString().split("T")[0],
    description: data.description ?? "",
    category:    data.category    ?? "General",
    tags:        data.tags        ?? [],
    readingTime: readTime,
    coverImage:  data.coverImage,
    coverAlt:    data.coverAlt,
    featured:    data.featured    ?? false,
    draft:       data.draft       ?? false,
  };
}

/** Get all slugs — used in generateStaticParams. */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.(mdx|md)$/, ""));
}

/** Get featured posts (up to `limit`). */
export function getFeaturedPosts(limit = 3): PostMeta[] {
  return getAllPosts()
    .filter((p) => p.featured)
    .slice(0, limit);
}

/** Get posts by category. */
export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

/** All unique categories. */
export function getAllCategories(): string[] {
  const cats = getAllPosts().map((p) => p.category);
  return [...new Set(cats)];
}
