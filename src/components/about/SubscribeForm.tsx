"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";

export default function SubscribeForm() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to your email provider (Resend, ConvertKit, etc.)
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="font-headline italic text-[var(--color-primary)] text-lg">
        You're on the list. ✓
      </p>
    );
  }

  return (
    <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-transparent border-b-2 border-[var(--color-outline-variant)]/40 focus:border-[var(--color-primary)] outline-none text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)]/50 py-2 text-[0.95rem] transition-colors"
        aria-label="Email address"
      />
      <Button type="submit" size="md">
        Subscribe
      </Button>
    </form>
  );
}
