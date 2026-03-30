/**
 * About page — editorial introduction with newsletter subscribe anchor.
 */

import type { Metadata } from "next";
import ScrollReveal from "@/components/ui/ScrollReveal";
import EditorialAccent from "@/components/ui/EditorialAccent";
import SubscribeForm from "@/components/about/SubscribeForm";

export const metadata: Metadata = {
  title: "About",
  description: "About Prajjwal Acharya — AI researcher, builder, and writer exploring the math behind intelligence.",
};

export default function AboutPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main content */}
        <div className="lg:col-span-7 lg:col-start-3 space-y-16">
          <ScrollReveal>
            <span className="eyebrow mb-5 block">Hello</span>
            <h1 className="font-headline text-[clamp(3rem,6vw,5rem)] font-bold tracking-tight leading-[1.05] mb-8 text-balance">
              I'm Prajjwal.{" "}
              <span className="italic font-normal text-[var(--color-primary)]">
                I think in equations and build in code.
              </span>
            </h1>
            <p className="text-lg text-[var(--color-secondary)] leading-[1.8] font-light">
              This is my corner of the internet where I share what I'm learning —
              deeply, honestly, and without the fluff. Topics range from the
              mathematical underpinnings of modern AI to algorithm design,
              fresh research in the field, and honest post-mortems on things I've built.
            </p>
          </ScrollReveal>

          {/* What I write about */}
          <ScrollReveal delay={80}>
            <EditorialAccent>
              <h2 className="font-headline text-3xl font-bold mb-6">What I write about</h2>
            </EditorialAccent>
            <div className="space-y-6 mt-8">
              {[
                {
                  title: "AI Advances",
                  body: "Breakdowns of recent papers and model releases — what actually changed, why it matters, and what it doesn't do yet.",
                },
                {
                  title: "Math Behind ML",
                  body: "From attention mechanisms to diffusion models, working through the derivations so you understand the 'why' not just the API.",
                },
                {
                  title: "Algorithms",
                  body: "Classic CS problems revisited with modern intuition, complexity proofs, and implementations worth reading.",
                },
                {
                  title: "Personal Builds",
                  body: "Side projects, tools, and experiments — with honest write-ups on what worked, what didn't, and what I'd do differently.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-5">
                  <div className="w-1 bg-[var(--color-primary)] flex-shrink-0 rounded-full" />
                  <div>
                    <h3 className="font-headline text-xl font-semibold mb-1">{item.title}</h3>
                    <p className="text-[var(--color-secondary)] leading-relaxed text-[0.95rem]">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Subscribe */}
          <ScrollReveal delay={120}>
            <div
              id="subscribe"
              className="bg-[var(--color-surface-container-low)] rounded-[0.25rem] p-10 border-l-4 border-[var(--color-primary)]"
            >
              <h2 className="font-headline text-3xl font-bold mb-3">Subscribe</h2>
              <p className="text-[var(--color-secondary)] leading-relaxed mb-6">
                New posts land here first — no newsletter spam, just signal.
                Drop your email and I'll ping you when something worth reading goes up.
              </p>
              <SubscribeForm />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
