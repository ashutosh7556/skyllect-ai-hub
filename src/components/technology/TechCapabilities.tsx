import { Button } from "@/components/ui/Button";
import { Tick } from "@/components/ui/Tick";
import { SectionShell } from "@/components/technology/SectionShell";
import type { TechnologyPageContent } from "@/types";

/** The two-column service grid: title, standfirst, and a checklist per card. */
export function TechCapabilities({
  content,
  muted,
}: {
  content: TechnologyPageContent;
  muted?: boolean;
}) {
  const { capabilities } = content;

  return (
    <SectionShell
      muted={muted}
      heading={capabilities.heading}
      accent={capabilities.accent}
      description={capabilities.description}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
        {capabilities.items.map((item) => (
          <article key={item.title} className="card p-6 sm:p-7">
            <h3 className="font-display text-lg font-bold text-heading sm:text-xl">{item.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-body">{item.description}</p>

            <ul className="mt-4 flex flex-col gap-2">
              {item.points.map((point) => (
                <li key={point} className="flex gap-2.5 text-[15px] leading-relaxed text-body">
                  <Tick />
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button href="/#contact">Discuss Your Requirements</Button>
      </div>
    </SectionShell>
  );
}
