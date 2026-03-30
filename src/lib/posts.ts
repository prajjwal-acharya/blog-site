/**
 * Content utilities for reading MDX posts from the filesystem.
 * New structure: src/content/posts/{slug}/page.mdx
 * Each post is a folder containing page.mdx and optional dependent files (graph.tsx, simulation.tsx, etc.)
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostMeta } from "./types";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

/** Read all post folders, parse page.mdx front-matter, return sorted by date desc. */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });
  const folders = entries.filter((entry) => entry.isDirectory());

  const posts = folders
    .map((folder) => {
      const slug = folder.name;
      const pagePath = path.join(POSTS_DIR, slug, "page.mdx");

      // Skip if page.mdx doesn't exist
      if (!fs.existsSync(pagePath)) return null;

      const raw = fs.readFileSync(pagePath, "utf8");
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
        series:      data.series,
        seriesOrder: data.seriesOrder,
      } as PostMeta;
    })
    .filter((p): p is PostMeta => p !== null && !p.draft)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

/** Get single post by slug, including raw MDX content. */
export function getPostBySlug(slug: string): Post | null {
  const pagePath = path.join(POSTS_DIR, slug, "page.mdx");

  if (!fs.existsSync(pagePath)) return null;

  const raw = fs.readFileSync(pagePath, "utf8");
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
    series:      data.series,
    seriesOrder: data.seriesOrder,
  };
}

/** Get all slugs — used in generateStaticParams. */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(POSTS_DIR, entry.name, "page.mdx")))
    .map((entry) => entry.name);
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
