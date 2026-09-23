import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { NavIcon } from "@/components/layout/NavIcons";
import { AccentHeading, Breadcrumb } from "@/components/technology/SectionShell";
import type { TechnologyPageContent } from "@/types";

/** Page opener: breadcrumb, centred headline, calls to action and a banner. */
export function TechHero({ content }: { content: TechnologyPageContent }) {
  const { hero } = content;

  return (
    <section className="bg-mesh pt-10 pb-14 sm:pt-14 sm:pb-20">
      <div className="container-site">
        {/* Breadcrumbs read from the left even though the hero copy below is
            centred — that is where a reader looks for their position. */}
        <Breadcrumb section="Technologies" current={content.navLabel} />

        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-5 inline-flex rounded-full bg-mist px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">
            {hero.eyebrow}
          </p>

          <h1 className="font-display text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] font-bold leading-[1.15] text-heading">
            <AccentHeading text={hero.heading} accent={hero.accent} />
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-body sm:text-lg">
            {hero.body}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button href="/#contact">Start a {content.navLabel} Project</Button>
            <Button href="#technology-stack" variant="secondary">
              See the Stack
            </Button>
          </div>
        </div>

        {/*
         * Banner. `fill` inside a fixed-ratio box so the crop is identical at
         * every width instead of the frame changing shape with the viewport.
         * `priority` because this is the page's largest contentful paint.
         */}
        <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-line sm:mt-16">
          {hero.image ? (
            <Image
              src={hero.image}
              alt={hero.imageAlt}
              fill
              priority
              sizes="(max-width: 1320px) 100vw, 1260px"
              className="object-cover"
            />
          ) : (
            /*
             * No banner supplied yet. A plain panel carrying the discipline's
             * own icon, rather than a broken image or a borrowed photograph.
             */
            <div
              role="img"
              aria-label={hero.imageAlt}
              className="flex h-full w-full items-center justify-center bg-band"
            >
              <span className="text-brand-blue/40">
                <NavIcon name={content.icon} className="h-24 w-24 sm:h-36 sm:w-36" />
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
