import { Button } from "@/components/ui/Button";
import { SectionShell } from "@/components/technology/SectionShell";
import type { TechnologyPageContent } from "@/types";

function Tick() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-[3px] h-3.5 w-3.5 shrink-0 text-indigo-300/80"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8.5 6.5 11.5 12.5 5" />
    </svg>
  );
}

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
      <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
        {capabilities.items.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05] sm:rounded-3xl sm:p-7"
          >
            <h3 className="font-display text-lg font-medium tracking-tight text-white sm:text-xl">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{item.description}</p>

            <ul className="mt-4 flex flex-col gap-2">
              {item.points.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-white/65">
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
