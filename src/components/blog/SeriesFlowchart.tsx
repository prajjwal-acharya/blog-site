/**
 * Series Flowchart — visualizes series path with connected articles
 * Based on knowledge_path_flowchart_view_editorial_clay design
 */

'use client';

import Link from 'next/link';
import { Series } from '@/lib/series';

interface SeriesFlowchartProps {
  series: Series;
  currentArticleSlug?: string;
}

export function SeriesFlowchart({ series, currentArticleSlug }: SeriesFlowchartProps) {
  const sorted = [...series.articles].sort((a, b) => a.order - b.order);

  // Build SVG path data
  const nodeSpacing = 200;
  const totalNodes = sorted.length;
  const containerHeight = totalNodes * nodeSpacing;

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center py-24 px-8 bg-surface">
      {/* SVG Connector Layer */}
      <svg
        className="absolute inset-0 w-full pointer-events-none"
        style={{ height: containerHeight + 600 }}
        preserveAspectRatio="none"
      >
        {sorted.map((article, idx) => {
          if (idx === sorted.length - 1) return null;

          const y1 = 200 + idx * nodeSpacing;
          const y2 = y1 + nodeSpacing;
          const isActive = currentArticleSlug === article.slug;

          return (
            <path
              key={`path-${idx}`}
              className={isActive ? 'path-line-active' : 'path-line'}
              d={`M 50% ${y1} L 50% ${y2}`}
              style={{
                stroke: isActive ? '#994121' : '#dcc1b8',
                strokeWidth: isActive ? 1.5 : 1,
                fill: 'none',
                opacity: isActive ? 1 : 0.4,
                strokeDasharray: isActive ? '4 2' : 'none',
              }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-20">
        {sorted.map((article, idx) => {
          const isFirst = idx === 0;
          const isCurrent = currentArticleSlug === article.slug;
          const isCompleted = sorted.findIndex((a) => a.slug === currentArticleSlug) > idx;

          return (
            <div key={article.slug} className="w-full max-w-md">
              <Link href={`/blog/${article.slug}`}>
                <div
                  className={`group p-8 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-surface-container-lowest shadow-[0_12px_48px_-12px_rgba(153,65,33,0.12)] border-l-4 border-primary scale-105'
                      : 'bg-surface-container-low hover:bg-surface-container-lowest border-l-4 border-outline-variant/20'
                  }`}
                >
                  <span className="font-label text-[10px] font-bold tracking-widest uppercase mb-4 block text-secondary">
                    {isFirst ? 'Start Here' : isCurrent ? 'Current' : isCompleted ? 'Completed' : `Step ${idx + 1}`}
                  </span>
                  <h3 className="font-headline text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-secondary font-body leading-relaxed mb-6">{article.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                      {article.readingTime || '5 min'}
                    </span>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform text-sm">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}

        {/* Terminal Node */}
        <div className="w-full max-w-md">
          <div className="bg-surface-container p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <h3 className="font-headline text-xl font-bold mb-2">Series Complete</h3>
            <p className="text-xs text-secondary font-label uppercase tracking-widest mb-6">You've finished this series</p>
            <p className="text-sm text-secondary font-body leading-relaxed">Explore other series or return to the archive for more knowledge paths.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export path line styles as CSS-in-JS for reuse
export const pathLineStyles = `
  .path-line {
    stroke: #dcc1b8;
    stroke-width: 1;
    fill: none;
    opacity: 0.4;
  }
  .path-line-active {
    stroke: #994121;
    stroke-width: 1.5;
    stroke-dasharray: 4 2;
    opacity: 1;
  }
`;
