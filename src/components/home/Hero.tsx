/**
 * Hero — full-bleed animated homepage hero.
 * HeroCanvas is a client component; everything else is server-rendered.
 */

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import HeroCanvas from "./HeroCanvas";
import type { PostMeta } from "@/lib/types";

interface Props {
  latestPost?: PostMeta;
  postCount: number;
}

export default function Hero({ latestPost, postCount }: Props) {
  return (
    <section
      className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Animated canvas ── */}
      <HeroCanvas />

      {/* Bottom fade to page background — only overlay kept */}
      <div
        className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--color-background))",
        }}
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-10 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left: headline */}
          <div className="lg:col-span-8 xl:col-span-7">
            <ScrollReveal delay={0}>
              <span className="eyebrow mb-7 block">
                Thinking in public · AI & Mathematics
              </span>
            </ScrollReveal>

            <ScrollReveal delay={70}>
              <h1
                className="font-headline font-semibold leading-[0.87] tracking-[-0.03em] text-[var(--color-on-surface)]"
                style={{ fontSize: "clamp(3.2rem, 8.5vw, 8rem)" }}
              >
                Where{" "}
                <em className="text-[var(--color-primary)] not-italic">
                  intelligence
                </em>
                <br />
                meets{" "}
                <em className="italic text-[var(--color-primary)]">
                  intuition.
                </em>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <p className="mt-8 text-[var(--color-secondary)] text-[1.15rem] leading-[1.8] font-light max-w-lg">
                Deep dives into AI advances, the mathematics of machine
                learning, elegant algorithms, and honest build logs.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={230}>
              <div className="mt-10 flex items-center gap-8 flex-wrap">
                <Link
                  href="/archive"
                  className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-8 py-3.5 font-label text-[0.68rem] tracking-[0.18em] uppercase hover:opacity-90 active:scale-95 transition-all"
                >
                  Read latest
                </Link>
                <Link
                  href="/series"
                  className="font-label text-[0.68rem] tracking-[0.18em] uppercase text-[var(--color-on-surface)]/50 hover:text-[var(--color-primary)] transition-colors"
                >
                  Browse series →
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: decorative panel */}
          <div className="hidden lg:flex lg:col-span-4 xl:col-span-5 flex-col items-end gap-6">
            <ScrollReveal delay={320}>
              <div className="border border-[var(--color-outline-variant)]/20 bg-[var(--color-surface-container-low)]/60 backdrop-blur-sm p-8 space-y-6 min-w-[220px]">
                {/* Post count */}
                <div>
                  <div
                    className="font-headline font-bold text-[var(--color-primary)] leading-none"
                    style={{ fontSize: "clamp(3rem, 5vw, 5rem)" }}
                  >
                    {postCount}
                  </div>
                  <div className="font-label text-[0.58rem] tracking-[0.28em] uppercase text-[var(--color-secondary)] mt-1">
                    Published articles
                  </div>
                </div>

                <div className="w-full h-px bg-[var(--color-outline-variant)]/20" />

                {/* Domains */}
                <div className="space-y-2">
                  {["AI Advances", "Math & ML", "Algorithms"].map((d) => (
                    <div key={d} className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"
                        aria-hidden="true"
                      />
                      <span className="font-label text-[0.6rem] tracking-[0.15em] uppercase text-[var(--color-on-surface)]/50">
                        {d}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="w-full h-px bg-[var(--color-outline-variant)]/20" />

                {/* Latest post teaser */}
                {latestPost && (
                  <Link href={`/blog/${latestPost.slug}`} className="group block">
                    <div className="font-label text-[0.55rem] tracking-[0.2em] uppercase text-[var(--color-primary)] mb-1">
                      Latest
                    </div>
                    <div className="font-headline text-sm leading-snug text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                      {latestPost.title}
                    </div>
                    <div className="font-label text-[0.55rem] tracking-[0.1em] uppercase text-[var(--color-secondary)] mt-1">
                      {latestPost.readingTime}
                    </div>
                  </Link>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* ── Bottom strip: tag cloud ── */}
        <ScrollReveal delay={400} className="mt-16 lg:mt-20">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="font-label text-[0.55rem] tracking-[0.2em] uppercase text-[var(--color-outline)] flex-shrink-0">
              Topics
            </span>
            <div className="w-8 h-px bg-[var(--color-outline-variant)]/30 flex-shrink-0" />
            <div className="flex gap-2 flex-wrap">
              {[
                "transformers","attention","KV-cache","quantization",
                "neural networks","mathematics","algorithms","ML theory",
              ].map((tag) => (
                <span
                  key={tag}
                  className="font-label text-[0.58rem] tracking-[0.12em] uppercase border border-[var(--color-outline-variant)]/30 px-2.5 py-1 text-[var(--color-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
