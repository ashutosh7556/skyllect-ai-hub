import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The one gradient the site uses to pick a word out of a heading. */
const ACCENT_GRADIENT = "linear-gradient(to left, #6366f1, #a855f7, #fcd34d)";

/**
 * Renders `text` with the first occurrence of `accent` in the brand gradient.
 * Falls back to plain text when the accent is not present, so a typo in the
 * content never blanks a heading.
 */
export function AccentHeading({ text, accent }: { text: string; accent: string }) {
  const at = accent ? text.indexOf(accent) : -1;
  if (at === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, at)}
      <span className="bg-clip-text text-transparent" style={{ backgroundImage: ACCENT_GRADIENT }}>
        {accent}
      </span>
      {text.slice(at + accent.length)}
    </>
  );
}

interface SectionShellProps {
  id?: string;
  eyebrow?: string;
  heading: string;
  accent: string;
  description?: string;
  align?: "left" | "center";
  /** Alternating band, so consecutive sections separate without a rule. */
  muted?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * The shared frame for every block on a technology page: consistent vertical
 * rhythm, a centred heading with one accent word, and an optional standfirst.
 * Keeping it in one place is what makes the six technology pages feel like the
 * same document.
 */
export function SectionShell({
  id,
  eyebrow,
  heading,
  accent,
  description,
  align = "center",
  muted = false,
  className,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "px-5 py-13 sm:px-8 xl:py-25",
        muted && "border-y border-white/5 bg-white/[0.02]",
        className,
      )}
    >
      <div className="mx-auto max-w-[1200px]">
        <div
          className={cn(
            "mb-12 max-w-3xl lg:mb-14 xl:mb-18",
            align === "center" && "mx-auto text-center",
          )}
        >
          {eyebrow ? (
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-white/45 sm:text-xs">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-display text-[clamp(1.6rem,4vw,2.75rem)] font-medium leading-[1.15] tracking-tight text-white">
            <AccentHeading text={heading} accent={accent} />
          </h2>
          {description ? (
            <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {children}
      </div>
    </section>
  );
}
