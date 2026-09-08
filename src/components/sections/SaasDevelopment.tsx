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

export function SaasDevelopment() {
  return (
    <section id="saas" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="AI-enabled SaaS"
          title="Have an AI product idea?"
          description="We help startups and businesses design, build, and scale AI-enabled software products — from prototype to production."
        />

        <ul className="mt-10 flex flex-wrap gap-3">
          {CAPABILITIES.map((capability) => (
            <li
              key={capability}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70"
            >
              {capability}
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-wrap items-center gap-3">
          {JOURNEY.map((stage, index) => (
            <div key={stage} className="flex items-center gap-3">
              <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">
                {stage}
              </span>
              {index < JOURNEY.length - 1 ? (
                <span className="text-white/30">→</span>
              ) : null}
            </div>
          ))}
        </div>

        <Button href="#contact" className="mt-10">
          Build Your AI Product
        </Button>
      </div>
    </section>
  );
}
