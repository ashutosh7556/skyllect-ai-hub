import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { INDUSTRIES } from "@/data/industries";

/**
 * Renders one industry per page. All three at once is far more than a single
 * screen can hold, and in the book stack each page has to fit the viewport —
 * so the caller pages through them by slug.
 */
// A leaf only shows a taste of each agent's run — the rest lives behind
// View More.
const PREVIEW_STEPS = 3;

export function Industries({ slug, showHeading }: { slug: string; showHeading?: boolean }) {
  const industry = INDUSTRIES.find((item) => item.slug === slug);
  if (!industry) return null;

  return (
    <section
      id={showHeading ? "industries" : undefined}
      className="w-full px-5 py-8 sm:px-8 sm:py-10"
    >
      <div className="mx-auto max-w-6xl">
        {showHeading ? (
          <SectionHeading eyebrow="Industries" title="AI Solutions for Real Industries" />
        ) : null}

        <div className={showHeading ? "mt-6 sm:mt-10" : ""}>
          <h3 className="text-xl font-medium tracking-tight text-white sm:text-3xl">
            {industry.name}
          </h3>
          <p className="mt-1.5 max-w-xl text-sm text-white/50 sm:mt-2 sm:text-base">
            {industry.headline}
          </p>

          {/* Three dense cards do not fit a phone page in the book stack, so
              below sm they become a snapping horizontal row instead of a
              column that would overflow the viewport. */}
          <div className="-mx-5 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-8 sm:grid sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
            {industry.agents.map((agent) => (
              <div
                key={agent.name}
                className="w-[78vw] shrink-0 snap-start rounded-2xl border border-white/10 p-4 sm:w-auto sm:shrink sm:rounded-3xl sm:p-6"
              >
                <h4 className="text-base font-medium text-white sm:text-lg">{agent.name}</h4>
                <p className="mt-1.5 text-xs text-white/50 sm:mt-2 sm:text-sm">
                  {agent.description}
                </p>
                <ol className="mt-3 flex flex-col gap-1 sm:mt-4 sm:gap-1.5">
                  {agent.steps.slice(0, PREVIEW_STEPS).map((step) => (
                    <li key={step} className="text-xs text-white/60 sm:text-sm">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3 sm:mt-8">
            <Button href="#contact" variant="secondary">
              {industry.ctaLabel}
            </Button>
            <Button href="" variant="secondary">
              View More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
