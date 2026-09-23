import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WORKFLOW_STEPS } from "@/data/workflow";

export function WorkflowTopic() {
  return (
    <Section id="automation">
      <SectionHeading
        align="center"
        eyebrow="02"
        title="AI Workflow Automation"
        description="Replace repetitive manual processes with intelligent workflows."
      />

      <ol className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {WORKFLOW_STEPS.map((step, i) => (
          <li key={step} className="card flex items-center gap-4 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach text-sm font-bold text-brand-orange">
              {i + 1}
            </span>
            <span className="text-base font-bold text-heading">{step}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
