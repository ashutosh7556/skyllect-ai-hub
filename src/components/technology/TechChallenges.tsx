import { SectionShell } from "@/components/technology/SectionShell";
import { cn } from "@/lib/utils";
import type { TechnologyPageContent } from "@/types";

/**
 * Alternating rows, one per problem. The reference layout pairs each block of
 * copy with a photograph; Skyllect does not use stock imagery, so the visual
 * side is a numbered panel drawn from the brand palette instead.
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
              className="relative flex h-44 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 md:h-[300px] md:rounded-2xl lg:w-[520px]"
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 0%, rgba(99,102,241,0.20) 0%, rgba(168,85,247,0.10) 38%, rgba(12,9,25,1) 78%)",
              }}
            >
              <span className="font-display text-[clamp(4rem,12vw,8rem)] leading-none font-medium text-white/10">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-col items-start gap-3 lg:max-w-lg lg:gap-5 xl:max-w-[620px]">
              <h3 className="font-display text-xl font-medium tracking-tight text-white lg:text-2xl xl:text-3xl">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/55 md:text-base">{item.body}</p>

              <ul className="flex flex-col gap-2">
                {item.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-sm leading-relaxed text-white/65 md:text-base"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300/70"
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
