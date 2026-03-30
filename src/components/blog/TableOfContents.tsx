"use client";

/**
 * TableOfContents — sticky left sidebar TOC with active section tracking.
 * Reads h2/h3 headings from the article DOM via IntersectionObserver.
 */

import { useEffect, useState } from "react";

interface Heading {
  id:    string;
  text:  string;
  level: 2 | 3;
}

interface Props {
  /** The CSS selector of the article container to scan for headings. */
  articleSelector?: string;
}

export default function TableOfContents({
  articleSelector = "article.prose-editorial",
}: Props) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active,   setActive]   = useState<string>("");

  // Extract headings from the article after mount
  useEffect(() => {
    const container = document.querySelector(articleSelector);
    if (!container) return;

    const nodes = Array.from(container.querySelectorAll("h2, h3")) as HTMLElement[];
    const extracted: Heading[] = nodes.map((node, idx) => {
      if (!node.id) node.id = `heading-${idx}`;
      return {
        id:    node.id,
        text:  node.textContent ?? "",
        level: parseInt(node.tagName[1]) as 2 | 3,
      };
    });
    setHeadings(extracted);

    // Intersection observer for active highlight
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [articleSelector]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="space-y-1">
      <p className="font-label text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[var(--color-primary)] mb-4">
        Contents
      </p>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
          }}
          className={[
            "block text-sm leading-snug transition-colors py-0.5",
            h.level === 3 && "pl-3",
            active === h.id
              ? "text-[var(--color-primary)] font-medium"
              : "text-[var(--color-secondary)] hover:text-[var(--color-on-surface)]",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
