/** Shared type definitions — the single source of truth for content shapes. */

export interface PostMeta {
  slug: string;
  title: string;
  date: string;           // ISO date string, e.g. "2024-12-15"
  description: string;
  category: string;       // "AI Advances" | "Math & ML" | "Algorithms" | "Builds" | ...
  tags: string[];
  readingTime: string;    // e.g. "8 min read"
  coverImage?: string;    // relative path or URL
  coverAlt?: string;
  featured?: boolean;
  draft?: boolean;
  series?: string;        // Series name (optional)
  seriesOrder?: number;   // Position in series (optional)
}

export interface Post extends PostMeta {
  content: string;        // raw MDX string
}

export interface TimelineEvent {
  year: string;
  era: string;            // e.g. "THE TURING TEST"
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  quote?: string;
  isCurrent?: boolean;    // highlights the most recent entry
}

export interface ConceptCard {
  icon: string;           // Material Symbol name
  title: string;
  body: string;
}

export type ThemeMode = "light" | "dark";

export type NavItem = {
  label: string;
  href: string;
};
