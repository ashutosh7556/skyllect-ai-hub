import { SectionShell } from "@/components/technology/SectionShell";
import { NavIcon } from "@/components/layout/NavIcons";
import { cn } from "@/lib/utils";
import type { TechnologyPageContent } from "@/types";

/**
 * The delivery timeline. Each stage puts its icon on one side of the spine and
 * its copy on the other, joined by a dashed connector, and the sides swap each
 * step — so the eye zig-zags down the page instead of reading two empty
 * columns.
 *
 * Below `lg` that layout is unreadable, so it collapses to a single column
 * with the spine on the left and the icon inline above the copy.
 */
export function TechProcess({
  content,
  muted,
}: {
  content: TechnologyPageContent;
  muted?: boolean;
}) {
  const { process } = content;

  return (
    <SectionShell
      muted={muted}
      heading={process.heading}
      accent={process.accent}
      description={process.description}
    >
      <div className="relative mx-auto max-w-[1000px]">
        {/* The spine. Left-aligned while stacked, centred once the stages
            alternate across it. */}
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[21px] w-px bg-gradient-to-b from-transparent via-white/15 to-transparent lg:left-1/2 lg:-translate-x-1/2"
        />

        <ol className="flex flex-col gap-10 lg:gap-0">
          {process.steps.map((step, i) => {
            // Even stages put the icon left of the spine, odd ones right.
            const iconLeft = i % 2 === 0;

            return (
              <li
                key={step.title}
                className="relative pl-14 lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-16 lg:pl-0 lg:py-6"
              >
                {/* Node where the connector meets the spine. */}
                <span
                  aria-hidden="true"
                  className="absolute top-3 left-[13px] z-10 flex h-[17px] w-[17px] items-center justify-center rounded-full border-2 border-indigo-300/70 bg-background lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
                />

                {/* Icon tile. Order is set explicitly so the DOM can stay in
                    reading order — copy always follows its own heading. */}
                <div
                  className={cn(
                    "absolute top-0 left-0 lg:static lg:flex",
                    iconLeft
                      ? "lg:col-start-1 lg:row-start-1 lg:justify-end"
                      : "lg:col-start-2 lg:row-start-1 lg:justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center",
                      iconLeft ? "lg:flex-row" : "lg:flex-row-reverse",
                    )}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05] text-indigo-200/80 lg:h-20 lg:w-20 lg:rounded-2xl">
                      <NavIcon name={step.icon} className="h-5 w-5 lg:h-8 lg:w-8" />
                    </span>
                    {/* Dashed run from the tile to the spine. */}
                    <span
                      aria-hidden="true"
                      className="hidden border-t border-dashed border-white/20 lg:block lg:w-[110px]"
                    />
                  </div>
                </div>

                <div
                  className={cn(
                    iconLeft
                      ? "lg:col-start-2 lg:row-start-1 lg:text-left"
                      : "lg:col-start-1 lg:row-start-1 lg:text-right",
                  )}
                >
                  <p className="font-mono text-xs text-white/35">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display mt-1.5 text-lg font-medium tracking-tight text-white sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/55 lg:inline-block">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </SectionShell>
  );
}
