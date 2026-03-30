/**
 * Series Index Page — displays all series
 */

import fs from 'fs';
import path from 'path';
import { Series, seriesNameToSlug, formatTotalReadingTime } from '@/lib/series';
import { SeriesIndex } from '@/components/blog/SeriesIndex';

// Parse frontmatter from MDX files to build series index
function buildSeriesIndex(): Series[] {
  const postsDir = path.join(process.cwd(), 'src/content/posts');
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'));

  const seriesMap = new Map<string, Series>();

  files.forEach((file) => {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);

    if (!match) return;

    const fm = match[1];
    const title = fm.match(/title: "([^"]+)"/)?.[1] || file.replace('.mdx', '');
    const description = fm.match(/description: "([^"]+)"/)?.[1] || '';
    const series = fm.match(/series: "([^"]+)"/)?.[1];
    const seriesOrder = fm.match(/seriesOrder: (\d+)/)?.[1];
    const readingTime = fm.match(/readingTime: "([^"]+)"/)?.[1];
    const featured = fm.includes('featured: true');

    if (!series) return;

    const slug = file.replace('.mdx', '');
    const seriesSlug = seriesNameToSlug(series);

    if (!seriesMap.has(seriesSlug)) {
      seriesMap.set(seriesSlug, {
        name: series,
        slug: seriesSlug,
        description: `A curated series exploring ${series}`,
        articles: [],
        totalReadingTime: '0m',
      });
    }

    const s = seriesMap.get(seriesSlug)!;
    s.articles.push({
      slug,
      title,
      order: parseInt(seriesOrder || '999', 10),
      description,
      readingTime: readingTime || '5 min',
      featured,
    });
  });

  // Sort articles within each series and calculate total reading time
  const result = Array.from(seriesMap.values());
  result.forEach((s) => {
    s.articles.sort((a, b) => a.order - b.order);
    s.totalReadingTime = formatTotalReadingTime(s.articles);
  });

  return result.sort((a, b) => a.name.localeCompare(b.name));
}

export default function SeriesIndexPage() {
  const series = buildSeriesIndex();

  return (
    <>
      {/* Hero Header */}
      <header className="pt-48 pb-24 px-8 max-w-screen-2xl mx-auto">
        <div className="max-w-4xl">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-primary mb-6 block font-bold">Series Archive</span>
          <h1 className="font-headline text-6xl md:text-8xl italic tracking-tighter leading-[0.9] mb-8">
            Knowledge <br />
            Paths
          </h1>
          <p className="font-body text-xl text-secondary max-w-2xl leading-relaxed">
            Curated collections of interconnected articles, each a structured journey through related topics and themes.
          </p>
        </div>
      </header>

      <SeriesIndex series={series} />

      {/* Newsletter Section */}
      <section className="mt-48 bg-surface-container-low py-32 relative overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-8 text-center relative z-10">
          <h2 className="font-headline text-5xl md:text-7xl italic mb-8 tracking-tight">
            Stay Updated with <br />
            New Series
          </h2>
          <p className="font-body text-secondary max-w-xl mx-auto mb-12 text-lg">
            Receive notifications when new series are published and exclusive insights into the curation process.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              className="flex-1 bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-3 font-body transition-all placeholder:text-outline/50"
              placeholder="Your email address"
              type="email"
            />
            <button
              className="font-label text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-container transition-colors"
              type="submit"
            >
              Join
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
