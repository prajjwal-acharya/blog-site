/**
 * TimelineItem — single entry in the alternating timeline.
 * `side` controls whether the card is left or right of the central axis.
 */

import type { TimelineEvent } from "@/lib/types";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Props {
  event: TimelineEvent;
  side:  "left" | "right";
  index: number;
}

export default function TimelineItem({ event, side, index }: Props) {
  const isLeft = side === "left";

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between mb-40 gap-6 md:gap-0">
      {/* Year label — alternates sides on desktop */}
      <div
        className={[
          "w-full md:w-[45%]",
          isLeft ? "md:text-right order-first" : "md:text-left order-first md:order-last",
        ].join(" ")}
      >
        <ScrollReveal delay={index * 60} threshold={0.2}>
          <span className="font-headline text-[6rem] md:text-[8rem] font-bold text-[var(--color-outline-variant)]/20 block select-none leading-none">
            {event.year}
          </span>
        </ScrollReveal>
      </div>

      {/* Central dot — hidden on mobile */}
      <div
        className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[var(--color-primary)] border-4 border-[var(--color-background)] -translate-x-1/2 z-10 hidden md:block"
        aria-hidden="true"
      />

      {/* Card */}
      <div
        className={[
          "w-full md:w-[45%]",
          isLeft ? "md:order-last" : "",
        ].join(" ")}
      >
        <ScrollReveal delay={index * 60 + 30}>
          <div
            className={[
              "p-8 rounded-[0.25rem] border transition-transform duration-500 hover:-translate-y-2",
              event.isCurrent
                ? "bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20"
                : "bg-[var(--color-surface-container-lowest)]/70 backdrop-blur-xl border-[var(--color-outline-variant)]/10 shadow-[var(--shadow-editorial)]",
            ].join(" ")}
          >
            {/* Era overline */}
            <span className="eyebrow mb-4 flex items-center gap-2">
              {event.isCurrent && (
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              )}
              {event.era}
            </span>

            <h3 className="font-headline text-3xl font-bold mb-4 leading-snug">
              {event.title}
            </h3>

            <p className="text-[var(--color-secondary)] leading-relaxed mb-5 text-[0.95rem]">
              {event.description}
            </p>

            {/* Optional in-card quote */}
            {event.quote && (
              <div className="bg-[var(--color-surface-container-high)] p-4 rounded-[0.125rem] border-l-4 border-[var(--color-primary)] italic text-[var(--color-on-surface-variant)] font-headline text-sm leading-relaxed">
                "{event.quote}"
              </div>
            )}

            {/* Optional image */}
            {event.image && (
              <div className="mt-5 overflow-hidden rounded-[0.125rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.image}
                  alt={event.imageAlt ?? event.title}
                  className="w-full h-44 object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
