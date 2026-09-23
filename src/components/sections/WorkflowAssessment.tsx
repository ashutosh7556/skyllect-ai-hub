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

// Only a taste of each list is shown — the rest lives behind View More.
const PREVIEW_AREAS = 5;
const PREVIEW_IDENTIFIES = 3;

export function WorkflowAssessment() {
  return (
    <Section>
      <SectionHeading
        eyebrow="AI workflow assessment"
        title="What Can We Automate in Your Business?"
        description="You may already have dozens of workflows that can be improved with AI. We help identify them."
      />

      <div className="mt-8 grid gap-5 sm:mt-12 lg:grid-cols-2 lg:gap-6">
        <div className="card p-6">
          <h3 className="font-display text-lg font-bold text-heading">We analyze</h3>
          <ul className="mt-4 flex flex-wrap gap-2 sm:gap-3">
            {AREAS.slice(0, PREVIEW_AREAS).map((area) => (
              <li key={area} className="chip px-4 py-2 text-sm">
                {area}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h3 className="font-display text-lg font-bold text-heading">Then identify</h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {IDENTIFIES.slice(0, PREVIEW_IDENTIFIES).map((item) => (
              <li key={item} className="flex gap-2.5 text-[15px] text-body">
                <Tick />
                {item}
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
