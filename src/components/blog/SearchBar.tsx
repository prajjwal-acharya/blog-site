"use client";

/**
 * SearchBar — controlled input that filters posts by title/description/tags.
 * Parent passes `onSearch`; no global state needed.
 */

interface Props {
  value:    string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search articles…",
}: Props) {
  return (
    <div className="relative flex items-center bg-[var(--color-surface-container-low)] rounded-[0.25rem] border-b border-[var(--color-outline-variant)]/30 focus-within:border-[var(--color-primary)] transition-colors px-4 py-3">
      <span className="material-symbols-outlined text-[var(--color-outline)] text-[1.1rem] mr-3 flex-shrink-0">
        search
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-none outline-none w-full text-[0.95rem] font-headline italic text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)]/50"
        aria-label="Search articles"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="flex-shrink-0 ml-2 text-[var(--color-outline)]/60 hover:text-[var(--color-on-surface)] transition-colors"
          aria-label="Clear search"
        >
          <span className="material-symbols-outlined text-[1.1rem]">close</span>
        </button>
      )}
    </div>
  );
}
