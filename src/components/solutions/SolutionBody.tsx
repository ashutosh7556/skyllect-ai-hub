import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Tick } from "@/components/ui/Tick";
import { NavIcon } from "@/components/layout/NavIcons";
import { AccentHeading } from "@/components/technology/SectionShell";
import type { SolutionContent } from "@/types";

/** Section heading used inside the content area. */
function BlockHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[clamp(1.35rem,1.1rem+1vw,2rem)] font-bold text-heading">
      {children}
    </h2>
  );
}

/**
 * The part that changes between solutions. Everything around it — header,
 * breadcrumb, container — belongs to the shell and stays put.
 */
export function SolutionBody({ solution }: { solution: SolutionContent }) {
  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {/* Lead: copy on the left, visual on the right. */}
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
        <div>
          <h1 className="font-display text-[clamp(1.9rem,1.4rem+2.2vw,3.25rem)] font-bold leading-[1.15] text-heading">
            <AccentHeading text={solution.heading} accent={solution.accent} />
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-body sm:text-lg">
            {solution.summary}
          </p>

          <ul className="mt-7 flex flex-col gap-2.5">
            {solution.handles.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] text-body sm:text-base">
                <Tick />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button href="/#contact">Book a Consultation</Button>
            <Button href="/#automation" variant="secondary">
              See How Automation Works
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line">
          {solution.image ? (
            <Image
              src={solution.image}
              alt={solution.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
            />
          ) : (
            /*
             * Stand-in until a photograph is dropped in. Built from the
             * solution's own icon so each one is visually distinct rather
             * than an empty grey box.
             */
            <div
              role="img"
              aria-label={solution.imageAlt}
              className="flex h-full w-full items-center justify-center bg-band"
            >
              <span className="text-brand-blue/40">
                <NavIcon name={solution.icon} className="h-24 w-24 sm:h-32 sm:w-32" />
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Outcomes */}
      <section>
        <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {solution.outcomes.map((outcome) => (
            <div key={outcome.label} className="card p-4 sm:p-5">
              <dt className="sr-only">{outcome.label}</dt>
              <dd>
                <span className="font-display block text-xl font-bold text-brand-orange sm:text-2xl">
                  {outcome.value}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-body">
                  {outcome.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Use cases */}
      <section>
        <BlockHeading>Where it earns its place</BlockHeading>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:gap-5">
          {solution.useCases.map((useCase) => (
            <article key={useCase.title} className="card p-5 sm:p-6">
              <h3 className="font-display text-lg font-bold text-heading">{useCase.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-body">{useCase.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section>
        <BlockHeading>How it works</BlockHeading>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {solution.howItWorks.map((step, i) => (
            <li key={step.title} className="card p-5">
              <p className="font-display text-xl font-bold text-brand-orange">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display mt-1.5 text-base font-bold text-heading sm:text-lg">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-body">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Integrations */}
      <section>
        <BlockHeading>Connects with</BlockHeading>
        <ul className="mt-6 flex flex-wrap gap-2 sm:gap-3">
          {solution.integrations.map((integration) => (
            <li key={integration} className="chip px-4 py-2 text-sm">
              {integration}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
