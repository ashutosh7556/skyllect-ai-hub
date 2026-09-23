import { Button } from "@/components/ui/Button";
import { Tick } from "@/components/ui/Tick";
import { AccentHeading, Breadcrumb } from "@/components/technology/SectionShell";
import type { CaseStudyContent } from "@/types";

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] font-bold leading-[1.25] text-heading">
      {children}
    </h2>
  );
}

export function CaseStudyBody({ study }: { study: CaseStudyContent }) {
  return (
    <div className="py-10 sm:py-14">
      <div className="container-site">
        <Breadcrumb section="Case Studies" current={study.name} />

        {/* Lead */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div>
            <h1 className="font-display text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] font-bold leading-[1.15] text-heading">
              {study.name}
            </h1>
            <p className="mt-3 text-base font-bold text-brand-blue sm:text-lg">{study.tagline}</p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-body sm:text-lg">
              {study.summary}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button href="/#contact">Start a Project</Button>
              <Button href={study.siteUrl} variant="secondary">
                Visit {study.name}
              </Button>
            </div>
          </div>

          {/*
           * The client mark, contained on a panel. These are small logo files
           * rather than screenshots, so cropping them to fill would wreck them.
           */}
          <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-band p-10">
            {/*
             * Sized by height so both marks scale by the same factor despite
             * very different aspect ratios. Both sources are 32px tall, so
             * this is capped at roughly 1.5x — larger visibly pixelates.
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
              <div key={fact.label} className="card p-4 sm:p-5">
                <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-[15px] text-heading sm:text-base">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Challenge */}
        <section className="mt-14 max-w-3xl sm:mt-20">
          <SubHeading>
            <AccentHeading text={study.challenge.heading} accent={study.challenge.accent} />
          </SubHeading>
          <div className="mt-5 flex flex-col gap-4">
            {study.challenge.body.map((paragraph) => (
              <p key={paragraph} className="text-[15px] leading-relaxed text-body sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Delivered */}
        <section className="mt-14 sm:mt-20">
          <SubHeading>
            <AccentHeading text={study.delivered.heading} accent={study.delivered.accent} />
          </SubHeading>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {study.delivered.items.map((item) => (
              <article key={item.title} className="card p-5 sm:p-6">
                <h3 className="font-display text-lg font-bold text-heading">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-body">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Stack and outcomes */}
        <section className="mt-14 grid gap-10 sm:mt-20 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="font-display text-xl font-bold text-heading sm:text-2xl">Built with</h2>
            <ul className="mt-5 flex flex-wrap gap-2 sm:gap-3">
              {study.stack.map((tech) => (
                <li key={tech} className="chip px-4 py-2 text-sm">
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-heading sm:text-2xl">
              What it changed
            </h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              {study.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3 text-[15px] text-body sm:text-base">
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
