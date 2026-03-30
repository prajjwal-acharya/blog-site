/**
 * QuoteCallout — large centered editorial quote section.
 * Placed between sections to create rhythm and breathing room.
 */

import ScrollReveal from "@/components/ui/ScrollReveal";

interface Props {
  quote:  string;
  cite?:  string;
}

export default function QuoteCallout({ quote, cite }: Props) {
  return (
    <section className="max-w-4xl mx-auto px-6 md:px-10 py-32 text-center">
      <ScrollReveal>
        <span
          className="material-symbols-outlined text-[var(--color-primary)] text-4xl mb-8 block"
          aria-hidden="true"
        >
          format_quote
        </span>
        <blockquote className="font-headline text-3xl md:text-5xl leading-tight mb-10 italic text-[var(--color-on-surface)] text-balance">
          {quote}
        </blockquote>
        {cite && (
          <cite className="font-label text-[0.65rem] tracking-[0.3em] uppercase text-[var(--color-secondary)] not-italic">
            — {cite}
          </cite>
        )}
      </ScrollReveal>
    </section>
  );
}
