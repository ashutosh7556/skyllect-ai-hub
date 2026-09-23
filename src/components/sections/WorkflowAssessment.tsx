import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Tick } from "@/components/ui/Tick";

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
    <Section>
      <SectionHeading
        eyebrow="AI workflow assessment"
        title="What Can We Automate in Your Business?"
        description="You may already have dozens of workflows that can be improved with AI. We help identify them."
      />

      {/* Same layout as the Connected systems / Your AI can pair above. */}
      <div className="mt-10 grid gap-5 sm:mt-14 lg:grid-cols-[1fr_1.4fr] lg:gap-6">
        <div className="card flex flex-col p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold text-heading sm:text-2xl">We analyze</h3>
          <ul className="mt-6 grid flex-1 auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3">
            {AREAS.map((area) => (
              <li
                key={area}
                className="flex items-center justify-center rounded-xl border border-[#ffd6b8] bg-peach px-3 py-3 text-center text-[15px] font-bold leading-snug text-[#c2560c] sm:text-base"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold text-heading sm:text-2xl">
            Then identify
          </h3>
          <ul className="mt-6 columns-1 gap-x-8 sm:columns-2">
            {IDENTIFIES.map((item) => (
              <li
                key={item}
                className="mb-4 flex break-inside-avoid items-start gap-3 text-[15px] font-bold leading-snug text-heading sm:text-base"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-peach">
                  <Tick className="mt-0 h-3 w-3" />
                </span>
                <span className="pt-0.5">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-8 max-w-2xl text-[15px] text-body sm:mt-10 sm:text-base">
        You receive a practical automation roadmap based on business impact.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
        <Button href="#contact">Book an AI Workflow Assessment</Button>
        <Button href="" variant="secondary">
          View More
        </Button>
      </div>
    </Section>
  );
}
