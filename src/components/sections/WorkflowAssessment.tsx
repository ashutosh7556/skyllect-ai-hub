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
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="AI workflow assessment"
          title="What Can We Automate in Your Business?"
          description="You may already have dozens of workflows that can be improved with AI. We help identify them."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              We analyze
            </p>
            <ul className="flex flex-wrap gap-3">
              {AREAS.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Then identify
            </p>
            <ul className="flex flex-col gap-2">
              {IDENTIFIES.map((item) => (
                <li key={item} className="text-sm text-white/60">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 max-w-2xl text-white/50">
          You receive a practical automation roadmap based on business impact.
        </p>

        <Button href="#contact" className="mt-6">
          Book an AI Workflow Assessment
        </Button>
      </div>
    </section>
  );
}
