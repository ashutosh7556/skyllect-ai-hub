import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
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
        <Reveal>
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
                <Button href="/contact">Start a Project</Button>
                <Button href={study.siteUrl} variant="secondary">
                  Visit {study.name}
                </Button>
              </div>
            </div>

            {study.preview ? (
              // The client's live homepage in a simple browser frame.
              <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_50px_-28px_rgba(15,27,51,0.45)]">
                <div className="flex items-center gap-3 border-b border-line bg-background px-4 py-2.5">
                  <span aria-hidden="true" className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </span>
                  <span className="truncate rounded-md bg-surface px-3 py-0.5 text-xs text-muted">
                    {study.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </span>
                </div>
                <Image
                  src={study.preview.src}
                  alt={study.preview.alt}
                  width={1600}
                  height={1000}
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="h-auto w-full"
                />
              </div>
            ) : (
              /*
               * The client mark, contained on a panel. These are small logo
               * files, so cropping them to fill would wreck them.
               */
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-band p-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={study.logo}
                  alt={study.logoAlt}
                  className="h-10 w-auto max-w-full object-contain sm:h-12"
                />
              </div>
            )}
          </section>
        </Reveal>

        {/* Facts */}
        <Reveal>
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
        </Reveal>

        {/* Product imagery from the client's site, on their brand colour. */}
        {study.showcase?.length ? (
          <Reveal>
            <section className="mt-14 sm:mt-20">
              <SubHeading>The product</SubHeading>
              <div
                className="mt-6 flex flex-col items-center gap-6 overflow-hidden rounded-[1.75rem] px-5 py-8 sm:px-10 sm:py-12 lg:flex-row lg:justify-center"
                style={{ background: study.brandColor ?? "var(--band)" }}
              >
                {study.showcase.map((shot, i) => (
                  <Image
                    key={shot.src}
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    sizes="(max-width: 1024px) 100vw, 900px"
                    className={
                      study.showcase!.length > 1 && i > 0
                        ? "h-auto w-full max-w-[320px] lg:w-[28%]"
                        : "h-auto w-full lg:w-auto lg:max-w-full lg:flex-1"
                    }
                  />
                ))}
              </div>
            </section>
          </Reveal>
        ) : null}

        {/* Challenge */}
        <Reveal>
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
        </Reveal>

        {/* Delivered */}
        <Reveal>
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
        </Reveal>

        {/* Stack and outcomes */}
        <Reveal>
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
        </Reveal>
      </div>
    </div>
  );
}
