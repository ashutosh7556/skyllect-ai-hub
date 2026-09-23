import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { CardSlider } from "@/components/ui/CardSlider";
import { ServicesSideArt } from "@/components/sections/ServicesSideArt";
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

interface ServiceCardProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  /** Optional short line under the title, for headers with room to spare. */
  tagline?: string;
  description: string;
  chips: string[];
  cta: string;
}

function ServiceCard({ id, eyebrow, title, tagline, description, chips, cta }: ServiceCardProps) {
  return (
    <article id={id} className="card card-lift flex w-full scroll-mt-24 flex-col overflow-hidden shadow-none">
      {/* Same blue header as the industry cards, so the slider reads as one set. */}
      <header className="card-header-strong px-6 py-6 text-white lg:min-h-[172px]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">{eyebrow}</p>
        <h3 className="font-display mt-2 text-[22px] font-bold leading-snug">{title}</h3>
        {tagline ? <p className="mt-2 text-[17px] leading-snug text-white/90 sm:text-lg">{tagline}</p> : null}
      </header>

      <div className="px-6 py-5">
        <p className="text-base leading-relaxed text-body sm:text-[17px]">{description}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li key={chip} className="chip px-3.5 py-1.5 text-sm sm:text-[15px]">
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
    <section className="bg-band py-16 sm:py-20">
      {/* Widens on very large screens so the two illustrations can sit beside
          the slider; below 2xl the section keeps the standard container. */}
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 2xl:max-w-[1840px]">
        <div className="2xl:grid 2xl:grid-cols-[1fr_minmax(0,1100px)_1fr] 2xl:items-center 2xl:gap-6 3xl:grid-cols-[1fr_minmax(0,1240px)_1fr]">
          <ServicesSideArt side="left" className="hidden justify-self-end 2xl:block" />

          <div className="min-w-0">
            <CardSlider>
              <ServiceCard
                id="integrations"
                eyebrow="AI integrations"
                title={
                  <>
                    Already using software that works well?{" "}
                    <span className="text-[#ffd3ae]">You don&apos;t need to replace it.</span>
                  </>
                }
                description="We integrate AI into your existing technology stack. AI becomes an intelligent layer across your existing systems."
                tagline="Works alongside the CRM, ERP and tools you already use."
                chips={INTEGRATION_SYSTEMS}
                cta="Discuss an Integration"
              />
              <ServiceCard
                id="saas"
                eyebrow="AI-enabled SaaS"
                title="Have an AI product idea?"
                description="We help startups and businesses design, build, and scale AI-enabled software products — from prototype to production."
                tagline="From first prototype to a production-ready product, built end to end."
                chips={SAAS_CAPABILITIES}
                cta="Build Your AI Product"
              />
              <ServiceCard
                id="modernization"
                eyebrow="Modernization"
                title="Your existing software stays."
                tagline="It doesn't need to be replaced just because AI has arrived."
                description="We modernize older applications and introduce AI capabilities without rebuilding everything from scratch."
                chips={MODERNIZATION_EXAMPLES}
                cta="Modernize Your Software"
              />
              {INDUSTRIES.map((industry, index) => (
                <article
                  key={industry.slug}
                  // The first industry card is where the Industries nav link lands.
                  id={index === 0 ? "industries" : undefined}
                  className="card card-lift flex w-full scroll-mt-24 flex-col overflow-hidden shadow-none"
                >
                  <header className="card-header-strong px-6 py-6 text-white lg:min-h-[172px]">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">
                      Industry
                    </p>
                    <h3 className="font-display mt-2 text-[22px] font-bold leading-snug">{industry.name}</h3>
                    {industry.tagline ? (
                      <p className="mt-2 text-[17px] leading-snug text-white/90 sm:text-lg">{industry.tagline}</p>
                    ) : null}
                  </header>

                  {/* Same body as the service cards: summary, then the agents as
                      tags. The per-agent detail lives on the industry pages. */}
                  <div className="px-6 py-5">
                    <p className="text-base leading-relaxed text-body sm:text-[17px]">{industry.headline}</p>

                    <ul className="mt-5 flex flex-wrap gap-2">
                      {industry.agents.map((agent) => (
                        <li key={agent.name} className="chip px-3.5 py-1.5 text-sm sm:text-[15px]">
                          {agent.name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto border-t border-line px-5 py-4">
                    <Button href="#contact">{industry.ctaLabel}</Button>
                  </div>
                </article>
              ))}
            </CardSlider>
          </div>

          <ServicesSideArt side="right" className="hidden justify-self-start 2xl:block" />
        </div>
      </div>
    </section>
  );
}
