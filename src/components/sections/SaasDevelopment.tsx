import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const CAPABILITIES = [
  "Product architecture",
  "AI agents",
  "RAG and knowledge systems",
  "API development",
  "SaaS dashboards",
  "Authentication",
  "Billing",
  "Integrations",
  "Infrastructure",
  "Monitoring",
  "AI evaluations",
];

const JOURNEY = ["Idea", "Architecture", "AI", "Development", "Launch", "Scale"];

// A leaf only shows a taste of each list — the rest lives behind View More.
const PREVIEW_COUNT = 5;

export function SaasDevelopment() {
  return (
    <section id="saas" className="w-full px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="AI-enabled SaaS"
          title="Have an AI product idea?"
          description="We help startups and businesses design, build, and scale AI-enabled software products — from prototype to production."
        />

        <ul className="mt-6 flex flex-wrap gap-2 sm:mt-10 sm:gap-3">
          {CAPABILITIES.slice(0, PREVIEW_COUNT).map((capability) => (
            <li
              key={capability}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 sm:px-4 sm:py-2 sm:text-sm"
            >
              {capability}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-2 sm:mt-10 sm:gap-3">
          {JOURNEY.map((stage, index) => (
            <div key={stage} className="flex items-center gap-2 sm:gap-3">
              <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 sm:px-4 sm:py-2 sm:text-sm">
                {stage}
              </span>
              {index < JOURNEY.length - 1 ? (
                <span className="text-white/30">→</span>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 sm:mt-10">
          <Button href="#contact">Build Your AI Product</Button>
          <Button href="" variant="secondary">
            View More
          </Button>
        </div>
      </div>
    </section>
  );
}
