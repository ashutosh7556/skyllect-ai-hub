import { SectionShell } from "@/components/technology/SectionShell";
import { cn } from "@/lib/utils";
import type { TechNamed, TechSectionCopy } from "@/types";

/**
 * Plain title-and-description cards. Industry solutions and the reasons to
 * choose us are the same shape, so they share one component rather than two
 * near-identical ones.
 */
export function TechCardGrid({
  copy,
  items,
  numbered = false,
  muted,
  columns = 3,
}: {
  copy: TechSectionCopy;
  items: TechNamed[];
  numbered?: boolean;
  muted?: boolean;
  columns?: 2 | 3;
}) {
  return (
    <SectionShell
      muted={muted}
      heading={copy.heading}
      accent={copy.accent}
      description={copy.description}
    >
      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2 lg:gap-5",
          columns === 3 && "lg:grid-cols-3",
        )}
      >
        {items.map((item, i) => (
          <article
            key={item.title}
            className="rounded-2xl border border-edge bg-surface-2/60 p-5 transition-colors duration-300 hover:border-edge-strong hover:bg-surface-3/70 sm:rounded-3xl sm:p-6"
          >
            {numbered ? (
              <p className="font-mono text-xs text-muted/70">
                {String(i + 1).padStart(2, "0")}
              </p>
            ) : null}
            <h3 className="font-display mt-1.5 text-base font-medium tracking-tight text-foreground sm:text-lg">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
