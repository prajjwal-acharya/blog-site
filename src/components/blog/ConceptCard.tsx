/**
 * ConceptCard — sidebar concept / glossary card for article view.
 * Glass morphism with a Material Symbol icon and short explanation.
 */

import type { ConceptCard as ConceptCardType } from "@/lib/types";

interface Props {
  card: ConceptCardType;
}

export default function ConceptCard({ card }: Props) {
  return (
    <div className="glass-card rounded-[0.25rem] border border-white/30 dark:border-white/5 p-7 hover:scale-[1.02] transition-transform duration-500 cursor-help shadow-[var(--shadow-glass)]">
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">
          {card.icon}
        </span>
        <h3 className="font-label text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[var(--color-on-surface)]">
          {card.title}
        </h3>
      </div>
      <p className="text-sm text-[var(--color-secondary)] leading-relaxed">{card.body}</p>
    </div>
  );
}
