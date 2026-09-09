import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const AREAS = [
  "Sales",
  "Customer support",
  "Operations",
  "Procurement",
  "Inventory",
  "Documents",
  "Finance administration",
  "Reporting",
  "Internal communication",
];

const IDENTIFIES = [
  "Repetitive manual processes",
  "Processes involving multiple software systems",
  "Tasks dependent on email or spreadsheets",
  "Processes involving document reading",
  "Customer requests that consume staff time",
  "Opportunities for AI-assisted decision making",
];

export function WorkflowAssessment() {
  return (
    <section className="w-full px-5 py-14 sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="AI workflow assessment"
          title="What Can We Automate in Your Business?"
          description="You may already have dozens of workflows that can be improved with AI. We help identify them."
        />

        <div className="mt-6 grid gap-6 sm:mt-16 sm:gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/40 sm:mb-4 sm:text-xs">
              We analyze
            </p>
            <ul className="flex flex-wrap gap-2 sm:gap-3">
              {AREAS.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 sm:px-4 sm:py-2 sm:text-sm"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/40 sm:mb-4 sm:text-xs">
              Then identify
            </p>
            <ul className="flex flex-col gap-1.5 sm:gap-2">
              {IDENTIFIES.map((item) => (
                <li key={item} className="text-xs text-white/60 sm:text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-sm text-white/50 sm:mt-10 sm:text-base">
          You receive a practical automation roadmap based on business impact.
        </p>

        <Button href="#contact" className="mt-5 sm:mt-6">
          Book an AI Workflow Assessment
        </Button>
      </div>
    </section>
  );
}
