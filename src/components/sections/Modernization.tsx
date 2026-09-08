import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const EXAMPLES = [
  "Add AI search to existing software",
  "Automate manual workflows",
  "Introduce AI assistants",
  "Modernize old APIs",
  "Add document intelligence",
  "Build integrations",
  "Improve reporting",
  "Upgrade legacy web applications",
];

const TRANSFORMATION = ["Legacy System", "Connected System", "AI-Enabled System"];

export function Modernization() {
  return (
    <section id="modernization" className="w-full px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Modernization"
          title="Your existing software does not need to be replaced just because AI has arrived."
          description="We modernize older applications and introduce AI capabilities without rebuilding everything from scratch."
        />

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {TRANSFORMATION.map((stage, index) => (
            <div key={stage} className="flex items-center gap-3">
              <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">
                {stage}
              </span>
              {index < TRANSFORMATION.length - 1 ? (
                <span className="text-white/30">→</span>
              ) : null}
            </div>
          ))}
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EXAMPLES.map((example) => (
            <li
              key={example}
              className="rounded-2xl border border-white/10 p-4 text-sm text-white/70"
            >
              {example}
            </li>
          ))}
        </ul>

        <Button href="#contact" className="mt-8">
          Modernize Your Software
        </Button>
      </div>
    </section>
  );
}
