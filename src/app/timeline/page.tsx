/**
 * AI Timeline page — alternating left/right event cards with central axis.
 * Server rendered; no client interactivity needed.
 */

import type { Metadata } from "next";
import type { TimelineEvent } from "@/lib/types";
import TimelineItem from "@/components/timeline/TimelineItem";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "AI Timeline",
  description:
    "A curated survey of milestones in artificial intelligence — from the Turing Test to agentic LLMs.",
};

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year:  "1950",
    era:   "The Dawn of the Question",
    title: "Can Machines Think?",
    description:
      "Alan Turing publishes \"Computing Machinery and Intelligence,\" introducing the Imitation Game as a benchmark for artificial cognition. A deceptively simple question that launched a field.",
  },
  {
    year:  "1956",
    era:   "Dartmouth Conference",
    title: "The Birth of a Field",
    description:
      "John McCarthy coins the term \"Artificial Intelligence\" during a historic two-month workshop in New Hampshire. The ambition: simulate every aspect of human learning.",
  },
  {
    year:  "1986",
    era:   "Backpropagation",
    title: "Teaching Machines to Learn",
    description:
      "Rumelhart, Hinton, and Williams popularize backpropagation for training multi-layer neural networks, laying the mathematical foundation for modern deep learning.",
  },
  {
    year:  "1997",
    era:   "Symbolic Reasoning",
    title: "Deep Blue Defeats Kasparov",
    description:
      "IBM's Deep Blue defeats world chess champion Garry Kasparov — the first time a machine bests human intuition in grandmaster play. Brute-force search hits its peak.",
  },
  {
    year:  "2012",
    era:   "The Deep Learning Revolution",
    title: "AlexNet Changes Everything",
    description:
      "AlexNet wins ImageNet by a stunning margin, demonstrating that deep convolutional networks trained on GPUs could surpass hand-crafted feature engineering.",
    quote: "The GPU moment for AI research.",
  },
  {
    year:  "2017",
    era:   "Attention Mechanisms",
    title: "Attention Is All You Need",
    description:
      "Google researchers introduce the Transformer architecture — the foundational technology for every modern LLM, from GPT to Claude.",
    quote: "The paradigm shift from procedural code to neural attention.",
  },
  {
    year:  "2020",
    era:   "Scaling Laws",
    title: "GPT-3: Language at Scale",
    description:
      "OpenAI's 175B parameter model demonstrates that scaling compute, data, and model size yields emergent capabilities — in-context learning without fine-tuning.",
  },
  {
    year:  "2022",
    era:   "Alignment & RLHF",
    title: "InstructGPT & ChatGPT",
    description:
      "Reinforcement Learning from Human Feedback transforms raw language models into assistants that follow instructions. AI becomes accessible to hundreds of millions.",
  },
  {
    year:  "2024–",
    era:   "The Agentic Frontier",
    title: "Reasoning & Autonomous Agents",
    description:
      "Models gain long-horizon planning, code execution, and multi-step self-correction. AI moves from probabilistic text generation to autonomous research collaboration.",
    isCurrent: true,
  },
];

export default function TimelinePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
      {/* Header */}
      <ScrollReveal>
        <header className="mb-24 space-y-5">
          <span className="eyebrow">Intelligence Evolution</span>
          <h1 className="font-headline text-[clamp(3rem,8vw,7rem)] font-bold tracking-tight text-[var(--color-on-surface)] leading-none max-w-4xl text-balance">
            The Arc of{" "}
            <span className="italic font-normal text-[var(--color-primary)]">
              Synthetic Thought.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--color-secondary)] max-w-2xl font-body leading-relaxed opacity-80">
            A curated survey of milestones in artificial intelligence — from
            early cybernetic theories to the emergence of agentic reasoning.
          </p>
        </header>
      </ScrollReveal>

      {/* Timeline track */}
      <div className="relative">
        {/* Central vertical line */}
        <div
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[var(--color-outline-variant)]/30 md:-translate-x-1/2"
          aria-hidden="true"
        />

        {TIMELINE_EVENTS.map((event, i) => (
          <TimelineItem
            key={event.year}
            event={event}
            side={i % 2 === 0 ? "right" : "left"}
            index={i}
          />
        ))}
      </div>

      {/* Executive summary callout */}
      <ScrollReveal>
        <section className="mt-32 bg-[var(--color-surface-container-highest)] rounded-[0.25rem] p-10 md:p-16 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="eyebrow mb-5 block">Executive Summary</span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold mb-8 text-[var(--color-on-surface)] leading-tight text-balance">
              The transition from "Artificial" to "Agentic" intelligence is the
              defining shift of our decade.
            </h2>
            <Button href="/blog" icon="arrow_forward" iconRight>
              Read the deep dives
            </Button>
          </div>

          {/* Decorative background numeral */}
          <span
            className="absolute top-0 right-6 text-[16rem] font-headline italic opacity-[0.04] select-none leading-none"
            aria-hidden="true"
          >
            ∞
          </span>
        </section>
      </ScrollReveal>
    </div>
  );
}
