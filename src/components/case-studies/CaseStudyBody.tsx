import { Button } from "@/components/ui/Button";
import { AccentHeading } from "@/components/technology/SectionShell";
import type { CaseStudyContent } from "@/types";

function Tick() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="mt-[3px] h-3.5 w-3.5 shrink-0 text-indigo-300/80"
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

export function CaseStudyBody({ study }: { study: CaseStudyContent }) {
  return (
    <div className="px-5 pt-32 pb-20 sm:px-8 sm:pt-40 sm:pb-28">
      <div className="mx-auto max-w-[1200px]">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-white/40">
            <li>Case Studies</li>
            <li aria-hidden="true">/</li>
            <li className="text-white/70">{study.name}</li>
          </ol>
        </nav>

        {/* Lead */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div>
            <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1.06] tracking-[-0.02em] text-foreground">
              {study.name}
            </h1>
            <p className="mt-3 text-base text-white/60 sm:text-lg">{study.tagline}</p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-hero-sub opacity-80">
              {study.summary}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button href="/#contact">Start a Project</Button>
              <Button href={study.siteUrl} variant="glass">
                Visit {study.name}
              </Button>
            </div>
          </div>

          {/*
           * The client mark, contained on a panel. These are small logo files
           * rather than screenshots, so cropping them to fill would wreck them.
           */}
          <div
            className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-white/10 p-10 sm:rounded-3xl"
            style={{
              background:
                "radial-gradient(120% 120% at 30% 0%, rgba(99,102,241,0.24) 0%, rgba(168,85,247,0.12) 42%, rgba(12,9,25,1) 82%)",
            }}
          >
            {/*
             * Sized by height so both marks scale by the same factor despite
             * very different aspect ratios — Kwot is a wordmark, JobTalk a
             * square icon.
             *
             * Both sources are 32px tall (84x32 and 32x32), so this is capped
             * at roughly 1.5x. Anything larger visibly pixelates: there is no
             * more detail in the file to show. Displaying these bigger needs
             * higher-resolution art, ideally SVG.
             */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={study.logo}
              alt={study.logoAlt}
              className="h-10 w-auto max-w-full object-contain sm:h-12"
            />
          </div>
        </section>

        {/* Facts */}
        <section className="mt-14 sm:mt-20">
          <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {study.facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
              >
                <dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-sm text-white sm:text-base">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Challenge */}
        <section className="mt-14 max-w-3xl sm:mt-20">
          <h2 className="font-display text-[clamp(1.5rem,3.6vw,2.25rem)] font-medium leading-[1.15] tracking-tight text-white">
            <AccentHeading text={study.challenge.heading} accent={study.challenge.accent} />
          </h2>
          <div className="mt-5 flex flex-col gap-4">
            {study.challenge.body.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-white/55 sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Delivered */}
        <section className="mt-14 sm:mt-20">
          <h2 className="font-display text-[clamp(1.5rem,3.6vw,2.25rem)] font-medium leading-[1.15] tracking-tight text-white">
            <AccentHeading text={study.delivered.heading} accent={study.delivered.accent} />
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {study.delivered.items.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05] sm:rounded-3xl sm:p-6"
              >
                <h3 className="font-display text-base font-medium tracking-tight text-white sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Stack and outcomes */}
        <section className="mt-14 grid gap-10 sm:mt-20 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="font-display text-xl font-medium tracking-tight text-white sm:text-2xl">
              Built with
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2 sm:gap-3">
              {study.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white/65 sm:text-sm"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-medium tracking-tight text-white sm:text-2xl">
              What it changed
            </h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              {study.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3 text-sm text-white/70 sm:text-base">
                  <Tick />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
