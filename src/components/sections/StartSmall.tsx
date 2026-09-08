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
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Start small"
          title="Start Small. Prove the Value. Scale."
          description="You do not need a huge AI transformation project. Start by automating one process that currently consumes significant employee time."
        />

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMPLES.map((example) => (
            <li
              key={example}
              className="rounded-2xl border border-white/10 p-4 text-sm text-white/70"
            >
              {example}
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-2xl text-white/50">
          Once the workflow proves its value, expand from there.
        </p>
      </div>
    </section>
  );
}
