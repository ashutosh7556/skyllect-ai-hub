import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders `text` with the first occurrence of `accent` in the orange gradient.
 * Falls back to plain text when the accent is not present, so a typo in the
 * content never blanks a heading.
 */
export function AccentHeading({ text, accent }: { text: string; accent: string }) {
  const at = accent ? text.indexOf(accent) : -1;
  if (at === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, at)}
      <span className="text-gradient">{accent}</span>
      {text.slice(at + accent.length)}
    </>
  );
}

/** Breadcrumb trail shared by every content page. */
export function Breadcrumb({ section, current }: { section: string; current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <li>{section}</li>
        <li aria-hidden="true">/</li>
        <li className="font-bold text-brand-blue">{current}</li>
      </ol>
    </nav>
  );
}

interface SectionShellProps {
  id?: string;
  eyebrow?: string;
  heading: string;
  accent: string;
  description?: string;
  align?: "left" | "center";
  /** Light blue band, so consecutive sections separate without a rule. */
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
    <section id={id} className={cn("py-14 sm:py-20", muted && "bg-band", className)}>
      <div className="container-site">
        <div
          className={cn("mb-10 max-w-3xl lg:mb-14", align === "center" && "mx-auto text-center")}
        >
          {eyebrow ? (
            <p className="mb-4 inline-flex rounded-full bg-mist px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] font-bold leading-[1.25] text-heading">
            <AccentHeading text={heading} accent={accent} />
          </h2>
          {description ? (
            <p className="mt-4 text-[15px] leading-relaxed text-body sm:text-base">{description}</p>
          ) : null}
        </div>

        {children}
      </div>
    </section>
  );
}
