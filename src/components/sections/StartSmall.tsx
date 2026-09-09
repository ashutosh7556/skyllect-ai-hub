import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const EXAMPLES = [
  "Automate incoming quotations",
  "Automate order enquiries",
  "Automate shipment updates",
  "Automate document processing",
  "Automate customer follow-ups",
  "Automate internal reporting",
];

// A leaf only shows a taste of each list — the rest lives behind View More.
const PREVIEW_COUNT = 4;

export function StartSmall() {
  return (
    <section className="w-full px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Start small"
          title="Start Small. Prove the Value. Scale."
          description="You do not need a huge AI transformation project. Start by automating one process that currently consumes significant employee time."
        />

        <ul className="mt-6 grid grid-cols-2 gap-2 sm:mt-10 sm:gap-3 lg:grid-cols-3">
          {EXAMPLES.slice(0, PREVIEW_COUNT).map((example) => (
            <li
              key={example}
              className="rounded-xl border border-white/10 p-3 text-xs text-white/70 sm:rounded-2xl sm:p-4 sm:text-sm"
            >
              {example}
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-2xl text-sm text-white/50 sm:mt-10 sm:text-base">
          Once the workflow proves its value, expand from there.
        </p>

        <Button href="" variant="secondary" className="mt-5 sm:mt-8">
          View More
        </Button>
      </div>
    </section>
  );
}
