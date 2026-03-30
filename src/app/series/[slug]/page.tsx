/**
 * Individual Series Page — shows series details and flowchart
 */

import fs from 'fs';
import path from 'path';
import { Series, seriesNameToSlug, formatTotalReadingTime, SeriesArticle } from '@/lib/series';
import { SeriesFlowchart } from '@/components/blog/SeriesFlowchart';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function buildSeries(slug: string): Series | null {
  const postsDir = path.join(process.cwd(), 'src/content/posts');
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'));

  const articles: SeriesArticle[] = [];
  let seriesName = '';
  let seriesDescription = '';

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

    if (!series || seriesNameToSlug(series) !== slug) return;

    seriesName = series;
    seriesDescription = `Explore the depths of ${series}`;

    articles.push({
      slug: file.replace('.mdx', ''),
      title,
      order: parseInt(seriesOrder || '999', 10),
      description,
      readingTime: readingTime || '5 min',
      featured,
    });
  });

  if (articles.length === 0) return null;

  articles.sort((a, b) => a.order - b.order);

  return {
    name: seriesName,
    slug,
    description: seriesDescription,
    articles,
    totalReadingTime: formatTotalReadingTime(articles),
  };
}

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'src/content/posts');
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'));

  const slugs = new Set<string>();

  files.forEach((file) => {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);

    if (!match) return;

    const fm = match[1];
    const series = fm.match(/series: "([^"]+)"/)?.[1];

    if (series) {
      slugs.add(seriesNameToSlug(series));
    }
  });

  return Array.from(slugs).map((slug) => ({ slug }));
}

export default async function SeriesPage({ params }: PageProps) {
  const { slug } = await params;
  const series = buildSeries(slug);

  if (!series) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="text-center">
          <h1 className="font-headline text-4xl mb-4">Series Not Found</h1>
          <p className="text-secondary mb-8">The series you're looking for doesn't exist.</p>
          <Link href="/series" className="text-primary font-bold hover:text-primary-container">
            ← Back to Series
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="pt-32 pb-16 px-8 max-w-screen-2xl mx-auto">
        <div className="max-w-4xl">
          <Link href="/series" className="text-primary font-label text-xs uppercase tracking-widest font-bold hover:text-primary-container mb-6 inline-block">
            ← Back to Series
          </Link>
          <h1 className="font-headline text-5xl md:text-7xl italic tracking-tighter leading-tight mb-6">
            {series.name}
          </h1>
          <p className="font-body text-lg text-secondary max-w-2xl leading-relaxed mb-8">{series.description}</p>
          <div className="flex gap-12 text-sm">
            <div>
              <span className="font-label text-xs uppercase text-outline block mb-1">Total Articles</span>
              <span className="font-headline italic text-xl">{series.articles.length}</span>
            </div>
            <div>
              <span className="font-label text-xs uppercase text-outline block mb-1">Total Reading Time</span>
              <span className="font-headline italic text-xl">{series.totalReadingTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Flowchart */}
      <SeriesFlowchart series={series} />

      {/* CTA Section */}
      <section className="mt-24 bg-surface-container-low py-24 px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-headline text-4xl italic mb-6">Ready to Begin?</h2>
          <p className="font-body text-secondary mb-8 leading-relaxed">
            Start with the first article and follow the path to deepen your understanding of {series.name}.
          </p>
          <Link
            href={`/blog/${series.articles[0].slug}`}
            className="inline-block px-10 py-4 bg-primary text-on-primary font-label text-xs uppercase tracking-widest font-bold hover:bg-primary-container transition-colors"
          >
            Start Series
          </Link>
        </div>
      </section>
    </>
  );
}
