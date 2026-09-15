import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { NavIcon } from "@/components/layout/NavIcons";
import { AccentHeading } from "@/components/technology/SectionShell";
import type { SolutionContent } from "@/types";

/** Section heading used inside the swapping content area. */
function BlockHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl font-medium tracking-tight text-foreground sm:text-2xl">
      {children}
    </h2>
  );
}

function Tick() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-[3px] h-3.5 w-3.5 shrink-0 text-accent/80"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8.5 6.5 11.5 12.5 5" />
    </svg>
  );
}

/**
 * The part that changes between solutions. Everything around it — header,
 * rail, container — belongs to the shell and stays put.
 */
export function SolutionBody({ solution }: { solution: SolutionContent }) {
  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {/* Lead: copy on the left, visual on the right. */}
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
        <div>
          <h1 className="font-display text-[clamp(1.9rem,4.6vw,3.25rem)] font-normal leading-[1.08] tracking-[-0.02em] text-foreground">
            <AccentHeading text={solution.heading} accent={solution.accent} />
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-hero-sub opacity-80">
            {solution.summary}
          </p>

          <ul className="mt-7 flex flex-col gap-2.5">
            {solution.handles.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-hero-sub sm:text-base">
                <Tick />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button href="/#contact">Book a Consultation</Button>
            <Button href="/#automation" variant="glass">
              See How Automation Works
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-edge sm:rounded-3xl">
          {solution.image ? (
            <Image
              src={solution.image}
              alt={solution.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover"
            />
          ) : (
            /*
             * Generated stand-in until a photograph is dropped in. Built from
             * the solution's own icon so each one is visually distinct rather
             * than an empty grey box.
             */
            <div
              role="img"
              aria-label={solution.imageAlt}
              className="flex h-full w-full items-center justify-center"
              style={{
                background:
                  "radial-gradient(120% 120% at 25% 0%, rgba(92,200,232,0.20) 0%, rgba(106,92,224,0.10) 40%, rgba(4,6,11,1) 80%)",
              }}
            >
              <span className="text-muted/70">
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
            <div
              key={outcome.label}
              className="rounded-2xl border border-edge bg-surface-2/60 p-4 sm:p-5"
            >
              <dt className="sr-only">{outcome.label}</dt>
              <dd>
                <span className="font-display block text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                  {outcome.value}
                </span>
                <span className="mt-1.5 block text-xs leading-relaxed text-muted/70 sm:text-sm">
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
            <article
              key={useCase.title}
              className="rounded-2xl border border-edge bg-surface-2/60 p-5 transition-colors duration-300 hover:border-edge-strong hover:bg-surface-3/70 sm:rounded-3xl sm:p-6"
            >
              <h3 className="font-display text-base font-medium tracking-tight text-foreground sm:text-lg">
                {useCase.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {useCase.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section>
        <BlockHeading>How it works</BlockHeading>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {solution.howItWorks.map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl border border-edge bg-surface-2/60 p-5 sm:rounded-3xl"
            >
              <p className="font-mono text-xs text-muted/70">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display mt-1.5 text-base font-medium tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Integrations */}
      <section>
        <BlockHeading>Connects with</BlockHeading>
        <ul className="mt-6 flex flex-wrap gap-2 sm:gap-3">
          {solution.integrations.map((integration) => (
            <li
              key={integration}
              className="rounded-full border border-edge bg-surface-2/60 px-3.5 py-2 text-xs text-hero-sub sm:text-sm"
            >
              {integration}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
