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
      <div className={cn("grid gap-4 sm:grid-cols-2 lg:gap-6", columns === 3 && "lg:grid-cols-3")}>
        {items.map((item, i) => (
          <article key={item.title} className="card p-6">
            {numbered ? (
              <p className="font-display text-xl font-bold text-brand-orange">
                {String(i + 1).padStart(2, "0")}
              </p>
            ) : null}
            <h3 className="font-display mt-1.5 text-lg font-bold text-heading">{item.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-body">{item.description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
