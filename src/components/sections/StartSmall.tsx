import { SectionHeading } from "@/components/ui/SectionHeading";

const EXAMPLES = [
  "Automate incoming quotations",
  "Automate order enquiries",
  "Automate shipment updates",
  "Automate document processing",
  "Automate customer follow-ups",
  "Automate internal reporting",
];

export function StartSmall() {
  return (
    <section className="w-full px-5 py-14 sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Start small"
          title="Start Small. Prove the Value. Scale."
          description="You do not need a huge AI transformation project. Start by automating one process that currently consumes significant employee time."
        />

        <ul className="mt-6 grid grid-cols-2 gap-2 sm:mt-10 sm:gap-3 lg:grid-cols-3">
          {EXAMPLES.map((example) => (
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
      </div>
    </section>
  );
}
