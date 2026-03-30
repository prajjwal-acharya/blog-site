/**
 * Series Index Gallery — displays all available series
 * Based on research_series_index_editorial_clay design
 */

'use client';

import Link from 'next/link';
import { Series } from '@/lib/series';

interface SeriesIndexProps {
  series: Series[];
}

export function SeriesIndex({ series }: SeriesIndexProps) {
  // Featured series (first one that's featured or first overall)
  const featured = series.find((s) => s.articles.some((a) => a.featured)) || series[0];
  const remaining = series.filter((s) => s !== featured);

  return (
    <main className="px-8 max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
        {featured && (
          <article className="md:col-span-2 group cursor-pointer">
            <Link href={`/series/${featured.slug}`}>
              <div className="flex flex-col md:flex-row gap-12 items-center">
                {featured.image && (
                  <div className="w-full md:w-3/5 overflow-hidden">
                    <img
                      src={featured.image}
                      alt={featured.name}
                      className="w-full aspect-[16/9] object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                    />
                  </div>
                )}
                <div className={featured.image ? 'w-full md:w-2/5 pr-4' : 'w-full'}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-label text-[10px] tracking-[0.1em] text-secondary">
                      FEATURED SERIES
                    </span>
                    <div className="h-px flex-1 bg-outline-variant/30"></div>
                  </div>
                  <h2 className="font-headline text-4xl mb-6 italic group-hover:text-primary transition-colors">
                    {featured.name}
                  </h2>
                  <p className="font-body text-secondary mb-8 leading-relaxed">{featured.description}</p>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col">
                      <span className="font-label text-[10px] uppercase text-outline">Nodes</span>
                      <span className="font-headline italic text-xl">{featured.articles.length} Articles</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-label text-[10px] uppercase text-outline">Total Time</span>
                      <span className="font-headline italic text-xl">{featured.totalReadingTime}</span>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-primary text-on-primary font-label text-xs uppercase tracking-widest font-bold hover:bg-primary-container transition-colors shadow-sm active:scale-[0.98]">
                    Start Series
                  </button>
                </div>
              </div>
            </Link>
          </article>
        )}

        {remaining.map((s, idx) => (
          <article key={s.slug} className={`group ${idx === remaining.length - 1 && remaining.length % 2 === 1 ? 'lg:col-span-2' : ''}`}>
            <Link href={`/series/${s.slug}`}>
              <div className="mb-8 overflow-hidden aspect-[4/5] bg-surface-container-low">
                {s.image && (
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                )}
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-label text-[10px] tracking-[0.1em] text-secondary">SERIES {String(remaining.indexOf(s) + 1).padStart(2, '0')}</span>
                <div className="h-px flex-1 bg-outline-variant/20"></div>
              </div>
              <h3 className="font-headline text-3xl mb-4 italic group-hover:text-primary transition-colors">{s.name}</h3>
              <p className="font-body text-secondary text-sm mb-6 leading-relaxed">{s.description}</p>
              <div className="flex justify-between items-end border-t border-outline-variant/10 pt-6">
                <div className="text-xs font-label text-outline uppercase tracking-tighter">
                  {s.articles.length} Nodes / {s.totalReadingTime}
                </div>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
