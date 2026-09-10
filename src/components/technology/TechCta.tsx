import { Button } from "@/components/ui/Button";
import { AccentHeading } from "@/components/technology/SectionShell";
import type { TechnologyPageContent } from "@/types";

/** Closing call to action. */
export function TechCta({ content }: { content: TechnologyPageContent }) {
  const { cta } = content;

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-[clamp(1.75rem,4.5vw,3rem)] font-medium leading-[1.12] tracking-tight text-white">
          <AccentHeading text={cta.heading} accent={cta.accent} />
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
          {cta.body}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button href="/#contact">Book a Technical Consultation</Button>
          <Button href="/" variant="secondary">
            Explore Skyllect
          </Button>
        </div>
      </div>
    </section>
  );
}
