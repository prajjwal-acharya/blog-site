/**
 * Series Management — utilities for organizing blog posts into series
 */

export interface SeriesArticle {
  slug: string;
  title: string;
  order: number;
  description: string;
  readingTime?: string;
  featured?: boolean;
}

export interface Series {
  name: string;
  slug: string;
  description: string;
  image?: string;
  color?: string;
  articles: SeriesArticle[];
  totalReadingTime: string;
}

/**
 * Convert series name to URL-safe slug
 */
export function seriesNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Format total reading time from multiple articles
 */
export function formatTotalReadingTime(articles: SeriesArticle[]): string {
  let totalMinutes = 0;

  articles.forEach((article) => {
    const readingTime = article.readingTime || '5 min';
    const match = readingTime.match(/(\d+)/);
    if (match) {
      totalMinutes += parseInt(match[1], 10);
    }
  });

  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}
