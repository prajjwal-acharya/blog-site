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
import Placeholder from "@/components/blog/Placeholder";
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
  // Headings
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      {...props}
      className="font-headline text-4xl md:text-5xl font-bold tracking-tight mt-16 mb-6 text-[var(--color-on-surface)]"
    >
      {children}
    </h1>
  ),
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
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      {...props}
      className="font-headline text-xl font-semibold tracking-tight mt-8 mb-3 text-[var(--color-on-surface)]"
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      {...props}
      className="font-headline text-lg font-semibold tracking-tight mt-6 mb-2 text-[var(--color-on-surface)]"
    >
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      {...props}
      className="font-headline text-base font-semibold tracking-tight mt-4 mb-2 text-[var(--color-on-surface)]"
    >
      {children}
    </h6>
  ),

  // Text elements
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="text-[var(--color-on-surface)] leading-relaxed mb-4">
      {children}
    </p>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} className="font-bold text-[var(--color-on-surface)]">
      {children}
    </strong>
  ),
  em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em {...props} className="italic text-[var(--color-on-surface)]">
      {children}
    </em>
  ),
  a: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      href={href}
      className="text-[var(--color-primary)] hover:underline transition-colors"
    >
      {children}
    </a>
  ),

  // Lists
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="list-disc list-inside ml-4 mb-4 space-y-2 text-[var(--color-on-surface)]">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="list-decimal list-inside ml-4 mb-4 space-y-2 text-[var(--color-on-surface)]">
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...props} className="text-[var(--color-on-surface)]">
      {children}
    </li>
  ),

  // Code
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      {...props}
      className="bg-[var(--color-primary-fixed-dim)]/20 px-1.5 py-0.5 rounded-[0.125rem] font-mono text-sm text-[var(--color-primary)] whitespace-nowrap"
    >
      {children}
    </code>
  ),
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      {...props}
      className="bg-[var(--color-on-surface)] text-[var(--color-surface)] p-4 rounded-[0.25rem] overflow-x-auto mb-4 font-mono text-sm"
    >
      {children}
    </pre>
  ),

  // Tables
  table: ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-8">
      <table {...props} className="w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
      {...props}
      className="bg-[var(--color-surface-container-high)] border-b-2 border-[var(--color-outline-variant)]"
    >
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      {...props}
      className="border-b border-[var(--color-outline-variant)]/30 hover:bg-[var(--color-surface-container-low)] transition-colors"
    >
      {children}
    </tr>
  ),
  th: ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      {...props}
      className="px-4 py-2 text-left font-semibold text-[var(--color-on-surface)]"
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td {...props} className="px-4 py-3 text-[var(--color-on-surface-variant)]">
      {children}
    </td>
  ),

  // Blockquote
  blockquote: ({ children }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-10 pl-6 border-l-4 border-[var(--color-primary)]/40 italic font-headline text-2xl text-[var(--color-primary)]/80 leading-relaxed">
      {children}
    </blockquote>
  ),

  // Horizontal rule
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr
      {...props}
      className="my-8 border-t border-[var(--color-outline-variant)]/30"
    />
  ),

  // Custom components — Callout box via custom MDX component
  Callout: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div className="my-8 bg-[var(--color-surface-container-highest)] rounded-[0.25rem] border-l-4 border-[var(--color-primary)] p-6">
      {title && (
        <p className="font-label text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[var(--color-primary)] mb-3">
          {title}
        </p>
      )}
      <div className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed">
        {children}
      </div>
    </div>
  ),

  // Math highlight block — uses div so display math ($$) renders correctly inside
  MathNote: ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 bg-[var(--color-primary-fixed-dim)]/10 border-l-4 border-[var(--color-primary)]/40 px-5 py-4 rounded-r-[0.25rem]">
      {children}
    </div>
  ),

  // Editorial accent (for !ATTENTION blocks)
  EditorialAccent: ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 pl-6 border-l-4 border-[var(--color-primary)] bg-[var(--color-primary-fixed-dim)]/10 py-4 pr-4 rounded-r-[0.25rem]">
      <div className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed">
        {children}
      </div>
    </div>
  ),

  // Placeholder for manual content
  Placeholder: (props: any) => <Placeholder {...props} />,
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
