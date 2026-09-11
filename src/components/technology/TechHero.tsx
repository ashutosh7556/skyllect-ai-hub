import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { NavIcon } from "@/components/layout/NavIcons";
import { AccentHeading } from "@/components/technology/SectionShell";
import type { TechnologyPageContent } from "@/types";

/**
 * Page opener. Uses the site's existing particle field rather than a stock
 * photograph, so the page reads as part of Skyllect rather than a template.
 */
export function TechHero({ content }: { content: TechnologyPageContent }) {
  const { hero } = content;

  return (
    <section className="relative overflow-hidden px-5 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[min(520px,70vw)] w-[min(900px,100vw)] -translate-x-1/2 -translate-y-1/3 rounded-full bg-indigo-500/10 blur-[90px]"
      />

      <div className="mx-auto max-w-[1200px]">
        {/* Breadcrumbs read from the left even though the hero copy below is
            centred — that is where a reader looks for their position. */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-white/40">
            <li>Technologies</li>
            <li aria-hidden="true">/</li>
            <li className="text-white/70">{content.navLabel}</li>
          </ol>
        </nav>

        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white/45 sm:text-xs">
            {hero.eyebrow}
          </p>

          <h1 className="font-display text-[clamp(2.1rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[-0.022em] text-foreground">
            <AccentHeading text={hero.heading} accent={hero.accent} />
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-hero-sub opacity-80 sm:text-lg">
            {hero.body}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button href="/#contact">Start a {content.navLabel} Project</Button>
            <Button href="#technology-stack" variant="glass">
              See the Stack
            </Button>
          </div>
        </div>

        {/*
         * Banner. `fill` inside a fixed-ratio box so the crop is identical at
         * every width instead of the frame changing shape with the viewport.
         * `priority` because this is the page's largest contentful paint.
         */}
        <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 sm:mt-16 sm:rounded-3xl">
          {hero.image ? (
            <>
              <Image
                src={hero.image}
                alt={hero.imageAlt}
                fill
                priority
                sizes="(max-width: 1240px) 100vw, 1200px"
                className="object-cover"
              />
              {/* Ties the photograph into the dark page rather than leaving it
                  as a bright rectangle pasted on top. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,7,20,0.20) 0%, rgba(10,7,20,0.05) 45%, rgba(10,7,20,0.55) 100%)",
                }}
              />
            </>
          ) : (
            /*
             * No banner supplied yet. A generated panel carrying the
             * discipline's own icon, rather than a broken image or a
             * borrowed photograph from another page.
             */
            <div
              role="img"
              aria-label={hero.imageAlt}
              className="flex h-full w-full items-center justify-center"
              style={{
                background:
                  "radial-gradient(110% 130% at 30% 0%, rgba(99,102,241,0.26) 0%, rgba(168,85,247,0.13) 42%, rgba(12,9,25,1) 82%)",
              }}
            >
              <span className="text-white/20">
                <NavIcon name={content.icon} className="h-24 w-24 sm:h-36 sm:w-36" />
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
