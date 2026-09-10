import { SectionShell } from "@/components/technology/SectionShell";
import { TechLogo, techLogoTitle } from "@/components/technology/TechLogo";
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
        {stack.items.map((item) => (
          <li
            key={item.slug}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-6 text-center transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.06]"
          >
            <TechLogo slug={item.slug} className="h-8 w-8" />
            <span className="text-xs leading-tight text-white/70 sm:text-sm">
              {item.label ?? techLogoTitle(item.slug)}
            </span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
