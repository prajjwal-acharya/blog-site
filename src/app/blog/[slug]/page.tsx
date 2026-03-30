/**
 * Individual blog post page.
 * Layout: sticky left TOC | article body | right concept cards sidebar.
 * Renders MDX with math (KaTeX) and syntax highlighting (rehype-highlight).
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import Script from "next/script";

import { getPostBySlug, getAllSlugs, getAllPosts } from "@/lib/posts";
import { postMeta, blogPostJsonLd } from "@/lib/seo";
import ArticleHeader from "@/components/blog/ArticleHeader";
import TableOfContents from "@/components/blog/TableOfContents";
import ConceptCard from "@/components/blog/ConceptCard";
import RelatedPosts from "@/components/blog/RelatedPosts";
import ReadingProgress from "@/components/layout/ReadingProgress";
import EditorialAccent from "@/components/ui/EditorialAccent";
import MatrixVisualization from "@/components/blog/MatrixVisualization";
import GraphVisualizer from "@/components/blog/GraphVisualizer";
import CodeSandbox from "@/components/blog/CodeSandbox";
import type { ConceptCard as ConceptCardType } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return postMeta(post);
}

// MDX component overrides — maps HTML elements to styled versions
const mdxComponents = {
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className="font-headline text-3xl md:text-4xl font-bold tracking-tight mt-14 mb-5 text-[var(--color-on-surface)]"
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className="font-headline text-2xl font-semibold tracking-tight mt-10 mb-4 text-[var(--color-on-surface)]"
    >
      {children}
    </h3>
  ),
  blockquote: ({ children }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-10 pl-6 border-l-4 border-[var(--color-primary)]/40 italic font-headline text-2xl text-[var(--color-primary)]/80 leading-relaxed">
      {children}
    </blockquote>
  ),
  // Callout box via custom MDX component
  Callout: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div className="my-8 bg-[var(--color-surface-container-highest)] rounded-[0.25rem] border-l-4 border-[var(--color-primary)] p-6">
      {title && (
        <p className="font-label text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[var(--color-primary)] mb-3">
          {title}
        </p>
      )}
      <div className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed italic">
        {children}
      </div>
    </div>
  ),
  // Math highlight inline
  MathNote: ({ children }: { children: React.ReactNode }) => (
    <span className="bg-[var(--color-primary-fixed-dim)]/20 px-1.5 border-b border-[var(--color-primary)]/25 rounded-[0.125rem]">
      {children}
    </span>
  ),
  // Interactive simulations
  MatrixVisualization: (props: any) => <MatrixVisualization {...props} />,
  GraphVisualizer: (props: any) => <GraphVisualizer {...props} />,
  CodeSandbox: (props: any) => <CodeSandbox {...props} />,
};

const mdxOptions = {
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeKatex, rehypeHighlight],
};

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const related  = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  // Placeholder concept cards — in production these would come from front-matter
  const conceptCards: ConceptCardType[] = [
    {
      icon:  "hub",
      title: "Key Concept",
      body:  "Hover for a quick definition or context relevant to this article.",
    },
  ];

  return (
    <>
      {/* Reading progress bar */}
      <ReadingProgress />

      {/* JSON-LD structured data */}
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd(post)) }}
      />

      {/* Article header */}
      <ArticleHeader post={post} />

      {/* Three-column layout: TOC | body | concepts */}
      <section className="max-w-screen-xl mx-auto px-6 md:px-10 grid grid-cols-12 gap-8 lg:gap-16 relative">
        {/* Left sidebar — TOC */}
        <aside className="hidden xl:block col-span-2 sticky top-32 self-start">
          <TableOfContents />

          {/* Metadata below TOC */}
          <div className="mt-10 pt-8 border-t border-[var(--color-outline-variant)]/20 space-y-4">
            <div>
              <p className="font-label text-[0.55rem] font-bold tracking-[0.2em] uppercase text-[var(--color-primary)] mb-2">
                Category
              </p>
              <p className="text-sm text-[var(--color-secondary)]">{post.category}</p>
            </div>
            {post.tags.length > 0 && (
              <div>
                <p className="font-label text-[0.55rem] font-bold tracking-[0.2em] uppercase text-[var(--color-primary)] mb-2">
                  Tags
                </p>
                <div className="flex flex-col gap-1">
                  {post.tags.map((t) => (
                    <span key={t} className="text-xs text-[var(--color-secondary)]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Article body — cols: left(2) + body(7, start-3) + right(3) = 12 */}
        <article
          className="col-span-12 md:col-span-8 xl:col-span-7 md:col-start-3 xl:col-start-3 prose prose-editorial"
          aria-label="Article content"
        >
          {/* drop-cap targets ::first-letter of the first child paragraph */}
          <div className="drop-cap">
            <MDXRemote
              source={post.content}
              options={{ mdxOptions } as object}
              components={mdxComponents}
            />
          </div>

          {/* Article footer */}
          <footer className="mt-16 pt-10 border-t border-[var(--color-outline-variant)]/20 not-prose">
            <EditorialAccent>
              <p className="font-label text-[0.6rem] tracking-[0.2em] uppercase text-[var(--color-secondary)] mb-1">
                Written by
              </p>
              <p className="font-headline text-lg font-bold text-[var(--color-on-surface)]">
                Prajjwal Acharya
              </p>
              <p className="text-sm text-[var(--color-secondary)] italic mt-0.5">
                {post.readingTime} ·{" "}
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </time>
              </p>
            </EditorialAccent>
          </footer>
        </article>

        {/* Right sidebar — cols 10-12 on xl; full-width below */}
        <aside className="col-span-12 xl:col-span-3 xl:col-start-10 space-y-6 mt-4">
          {conceptCards.map((card, i) => (
            <ConceptCard key={i} card={card} />
          ))}

          {/* Executive summary callout */}
          <div className="bg-[var(--color-surface-container-highest)] rounded-[0.25rem] border-l-4 border-[var(--color-primary)] p-7">
            <p className="font-label text-[0.55rem] font-bold tracking-[0.2em] uppercase mb-3 text-[var(--color-on-surface)]">
              TL;DR
            </p>
            <p className="font-body text-sm text-[var(--color-on-surface-variant)] leading-relaxed italic">
              {post.description}
            </p>
          </div>
        </aside>
      </section>

      {/* Related posts */}
      <RelatedPosts posts={related} />
    </>
  );
}
