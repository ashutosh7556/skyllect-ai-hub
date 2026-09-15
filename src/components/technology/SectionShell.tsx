import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders `text` with the first occurrence of `accent` picked out in the one
 * accent colour the site uses. Falls back to plain text when the accent is
 * not present, so a typo in the content never blanks a heading.
 *
 * A flat colour rather than the three-stop gradient this used to be: on a
 * near-black page a gradient word reads as decoration, and the technical
 * register wants emphasis, not ornament.
 */
export function AccentHeading({ text, accent }: { text: string; accent: string }) {
  const at = accent ? text.indexOf(accent) : -1;
  if (at === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, at)}
      <span className="text-accent-soft">{accent}</span>
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
        muted && "border-y border-edge bg-surface-2/60",
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
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-muted/70 sm:text-xs">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-display text-[clamp(1.6rem,4vw,2.75rem)] font-medium leading-[1.15] tracking-tight text-foreground">
            <AccentHeading text={heading} accent={accent} />
          </h2>
          {description ? (
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {children}
      </div>
    </section>
  );
}
