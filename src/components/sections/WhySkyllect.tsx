import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const CAPABILITIES = [
  "AI Engineering",
  "Web Application Development",
  "API Development",
  "Database Engineering",
  "Cloud Infrastructure",
  "Business System Integration",
  "Automation",
  "SaaS Development",
];

// A leaf only shows a taste of each list — the rest lives behind View More.
const PREVIEW_COUNT = 4;

export function WhySkyllect() {
  return (
    <section className="w-full px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Why Skyllect"
          title="AI projects require more than prompts and chatbots."
          description="They require real software engineering. This allows us to build AI systems that work inside existing business operations — not isolated AI experiments."
        />

        <ul className="mt-6 grid grid-cols-2 gap-2 sm:mt-16 sm:gap-4 lg:grid-cols-4">
          {CAPABILITIES.slice(0, PREVIEW_COUNT).map((capability) => (
            <li
              key={capability}
              className="rounded-xl border border-white/10 p-3 text-center text-xs text-white/70 sm:rounded-2xl sm:p-5 sm:text-sm"
            >
              {capability}
            </li>
          ))}
        </ul>

        <Button href="" variant="secondary" className="mt-5 sm:mt-8">
          View More
        </Button>
      </div>
    </section>
  );
}
