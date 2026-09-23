import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CardSlider } from "@/components/ui/CardSlider";
import { INDUSTRIES } from "@/data/industries";

// Only a taste of each list is shown.
const INTEGRATION_SYSTEMS = [
  "CRM",
  "ERP",
  "E-commerce platforms",
  "Accounting software",
  "Email providers",
];
const SAAS_CAPABILITIES = [
  "Product architecture",
  "AI agents",
  "RAG and knowledge systems",
  "API development",
  "SaaS dashboards",
];
const MODERNIZATION_EXAMPLES = [
  "Add AI search to existing software",
  "Automate manual workflows",
  "Introduce AI assistants",
  "Modernize old APIs",
];
const PREVIEW_STEPS = 3;

interface ServiceCardProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  chips: string[];
  cta: string;
}

function ServiceCard({ id, eyebrow, title, description, chips, cta }: ServiceCardProps) {
  return (
    <article id={id} className="card flex w-full scroll-mt-24 flex-col overflow-hidden">
      {/* Same blue header as the industry cards, so the slider reads as one set. */}
      <header className="card-header-soft border-b border-line px-6 py-5 text-heading lg:min-h-[156px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-orange">{eyebrow}</p>
        <h3 className="font-display mt-2 text-xl font-bold leading-snug">{title}</h3>
      </header>

      <div className="px-6 py-5">
        <p className="text-[15px] leading-relaxed text-body">{description}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li key={chip} className="chip px-3 py-1 text-xs sm:text-sm">
              {chip}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto border-t border-line px-5 py-4">
        <Button href="#contact">{cta}</Button>
      </div>
    </article>
  );
}

/**
 * Integrations, SaaS, modernization and the three industries as one slider:
 * three service cards followed by one card per industry with its agents.
 */
export function ServicesAndIndustries() {
  return (
    <Section muted>
      <CardSlider>
        <ServiceCard
          id="integrations"
          eyebrow="AI integrations"
          title={
            <>
              Already using software that works well?{" "}
              <span className="text-brand-blue">You don&apos;t need to replace it.</span>
            </>
          }
          description="We integrate AI into your existing technology stack. AI becomes an intelligent layer across your existing systems."
          chips={INTEGRATION_SYSTEMS}
          cta="Discuss an Integration"
        />
        <ServiceCard
          id="saas"
          eyebrow="AI-enabled SaaS"
          title="Have an AI product idea?"
          description="We help startups and businesses design, build, and scale AI-enabled software products — from prototype to production."
          chips={SAAS_CAPABILITIES}
          cta="Build Your AI Product"
        />
        <ServiceCard
          id="modernization"
          eyebrow="Modernization"
          title="Your existing software does not need to be replaced just because AI has arrived."
          description="We modernize older applications and introduce AI capabilities without rebuilding everything from scratch."
          chips={MODERNIZATION_EXAMPLES}
          cta="Modernize Your Software"
        />
        {INDUSTRIES.map((industry, index) => (
          <article
            key={industry.slug}
            // The first industry card is where the Industries nav link lands.
            id={index === 0 ? "industries" : undefined}
            className="card flex w-full scroll-mt-24 flex-col overflow-hidden"
          >
            <header className="card-header-soft border-b border-line px-6 py-5 text-heading lg:min-h-[156px]">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-orange">
                AI Solutions for Real Industries
              </p>
              <h3 className="font-display mt-2 text-xl font-bold">{industry.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-body">{industry.headline}</p>
            </header>

            <ul className="flex flex-col divide-y divide-line px-6">
              {industry.agents.map((agent) => (
                <li key={agent.name} className="py-4">
                  <h4 className="text-base font-bold text-heading">{agent.name}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-body">{agent.description}</p>
                  <ol className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {agent.steps.slice(0, PREVIEW_STEPS).map((step, i) => (
                      <li key={step} className="text-[13px] text-muted">
                        <span className="font-bold text-brand-orange">{i + 1}.</span> {step}
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ul>

            <div className="mt-auto border-t border-line px-5 py-4">
              <Button href="#contact">{industry.ctaLabel}</Button>
            </div>
          </article>
        ))}
      </CardSlider>
    </Section>
  );
}
