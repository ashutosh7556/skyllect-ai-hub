import { SectionShell } from "@/components/technology/SectionShell";
import { cn } from "@/lib/utils";
import type { TechnologyPageContent } from "@/types";

/**
 * Alternating rows, one per problem. Each block of copy is paired with a
 * numbered panel in the brand palette rather than a stock photograph.
 */
export function TechChallenges({
  content,
  muted,
}: {
  content: TechnologyPageContent;
  muted?: boolean;
}) {
  const { challenges } = content;

  return (
    <SectionShell
      muted={muted}
      heading={challenges.heading}
      accent={challenges.accent}
      description={challenges.description}
    >
      <div className="flex flex-col gap-12 xl:gap-16">
        {challenges.items.map((item, i) => (
          <div
            key={item.title}
            className={cn(
              "flex flex-col gap-y-5 lg:flex-row lg:items-center lg:gap-x-10 xl:gap-x-20",
              i % 2 === 1 && "lg:flex-row-reverse",
            )}
          >
            <div
              aria-hidden="true"
              className="flex h-44 w-full shrink-0 items-center justify-center rounded-2xl bg-band md:h-[300px] lg:w-[520px]"
            >
              <span className="font-display text-[clamp(4rem,12vw,8rem)] leading-none font-bold text-brand-blue/20">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-col items-start gap-3 lg:max-w-lg lg:gap-5 xl:max-w-[620px]">
              <h3 className="font-display text-xl font-bold text-heading lg:text-2xl xl:text-3xl">
                {item.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-body md:text-base">{item.body}</p>

              <ul className="flex flex-col gap-2">
                {item.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-[15px] leading-relaxed text-body md:text-base"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
