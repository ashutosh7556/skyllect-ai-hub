import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LineIcon } from "@/components/ui/FeatureCards";

const AREAS: { label: string; icon: ReactNode }[] = [
  {
    label: "Sales",
    icon: (
      <LineIcon className="h-4 w-4">
        <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />
      </LineIcon>
    ),
  },
  {
    label: "Customer support",
    icon: (
      <LineIcon className="h-4 w-4">
        <path d="M4 13v-1a8 8 0 0 1 16 0v1M4 13a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2v-2ZM20 13a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2ZM17 17c0 2-2 3-5 3" />
      </LineIcon>
    ),
  },
  {
    label: "Operations",
    icon: (
      <LineIcon className="h-4 w-4">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2.8v2.4M12 18.8v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.8 12h2.4M18.8 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
      </LineIcon>
    ),
  },
  {
    label: "Procurement",
    icon: (
      <LineIcon className="h-4 w-4">
        <path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.2" />
        <circle cx="9" cy="20" r="1.3" />
        <circle cx="17" cy="20" r="1.3" />
      </LineIcon>
    ),
  },
  {
    label: "Inventory",
    icon: (
      <LineIcon className="h-4 w-4">
        <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9ZM3.5 7.5 12 12l8.5-4.5M12 12v9" />
      </LineIcon>
    ),
  },
  {
    label: "Documents",
    icon: (
      <LineIcon className="h-4 w-4">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </LineIcon>
    ),
  },
  {
    label: "Finance administration",
    icon: (
      <LineIcon className="h-4 w-4">
        <path d="M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Zm0 0 1.5-3.2h11" />
        <path d="M16 13.5h.01" strokeWidth={2.6} />
      </LineIcon>
    ),
  },
  {
    label: "Reporting",
    icon: (
      <LineIcon className="h-4 w-4">
        <path d="M4 20h16M7 16v-5M12 16V7M17 16v-8" />
      </LineIcon>
    ),
  },
  {
    label: "Internal communication",
    icon: (
      <LineIcon className="h-4 w-4">
        <path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3.5V15H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM17 9h3a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v3l-3.5-3H14" />
      </LineIcon>
    ),
  },
];

const IDENTIFIES = [
  "Repetitive manual processes",
  "Processes involving multiple software systems",
  "Tasks dependent on email or spreadsheets",
  "Processes involving document reading",
  "Customer requests that consume staff time",
  "Opportunities for AI-assisted decision making",
];

/** Stage heading for each half of the panel. */
function StageLabel({ title }: { title: string }) {
  return <h3 className="font-display text-xl font-bold text-heading sm:text-2xl">{title}</h3>;
}

export function WorkflowAssessment() {
  return (
    <Section>
      <SectionHeading
        title="What Can We Automate in Your Business?"
        description="You may already have dozens of workflows that can be improved with AI. We help identify them."
      />

      {/* One panel in two halves: what we look at, then what it surfaces. */}
      <div className="card mt-10 overflow-hidden sm:mt-14">
        <div className="grid lg:grid-cols-2">
          <div className="p-6 sm:p-9">
            <StageLabel title="We analyze" />
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {AREAS.map((area) => (
                <li
                  key={area.label}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-background py-1.5 pr-4 pl-1.5 text-[15px] font-semibold text-heading transition-colors duration-200 hover:border-brand-blue hover:bg-mist motion-reduce:transition-none"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-brand-blue shadow-[0_2px_8px_-3px_rgba(15,27,51,0.25)]">
                    {area.icon}
                  </span>
                  {area.label}
                </li>
              ))}
            </ul>
          </div>


          <div className="border-t border-line bg-background/60 p-6 sm:p-9 lg:border-t-0 lg:border-l">
            <StageLabel title="Then identify" />
            <ol className="mt-4">
              {IDENTIFIES.map((item, i) => (
                <li key={item} className="flex items-baseline gap-4 border-b border-line py-3.5 last:border-b-0">
                  <span className="font-display text-sm font-bold text-brand-orange tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base font-semibold text-heading">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Section>
  );
}
