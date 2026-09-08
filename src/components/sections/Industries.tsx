import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { INDUSTRIES } from "@/data/industries";

/**
 * Renders one industry per page. All three at once is far more than a single
 * screen can hold, and in the book stack each page has to fit the viewport —
 * so the caller pages through them by slug.
 */
export function Industries({ slug, showHeading }: { slug: string; showHeading?: boolean }) {
  const industry = INDUSTRIES.find((item) => item.slug === slug);
  if (!industry) return null;

  return (
    <section
      id={showHeading ? "industries" : undefined}
      className="w-full px-6 py-12"
    >
      <div className="mx-auto max-w-6xl">
        {showHeading ? (
          <SectionHeading eyebrow="Industries" title="AI Solutions for Real Industries" />
        ) : null}

        <div className={showHeading ? "mt-10" : ""}>
          <h3 className="text-3xl font-medium tracking-tight text-white">{industry.name}</h3>
          <p className="mt-2 max-w-xl text-white/50">{industry.headline}</p>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {industry.agents.map((agent) => (
              <div key={agent.name} className="rounded-3xl border border-white/10 p-6">
                <h4 className="text-lg font-medium text-white">{agent.name}</h4>
                <p className="mt-2 text-sm text-white/50">{agent.description}</p>
                <ol className="mt-4 flex flex-col gap-1.5">
                  {agent.steps.map((step) => (
                    <li key={step} className="text-sm text-white/60">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <Button href="#contact" variant="secondary" className="mt-8">
            {industry.ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
