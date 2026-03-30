/**
 * Hero — homepage hero with asymmetric editorial layout.
 * Server component; no client-side JS.
 */

import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Hero() {
  return (
    <section
      className="max-w-screen-xl mx-auto px-6 md:px-10 pt-16 pb-28"
      aria-label="Hero section"
    >
      {/* 12-column editorial grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
        {/* Headline column */}
        <div className="lg:col-span-8">
          <ScrollReveal delay={0}>
            <span className="eyebrow mb-6 block">
              Thinking in public · AI & Math
            </span>
            <h1 className="font-headline text-[clamp(3rem,8vw,7rem)] leading-[0.92] tracking-[-0.02em] text-[var(--color-on-surface)] font-semibold max-w-4xl text-balance">
              Where{" "}
              <span className="italic text-[var(--color-primary)]">
                intelligence
              </span>{" "}
              meets intuition.
            </h1>
          </ScrollReveal>
        </div>

        {/* Sub-copy column — intentionally offset right */}
        <div className="lg:col-span-4 pb-2">
          <ScrollReveal delay={120}>
            <p className="text-[var(--color-secondary)] text-lg leading-[1.75] font-light italic border-l-2 border-[var(--color-outline-variant)]/40 pl-6">
              Deep dives into AI advancements, the math behind ML, elegant
              algorithms, and honest build logs from side projects.
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Hero image banner */}
      <ScrollReveal delay={200} className="mt-16">
        <div className="relative h-[520px] md:h-[620px] w-full overflow-hidden rounded-[0.25rem] group">
          {/* Gradient overlay with abstract neural pattern */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface-container)] via-[var(--color-surface-container-high)] to-[var(--color-surface-container-highest)]"
            aria-hidden="true"
          />
          {/* Decorative SVG — abstract neural / math motif */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20 transition-opacity group-hover:opacity-30"
            viewBox="0 0 800 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="g1" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="400" cy="300" r="280" fill="url(#g1)" />
            {/* Node network */}
            {[
              [100, 150], [300, 80], [500, 130], [700, 200],
              [180, 350], [400, 430], [620, 380], [750, 450],
              [200, 520], [460, 550],
            ].map(([cx, cy], i) => (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={i % 3 === 0 ? 6 : 4}
                  fill="var(--color-primary)"
                  opacity="0.7"
                />
              </g>
            ))}
            {/* Edges */}
            {[
              "M100,150 L300,80", "M300,80 L500,130", "M500,130 L700,200",
              "M100,150 L180,350", "M300,80 L400,430", "M700,200 L620,380",
              "M180,350 L400,430", "M400,430 L620,380", "M620,380 L750,450",
              "M180,350 L200,520", "M400,430 L460,550",
            ].map((d, i) => (
              <path
                key={i}
                d={d}
                stroke="var(--color-primary)"
                strokeWidth="1"
                opacity="0.25"
              />
            ))}
          </svg>

          {/* Cover story overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-on-surface)]/30 to-transparent" />
          <div className="absolute bottom-10 left-10 text-[var(--color-surface-bright)]">
            <span className="font-label text-[0.6rem] tracking-[0.25em] uppercase mb-2 block opacity-80">
              Latest deep dive
            </span>
            <h2 className="font-headline text-3xl md:text-4xl font-semibold">
              The Math Behind Transformers
            </h2>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
