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

// A leaf only shows a taste of each list — the rest lives behind View More.
const PREVIEW_COUNT = 4;

export function Modernization() {
  return (
    <section id="modernization" className="w-full px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Modernization"
          title="Your existing software does not need to be replaced just because AI has arrived."
          description="We modernize older applications and introduce AI capabilities without rebuilding everything from scratch."
        />

        <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-8 sm:gap-3">
          {TRANSFORMATION.map((stage, index) => (
            <div key={stage} className="flex items-center gap-2 sm:gap-3">
              <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 sm:px-4 sm:py-2 sm:text-sm">
                {stage}
              </span>
              {index < TRANSFORMATION.length - 1 ? (
                <span className="text-white/30">→</span>
              ) : null}
            </div>
          ))}
        </div>

        <ul className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3 lg:grid-cols-4">
          {EXAMPLES.slice(0, PREVIEW_COUNT).map((example) => (
            <li
              key={example}
              className="rounded-xl border border-white/10 p-3 text-xs text-white/70 sm:rounded-2xl sm:p-4 sm:text-sm"
            >
              {example}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-3 sm:mt-8">
          <Button href="#contact">Modernize Your Software</Button>
          <Button href="" variant="secondary">
            View More
          </Button>
        </div>
      </div>
    </section>
  );
}
