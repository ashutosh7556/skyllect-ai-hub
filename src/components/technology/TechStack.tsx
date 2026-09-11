import { SectionShell } from "@/components/technology/SectionShell";
import { TechLogo, techLogoTitle } from "@/components/technology/TechLogo";
import { monogram } from "@/components/layout/NavIcons";
import type { TechnologyPageContent } from "@/types";

/**
 * A flat grid of technology tiles, each carrying its own brand mark. Grouping
 * by discipline was dropped here deliberately — once the logos are present
 * they categorise faster than the headings did, and the grid reads in one
 * pass instead of six.
 */
export function TechStack({
  content,
  muted,
}: {
  content: TechnologyPageContent;
  muted?: boolean;
}) {
  const { stack } = content;

  return (
    <SectionShell
      muted={muted}
      id="technology-stack"
      heading={stack.heading}
      accent={stack.accent}
      description={stack.description}
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {stack.items.map((item) => {
          const name = item.slug ? (item.label ?? techLogoTitle(item.slug)) : item.label;

          return (
            <li
              key={name}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-6 text-center transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.06]"
            >
              {item.slug ? (
                <TechLogo slug={item.slug} className="h-8 w-8" />
              ) : (
                // No brand mark available for this one; fall back to the
                // monogram treatment the header menu already uses.
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 bg-white/[0.05] text-[11px] font-semibold tracking-tight text-white/60"
                >
                  {monogram(name)}
                </span>
              )}
              <span className="text-xs leading-tight text-white/70 sm:text-sm">{name}</span>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
